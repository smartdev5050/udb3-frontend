import { differenceInDays } from 'date-fns';
import { useEffect, useState } from 'react';

import { Button, ButtonVariants } from './Button';
import { DatePeriodPicker } from './DatePeriodPicker';
import { Icon, Icons } from './Icon';
import { Inline } from './Inline';
import { Input } from './Input';
import { Label } from './Label';
import { getStackProps, Stack } from './Stack';

type Props = {
  id: string;
};

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

const TimeTable = ({ id, ...props }: Props) => {
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());

  const [timeTable, setTimeTable] = useState<TimeTableType>([]);

  useEffect(() => {
    const rowLength =
      Math.ceil(Math.abs(differenceInHours(dateStart, dateEnd)) / 24) + 1;
    setTimeTable(
      new Array(rowLength).fill(new Array(headers.length).fill(null)),
    );
  }, [dateStart, dateEnd]);

  useEffect(() => {
    console.table(timeTable);
  }, [timeTable]);

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

  return (
    <Stack spacing={3} {...getStackProps(props)}>
      <DatePeriodPicker
        id={id}
        dateStart={dateStart}
        dateEnd={dateEnd}
        setDateStart={setDateStart}
        setDateEnd={setDateEnd}
      />
      <Inline spacing={3}>
        {(timeTable?.[0] ?? []).map((col, colIndex) => {
          return (
            <Stack key={colIndex} spacing={3}>
              <Inline
                justifyContent="space-between"
                paddingLeft={1}
                paddingRight={1}
              >
                <Label htmlFor={headers[colIndex]}>{headers[colIndex]}</Label>
                <Button
                  variant={ButtonVariants.UNSTYLED}
                  onClick={() => {}}
                  customChildren
                >
                  <Icon name={Icons.COPY} />
                </Button>
              </Inline>
              {timeTable.map((row, rowIndex) => (
                <Input
                  id={headers[colIndex]}
                  key={`${colIndex}:${rowIndex}`}
                  minWidth="8rem"
                  value={row[colIndex] ?? ''}
                  onInput={(e) => {
                    editValueInTimeTable(rowIndex, colIndex, e.target.value);
                  }}
                  onBlur={() =>
                    editValueInTimeTable(
                      rowIndex,
                      colIndex,
                      formatTimeValue(row[colIndex]),
                    )
                  }
                />
              ))}
            </Stack>
          );
        })}
      </Inline>
    </Stack>
  );
};

export { TimeTable };
