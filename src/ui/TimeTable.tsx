import { differenceInHours } from 'date-fns';
import { useEffect, useState } from 'react';

import { Button, ButtonVariants } from './Button';
import { DatePeriodPicker } from './DatePeriodPicker';
import { Icon, Icons } from './Icon';
import type { InlineProps } from './Inline';
import { getInlineProps, Inline } from './Inline';
import { Input } from './Input';
import { Label } from './Label';
import { getStackProps, Stack } from './Stack';

const headers = ['wo', 'do', 'vr', 'za', 'zo', 'ma', 'di'];

type Time = string;

type TimeTableType = Time[][];

const formatTimeValue = (value: string) => {
  if (value === null || isNaN(value as any)) {
    return null;
  }

  let tranformedValue = value;

  // pad with zeros if too short
  if (value.length < 4) {
    tranformedValue = value.padEnd(4, '0');
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

type RowProps = InlineProps & {
  row: string[];
  index: number;
  onCopyRow: (index: number) => void;
  onCopyColumn: (index: number) => void;
  editValueInTimeTable: (
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => void;
};

const Row = ({
  row,
  index,
  onCopyRow,
  onCopyColumn,
  editValueInTimeTable,
  ...props
}: RowProps) => (
  <Inline spacing={3} alignItems="flex-end" {...getInlineProps(props)}>
    {row.map((col, colIndex) => {
      const input = (
        <Input
          key={`${index}${colIndex}`}
          id={headers[colIndex]}
          minWidth="8rem"
          value={row[colIndex] ?? ''}
          onInput={(e) => {
            editValueInTimeTable(index, colIndex, e.target.value);
          }}
          onBlur={() =>
            editValueInTimeTable(
              index,
              colIndex,
              formatTimeValue(row[colIndex]),
            )
          }
        />
      );
      return (
        <Stack key={colIndex}>
          {index === 0
            ? [
                <Header
                  key={headers[colIndex]}
                  header={headers[colIndex]}
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
      css={`
        align-self: ;
      `}
    >
      <Icon name={Icons.COPY} />
    </Button>
  </Inline>
);

type Props = {
  id: string;
};

const TimeTable = ({ id, ...props }: Props) => {
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());

  const [timeTable, setTimeTable] = useState<TimeTableType>([]);
  // eslint-disable-next-line no-unused-vars
  const [copy, setCopy] = useState<string[]>();

  useEffect(() => {
    const rowLength =
      Math.ceil(Math.abs(differenceInHours(dateStart, dateEnd)) / 24) + 1;

    setTimeTable(
      new Array(rowLength).fill(new Array(headers.length).fill(null)),
    );
  }, [dateStart, dateEnd]);

  const editValueInTimeTable = (
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => {
    setTimeTable((prevTimeTable) => [
      ...prevTimeTable.map((innerRow, innerRowIndex) => {
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
    ]);
  };

  const handleCopyColumn = (colIndex: number) => {
    setCopy(
      timeTable.reduce((acc, currentRow) => {
        const value = currentRow[colIndex];
        return [...acc, value];
      }, []),
    );
  };

  const handleCopyRow = (rowIndex: number) => {
    setCopy(timeTable[rowIndex]);
  };

  return (
    <Stack spacing={3} {...getStackProps(props)}>
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
            onCopyRow={handleCopyRow}
            onCopyColumn={handleCopyColumn}
            editValueInTimeTable={editValueInTimeTable}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export { TimeTable };
