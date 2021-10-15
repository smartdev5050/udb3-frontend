/* eslint-disable @typescript-eslint/restrict-plus-operands */
import copyToClipboard from 'clipboard-copy';
import { addDays, differenceInHours, format as formatDate } from 'date-fns';
import { useEffect, useState } from 'react';
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

const colHeaders = ['t1', 't2', 't3', 't4', 't5', 't6', 't7'];

type Time = string;

type CopyPayload =
  | {
      method: 'row' | 'col';
      data: Time[];
    }
  | { method: 'all'; data: Time[][] };

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
      <Button variant={ButtonVariants.UNSTYLED} onClick={() => onCopy(index)}>
        <Icon name={Icons.COPY} />
      </Button>
    </Inline>
  );
};

type RowProps = Omit<InlineProps, 'onPaste'> & {
  row: string[];
  index: number;
  date: Date;
  onCopyRow: (index: number) => void;
  onCopyColumn: (index: number) => void;
  onPaste: (
    rowIndex: number,
    colIndex: number,
    clipboardValue: CopyPayload,
  ) => void;
  onEditCell: (rowIndex: number, colIndex: number, value: string) => void;
};

const Row = ({
  row,
  index,
  date,
  onCopyRow,
  onCopyColumn,
  onPaste,
  onEditCell,
  ...props
}: RowProps) => {
  const dateLabel = <Text key="dateLabel">{formatDate(date, 'dd/MM/yy')}</Text>;
  const copyButton = (
    <Button
      key="copyButton"
      variant={ButtonVariants.UNSTYLED}
      onClick={() => onCopyRow(index)}
      {...getInlineProps(props)}
    >
      <Icon name={Icons.COPY} />
    </Button>
  );

  return [
    dateLabel,
    ...row.map((col, colIndex) => (
      <Input
        key={`${index}${colIndex}`}
        id={colHeaders[colIndex]}
        value={row[colIndex] ?? ''}
        onChange={(event) => onEditCell(index, colIndex, event.target.value)}
        onBlur={() => {
          onEditCell(index, colIndex, formatTimeValue(row[colIndex]));
        }}
        onPaste={(event) => {
          event.preventDefault();

          const clipboardValue = JSON.parse(
            (event.clipboardData || window.clipboardData).getData('text'),
          );

          onPaste(index, colIndex, clipboardValue);
        }}
      />
    )),
    copyButton,
  ];
};

type Props = StackProps & {
  id: string;
  onChange: (value: Time[][]) => void;
  value: Time[][];
  dateStart: Date;
  onDateStartChange: (value: Date) => void;
};

const TimeTable = ({
  id,
  className,
  onChange,
  value,
  dateStart,
  onDateStartChange,
  ...props
}: Props) => {
  const [dateEnd, setDateEnd] = useState(new Date());

  const timeTable = value ?? [];

  const { t } = useTranslation();

  useEffect(() => {
    const rowLength =
      Math.ceil(Math.abs(differenceInHours(dateStart, dateEnd)) / 24) + 1;

    onChange(
      new Array(rowLength).fill(new Array(colHeaders.length).fill(null)),
    );
  }, [dateStart, dateEnd]);

  // TODO: needs to move to event post
  // useEffect(() => {
  //   const timeTableAsDateStrings = timeTable.map((row, rowIndex) =>
  //     row.map((time) => {
  //       if (!time || !/[0-2][0-4]h[0-5][0-9]m/.test(time)) return null;
  //       const hours = parseInt(time.substring(0, 2));
  //       const minutes = parseInt(time.substring(3, 5));
  //       const rowDate = addDays(dateStart, rowIndex);
  //       const dateWithTime = setTime(rowDate, { hours, minutes, seconds: 0 });
  //       return formatDateToISO(dateWithTime);
  //     }),
  //   );
  //   onChange(timeTableAsDateStrings);
  // }, [timeTable, dateStart]);

  const onEditCell = (rowIndex: number, colIndex: number, value: Time) => {
    onChange(
      timeTable.map((innerRow, innerRowIndex) => {
        if (rowIndex === innerRowIndex) {
          return innerRow.map((time, timeIndex) => {
            if (colIndex === timeIndex) {
              return value;
            }
            return time;
          });
        }
        return innerRow;
      }),
    );
  };

  const handleCopyColumn = (colIndex: number) => {
    const copyAction: CopyPayload = {
      method: 'col',
      data: timeTable.reduce((acc, currentRow) => {
        const value = currentRow[colIndex];
        return [...acc, value];
      }, []),
    };

    copyToClipboard(JSON.stringify(copyAction));
  };

  const handleCopyRow = (rowIndex: number) => {
    const copyAction: CopyPayload = {
      method: 'row',
      data: timeTable[rowIndex],
    };

    copyToClipboard(JSON.stringify(copyAction));
  };

  const handleCopyAll = () => {
    const copyAction: CopyPayload = {
      method: 'all',
      data: timeTable,
    };

    copyToClipboard(JSON.stringify(copyAction));
  };

  const handlePaste = (
    rowIndex: number,
    colIndex: number,
    copyAction: CopyPayload,
  ) => {
    if (copyAction.method === 'row') {
      onChange(
        timeTable.map((innerRow, innerRowIndex) => {
          if (rowIndex === innerRowIndex) {
            return copyAction.data;
          }
          return innerRow;
        }),
      );
    }
    if (copyAction.method === 'col') {
      onChange(
        timeTable.map((innerRow, innerRowIndex) => {
          return innerRow.map((time, timeIndex) => {
            if (timeIndex === colIndex) {
              return copyAction.data[innerRowIndex];
            }
            return time;
          });
        }),
      );
    }
    if (copyAction.method === 'all') {
      onChange(
        timeTable.map((innerRow, innerRowIndex) => {
          return innerRow.map((_, innerColIndex) => {
            return copyAction.data?.[innerRowIndex]?.[innerColIndex] ?? null;
          });
        }),
      );
    }
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
        dateStart={dateStart}
        dateEnd={dateEnd}
        onDateStartChange={onDateStartChange}
        onDateEndChange={setDateEnd}
      />
      <Stack
        forwardedAs="div"
        css={`
          display: grid;
          grid-template-rows: repeat(${(timeTable?.length ?? 0) + 1}, 1fr);
          grid-template-columns:
            min-content repeat(${timeTable?.[0]?.length ?? 0}, 1fr)
            min-content;
          column-gap: ${parseSpacing(3)};
          row-gap: ${parseSpacing(3)};
          align-items: center;
        `}
      >
        {[
          <Text key="pre" />,
          ...colHeaders.map((header, headerIndex) => (
            <Header
              key={header}
              header={header}
              index={headerIndex}
              onCopy={handleCopyColumn}
            />
          )),
          <Text key="post" />,
        ]}
        {timeTable.map((row, rowIndex) => (
          // @ts-expect-error
          <Row
            key={rowIndex}
            row={row}
            index={rowIndex}
            date={addDays(dateStart, rowIndex)}
            onCopyRow={handleCopyRow}
            onCopyColumn={handleCopyColumn}
            onPaste={handlePaste}
            onEditCell={onEditCell}
          />
        ))}
      </Stack>
      <Button
        spacing={3}
        flex="none"
        iconName={Icons.COPY}
        onClick={() => handleCopyAll()}
      >
        {t('movies.create.actions.copy_table')}
      </Button>
    </Stack>
  );
};

export { TimeTable };
