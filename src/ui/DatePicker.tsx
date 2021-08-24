import 'react-datepicker/dist/react-datepicker.css';

import fr from 'date-fns/locale/fr';
import nl from 'date-fns/locale/nl';
import ReactDatePicker, {
  registerLocale,
  setDefaultLocale,
} from 'react-datepicker';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';
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
  return (
    <Box
      as={ReactDatePicker}
      className={className}
      id={id}
      selected={selected}
      onChange={onChange}
      dateFormat="dd/MM/yyyy"
      minDate={minDate}
      maxDate={maxDate}
      customInput={<Input id={id} />}
      {...getBoxProps(props)}
    />
  );
};

DatePicker.defaultProps = {
  selected: new Date(),
};

export { DatePicker };
