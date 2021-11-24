import copyToClipboard from 'clipboard-copy';
import { addDays, differenceInDays, format, parse } from 'date-fns';
import { pick, setWith } from 'lodash';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { parseSpacing } from './Box';
import { Button, ButtonVariants } from './Button';
import { DatePeriodPicker } from './DatePeriodPicker';
import { Icon, Icons } from './Icon';
import type { InlineProps } from './Inline';
import { getInlineProps, Inline } from './Inline';
import { Input } from './Input';
import { Label } from './Label';
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

type TimeTableData = { [key: string]: { [index: string]: Time } };

type TimeTableValue = {
  dateStart: string;
  dateEnd: string;
  data: TimeTableData;
};

type CopyPayload =
  | {
      method: 'row' | 'col';
      data: Time[];
    }
  | { method: 'all'; data: TimeTableData };

type RowProps = InlineProps & {
  data: Object;
  date: string;
  onCopy: (date: string) => void;
  onEditCell: ({
    index,
    date,
    value,
  }: {
    index: number;
    date: string;
    value: string;
  }) => void;
};

const Row = ({ data, date, onEditCell, onCopy, ...props }: RowProps) => {
  return [
    <Text key="dateLabel">{date}</Text>,
    ...Array.from({ length: amountOfColumns }, (_, i) => data?.[i]).map(
      (value, index) => (
        <Input
          id={`${date}-${index}`}
          key={`${date}-${index}`}
          value={value ?? ''}
          onChange={(event) =>
            onEditCell({ index, date, value: event.target.value })
          }
          onBlur={(event) => {
            onEditCell({
              index,
              date,
              value: formatTimeValue(event.target.value),
            });
          }}
        />
      ),
    ),
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
  onCopy: (index: number) => void;
};

const Header = ({ header, index, onCopy, ...props }: HeaderProps) => {
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
      <Button
        variant={ButtonVariants.UNSTYLED}
        onClick={() => onCopy(index)}
        customChildren
      >
        <Icon name={Icons.COPY} />
      </Button>
    </Inline>
  );
};

type Props = {
  id: string;
  className: string;
  value: TimeTableValue;
  onChange: (value: TimeTableValue) => void;
};

const updateCell = ({ originalData, date, index, value }) =>
  setWith(originalData, `[${date}][${index}]`, value, Object);

const calculateDateRange = (
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

const TimeTable = ({ id, className, onChange, value, ...props }: Props) => {
  const { t } = useTranslation();

  const dateRange = useMemo(
    () => calculateDateRange(value.dateStart, value.dateEnd),
    [value.dateStart, value.dateEnd],
  );

  const cleanValue = (dateStart: string, dateEnd: string, toCleanValue) => {
    const range = calculateDateRange(dateStart, dateEnd);
    const data = pick(toCleanValue.data, range);

    return {
      ...toCleanValue,
      // clean data that is not relevant for the range
      data,
    };
  };

  const handleChange = (toCleanValue) => {
    const cleanedValue = cleanValue(
      value.dateStart,
      value.dateEnd,
      toCleanValue,
    );

    console.log(JSON.stringify(cleanedValue, null, 2));
    onChange(cleanedValue);
  };

  const handleCopyColumn = (index: number) => {
    const copyAction: CopyPayload = {
      method: 'col',
      data: dateRange.map((date) => value.data?.[date]?.[index]),
    };

    copyToClipboard(JSON.stringify(copyAction));
  };

  const handleCopyRow = (date: string) => {
    const copyAction: CopyPayload = {
      method: 'row',
      data: Array.from(
        { length: amountOfColumns },
        (_, i) => value.data?.[date]?.[i],
      ),
    };

    copyToClipboard(JSON.stringify(copyAction));
  };

  const handleCopyAll = () => {
    const copyAction: CopyPayload = {
      method: 'all',
      data: value.data,
    };
    copyToClipboard(JSON.stringify(copyAction));
  };

  const handleDateStartChange = (date) => {
    handleChange({ ...value, dateStart: formatDate(date) });
  };

  const handleDateEndChange = (date) => {
    handleChange({ ...value, dateEnd: formatDate(date) });
  };

  const handleEditCell = ({ index, date, value: cellValue }) => {
    handleChange({
      ...value,
      data: updateCell({
        originalData: value.data ?? {},
        date,
        value: cellValue,
        index,
      }),
    });
  };

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
          ...Array.from(
            { length: amountOfColumns },
            (_, i) => `t${i + 1}`,
          ).map((header, headerIndex) => (
            <Header
              key={header}
              header={header}
              index={headerIndex}
              onCopy={handleCopyColumn}
            />
          )),
          <Text key="post" />,
        ]}
        {dateRange.map((date) => (
          <Row
            key={date}
            date={date}
            data={value?.data?.[date]}
            onCopy={handleCopyRow}
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

export { TimeTable };
export type { TimeTableValue };
