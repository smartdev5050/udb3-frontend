import copyToClipboard from 'clipboard-copy';
import { addDays, differenceInDays, format, parse } from 'date-fns';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import pick from 'lodash/pick';
import setWith from 'lodash/setWith';
import type { ClipboardEvent, FormEvent } from 'react';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { parseSpacing } from './Box';
import { Button, ButtonVariants } from './Button';
import { DatePeriodPicker } from './DatePeriodPicker';
import { Icon, Icons } from './Icon';
import type { InlineProps } from './Inline';
import { getInlineProps, Inline } from './Inline';
import { Input } from './Input';
import { Label } from './Label';
import type { StackProps } from './Stack';
import { getStackProps, Stack } from './Stack';
import { Text } from './Text';

const formatTimeValue = (value: string) => {
  if (!value) {
    return null;
  }

  // is already in correct format
  if (/[0-2][0-4]h[0-5][0-9]m/.test(value)) {
    return value;
  }

  if (isNaN(value as any)) {
    return null;
  }

  let tranformedValue = value;

  // pad start with zero if 1 digit
  if (tranformedValue.length === 1) {
    tranformedValue = tranformedValue.padStart(2, '0');
  }

  // pad end with zeros if too short
  if (tranformedValue.length < 4) {
    tranformedValue = tranformedValue.padEnd(4, '0');
  }

  const firstChars = tranformedValue.substring(0, 2);
  const lastChars = tranformedValue.substring(2, 4);
  const firstDigits = parseInt(firstChars);
  const lastDigits = parseInt(lastChars);

  // check if first 2 numbers are above 0 and below or equal to 24
  if (firstDigits < 0 || firstDigits > 24) return null;

  // check if last 2 numbers are above 0 and below or equal to 59
  if (lastDigits < 0 || lastDigits > 59) return null;

  // transform into "h m" format
  return `${firstChars}h${lastChars}m`;
};

type Time = string;

const amountOfColumns = 7;

type Data = { [index: string]: Time };
type TimeTableData = { [date: string]: Data };

type TimeTableValue = {
  dateStart: string;
  dateEnd: string;
  data: TimeTableData;
};

type CopyPayload =
  | {
      method: 'row';
      data: Data;
    }
  | { method: 'all'; data: { [key: string]: Data } };

type RowProps = InlineProps & {
  data: Object;
  date: string;
  onCopy: (date: string) => void;
  onRowPaste: (payload: CopyPayload, index: number, date: string) => void;
  onEditCell: (
    {
      index,
      date,
      value,
    }: {
      index: number;
      date: string;
      value: string;
    },
    mode: 'blur' | 'change',
  ) => void;
};

const Row = ({
  data,
  date,
  onEditCell,
  onCopy,
  onRowPaste,
  ...props
}: RowProps): any => {
  const handlePaste = (
    event: ClipboardEvent<HTMLFormElement>,
    index: number,
    date: string,
  ) => {
    const clipboardData = (event.clipboardData || window.clipboardData).getData(
      'text',
    );
    try {
      const clipboardValue = JSON.parse(clipboardData);
      event.preventDefault();
      onRowPaste(clipboardValue, index, date);
    } catch (e) {
      // fallback to normal copy / paste when the data is not JSON
    }
  };

  return [
    <Text key="dateLabel">{date}</Text>,
    ...Array.from({ length: amountOfColumns }, (_, index) => {
      return (
        <Input
          id={`${date}-${index}`}
          key={`${date}-${index}`}
          value={data?.[index] ?? ''}
          onChange={(event) =>
            onEditCell({ index, date, value: event.target.value }, 'change')
          }
          onBlur={(event: FormEvent<HTMLInputElement>) => {
            onEditCell(
              {
                index,
                date,
                value: formatTimeValue(
                  (event.target as HTMLInputElement).value,
                ),
              },
              'blur',
            );
          }}
          onPaste={(event) => handlePaste(event, index, date)}
        />
      );
    }),
    <Button
      key="copyButton"
      variant={ButtonVariants.UNSTYLED}
      onClick={() => onCopy(date)}
      customChildren
      {...getInlineProps(props)}
    >
      <Icon name={Icons.COPY} />
    </Button>,
  ];
};

type HeaderProps = InlineProps & {
  header: string;
  index: number;
};

const Header = ({ header, index, ...props }: HeaderProps) => {
  return (
    <Inline
      as="div"
      justifyContent="space-between"
      paddingLeft={1}
      paddingRight={1}
      spacing={3}
      {...getInlineProps(props)}
    >
      <Label htmlFor={header}>{header}</Label>
    </Inline>
  );
};

type Props = {
  id: string;
  value: TimeTableValue;
  onChange: (value: TimeTableValue) => void;
} & StackProps;

const updateCell = ({
  originalData,
  date,
  index,
  value,
}: {
  originalData: TimeTableData;
  date: string;
  index: number;
  value: string;
}) => setWith(originalData, `[${date}][${index}]`, value, Object);

const getDateRange = (
  dateStartString: string,
  dateEndString: string,
): string[] => {
  const dateStart = parseDate(dateStartString);
  const daysInBetween = differenceInDays(parseDate(dateEndString), dateStart);

  if (dateStartString === dateEndString) {
    return [dateStartString];
  }

  return [
    dateStartString,
    ...Array.from({ length: daysInBetween - 1 }, (_, i) =>
      formatDate(addDays(dateStart, i + 1)),
    ),
    dateEndString,
  ];
};

const parseDate = (dateString: string) =>
  parse(dateString, 'dd/MM/yyyy', new Date());
const formatDate = (date: Date) => format(date, 'dd/MM/yyyy');

const cleanData = (data: Data): Data => ({ ...omitBy(data, isNil) });

const TimeTable = ({ id, className, onChange, value, ...props }: Props) => {
  const { t } = useTranslation();

  const dateRange = useMemo(() => {
    if (!value?.dateStart || !value?.dateEnd) return [];
    return getDateRange(value.dateStart, value.dateEnd);
  }, [value?.dateStart, value?.dateEnd]);

  const cleanValue = (dateStart: string, dateEnd: string, toCleanValue) => {
    const range = getDateRange(dateStart, dateEnd);
    const data = pick(toCleanValue.data, range);

    return {
      ...toCleanValue,
      // clean data that is not relevant for the range
      data,
    };
  };

  useEffect(() => {
    if (!value?.dateStart || !value?.dateEnd) {
      const todayDateString = formatDate(new Date());
      onChange({
        data: value?.data ?? {},
        dateStart: todayDateString,
        dateEnd: todayDateString,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePaste = (payload: CopyPayload, index: number, date: string) => {
    if (payload.method === 'row') {
      onChange({
        ...value,
        data: {
          ...value.data,
          [date]: payload.data,
        },
      });
    }
    if (payload.method === 'all') {
      onChange({
        ...value,
        data: Object.keys(payload.data).reduce<TimeTableData>((data, index) => {
          return {
            ...data,
            [dateRange[index]]: payload.data[index],
          };
        }, {}),
      });
    }
  };

  const handleCopyRow = (date: string) => {
    const copyAction: CopyPayload = {
      method: 'row',
      data: cleanData(value.data?.[date]),
    };
    copyToClipboard(JSON.stringify(copyAction));
  };

  const handleCopyAll = () => {
    const copyAction: CopyPayload = {
      method: 'all',
      data: dateRange.reduce<{ [key: string]: Data }>((data, date, index) => {
        const rowData = value?.data?.[date];
        if (!rowData || !Object.keys(cleanData(rowData)).length) {
          return data;
        }

        return {
          ...data,
          [index]: cleanData(rowData),
        };
      }, {}),
    };
    copyToClipboard(JSON.stringify(copyAction));
  };

  const handleDateStartChange = (date: Date) => {
    onChange(
      cleanValue(value.dateStart, value.dateEnd, {
        ...value,
        dateStart: formatDate(date),
      }),
    );
  };

  const handleDateEndChange = (date: Date) => {
    onChange(
      cleanValue(value.dateStart, value.dateEnd, {
        ...value,
        dateEnd: formatDate(date),
      }),
    );
  };

  const handleEditCell = (
    {
      index,
      date,
      value: cellValue,
    }: { index: number; date: string; value: string },
    mode: 'change' | 'blur',
  ) => {
    onChange({
      ...value,
      data: updateCell({
        originalData: value.data ?? {},
        date,
        value: cellValue,
        index,
      }),
    });
  };

  if (!value?.dateStart || !value?.dateEnd) return null;

  return (
    <Stack
      as="div"
      spacing={4}
      className={className}
      alignItems="flex-start"
      {...getStackProps(props)}
    >
      <DatePeriodPicker
        id={id}
        dateStart={parseDate(value.dateStart)}
        dateEnd={parseDate(value.dateEnd)}
        onDateStartChange={handleDateStartChange}
        onDateEndChange={handleDateEndChange}
      />
      <Stack
        forwardedAs="div"
        css={`
          display: grid;
          grid-template-rows: repeat(${(dateRange?.length ?? 0) + 1}, 1fr);
          grid-template-columns:
            min-content repeat(7, 1fr)
            min-content;
          column-gap: ${parseSpacing(3)};
          row-gap: ${parseSpacing(3)};
          align-items: center;
        `}
      >
        {[
          <Text key="pre" />,
          ...Array.from({ length: amountOfColumns }, (_, index) => {
            const header = `t${index + 1}`;
            return <Header key={header} header={header} index={index} />;
          }),
          <Text key="post" />,
        ]}
        {dateRange.map((date) => (
          <Row
            key={date}
            date={date}
            data={value?.data?.[date]}
            onCopy={handleCopyRow}
            onRowPaste={handlePaste}
            onEditCell={handleEditCell}
          />
        ))}
      </Stack>
      <Button
        spacing={3}
        flex="none"
        iconName={Icons.COPY}
        onClick={handleCopyAll}
      >
        {t('movies.create.actions.copy_table')}
      </Button>
    </Stack>
  );
};

export { formatTimeValue, TimeTable };
export type { TimeTableData, TimeTableValue };
