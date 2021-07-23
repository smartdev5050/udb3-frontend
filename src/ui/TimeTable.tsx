import { addDays, differenceInHours, format as formatDate } from 'date-fns';
import { useEffect, useState } from 'react';

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

const colHeaders = ['wo', 'do', 'vr', 'za', 'zo', 'ma', 'di'];

type Time = string;

type CopyOrientation = 'row' | 'col';

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

type RowProps = Omit<InlineProps, 'onPaste'> & {
  row: string[];
  index: number;
  date: Date;
  onCopyRow: (index: number) => void;
  onCopyColumn: (index: number) => void;
  onPaste: (rowIndex: number, colIndex: number) => void;
  editValueInTimeTable: (
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => void;
};

const Row = ({
  row,
  index,
  date,
  onCopyRow,
  onCopyColumn,
  onPaste,
  editValueInTimeTable,
  ...props
}: RowProps) => {
  return (
    <Inline spacing={3} alignItems="flex-end" {...getInlineProps(props)}>
      <Text>{formatDate(date, 'dd/MM/yy')}</Text>
      {row.map((col, colIndex) => {
        const input = (
          <Input
            key={`${index}${colIndex}`}
            id={colHeaders[colIndex]}
            minWidth="8rem"
            value={row[colIndex] ?? ''}
            onInput={(e) =>
              editValueInTimeTable(index, colIndex, e.target.value)
            }
            onBlur={(e) => {
              editValueInTimeTable(
                index,
                colIndex,
                formatTimeValue(row[colIndex]),
              );
            }}
            onPaste={(e) => {
              e.preventDefault();
              onPaste(index, colIndex);
            }}
          />
        );
        return (
          <Stack key={colIndex}>
            {index === 0
              ? [
                  <Header
                    key={colHeaders[colIndex]}
                    header={colHeaders[colIndex]}
                    index={colIndex}
                    onCopy={onCopyColumn}
                  />,
                  input,
                ]
              : input}
          </Stack>
        );
      })}
      <Button
        variant={ButtonVariants.UNSTYLED}
        onClick={() => onCopyRow(index)}
        customChildren
      >
        <Icon name={Icons.COPY} />
      </Button>
    </Inline>
  );
};

type Props = StackProps & {
  id: string;
};

const TimeTable = ({ id, className, ...props }: Props) => {
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());

  const [timeTable, setTimeTable] = useState<Time[][]>([]);

  const [copyValue, setCopyValue] = useState<string[]>();
  const [copyOrientation, setCopyOrientation] = useState<CopyOrientation>();

  useEffect(() => {
    const rowLength =
      Math.ceil(Math.abs(differenceInHours(dateStart, dateEnd)) / 24) + 1;

    setTimeTable(
      new Array(rowLength).fill(new Array(colHeaders.length).fill(null)),
    );
  }, [dateStart, dateEnd]);

  const editValueInTimeTable = (
    rowIndex: number,
    colIndex: number,
    value: Time,
  ) => {
    setTimeTable((prevTimeTable) =>
      prevTimeTable.map((innerRow, innerRowIndex) => {
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
    setCopyOrientation('col');
    setCopyValue(
      timeTable.reduce((acc, currentRow) => {
        const value = currentRow[colIndex];
        return [...acc, value];
      }, []),
    );
  };

  const handleCopyRow = (rowIndex: number) => {
    setCopyOrientation('row');
    setCopyValue(timeTable[rowIndex]);
  };

  const handlePaste = (rowIndex: number, colIndex: number) => {
    if (copyOrientation === 'row') {
      setTimeTable((prevTimeTable) =>
        prevTimeTable.map((innerRow, innerRowIndex) => {
          if (rowIndex === innerRowIndex) {
            return copyValue;
          }
          return innerRow;
        }),
      );
    }
    if (copyOrientation === 'col') {
      setTimeTable((prevTimeTable) =>
        prevTimeTable.map((innerRow, innerRowIndex) => {
          return innerRow.map((time, timeIndex) => {
            if (timeIndex === colIndex) {
              return copyValue[innerRowIndex];
            }
            return time;
          });
        }),
      );
    }
  };

  return (
    <Stack spacing={4} className={className} {...getStackProps(props)}>
      <DatePeriodPicker
        id={id}
        dateStart={dateStart}
        dateEnd={dateEnd}
        setDateStart={setDateStart}
        setDateEnd={setDateEnd}
      />
      <Stack spacing={3}>
        {timeTable.map((row, rowIndex) => (
          <Row
            key={rowIndex}
            row={row}
            index={rowIndex}
            date={addDays(dateStart, rowIndex)}
            onCopyRow={handleCopyRow}
            onCopyColumn={handleCopyColumn}
            onPaste={handlePaste}
            editValueInTimeTable={editValueInTimeTable}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export { TimeTable };
