import 'react-datepicker/dist/react-datepicker.css';

import fr from 'date-fns/locale/fr';
import nl from 'date-fns/locale/nl';
import { useRef } from 'react';
import ReactDatePicker, {
  registerLocale,
  setDefaultLocale,
} from 'react-datepicker';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';
import { Button, ButtonVariants } from './Button';
import { Icons } from './Icon';
import { getInlineProps, Inline } from './Inline';
import { Input } from './Input';

setDefaultLocale('nl');
registerLocale('nl', nl);
registerLocale('fr', fr);

type Props = Omit<BoxProps, 'onChange'> & {
  id: string;
  selected?: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (value: Date) => void;
};

const DatePicker = ({
  id,
  selected,
  onChange,
  className,
  minDate,
  maxDate,
  ...props
}: Props) => {
  const datePickerRef = useRef(null);

  return (
    <Inline
      {...getInlineProps(props)}
      css={`
        .react-datepicker-wrapper {
          width: auto;
        }
      `}
    >
      <Box
        forwardedAs={ReactDatePicker}
        ref={datePickerRef}
        className={className}
        id={id}
        selected={selected}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        minDate={minDate}
        maxDate={maxDate}
        customInput={<Input id={id} />}
        css={`
          &.form-control {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
        `}
      />
      <Button
        variant={ButtonVariants.SECONDARY}
        iconName={Icons.CALENDAR_ALT}
        onClick={() => datePickerRef.current?.setOpen(true)}
        css={`
          &.btn {
            box-shadow: none;
            border: 1px lightgray solid;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            border-left: none;
          }
        `}
      />
    </Inline>
  );
};

DatePicker.defaultProps = {
  selected: new Date(),
};

export { DatePicker };
