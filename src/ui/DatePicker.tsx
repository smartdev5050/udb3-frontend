import 'react-datepicker/dist/react-datepicker.css';

import fr from 'date-fns/locale/fr';
import nl from 'date-fns/locale/nl';
import ReactDatePicker, {
  registerLocale,
  setDefaultLocale,
} from 'react-datepicker';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';
import { getValueFromTheme } from './theme';

setDefaultLocale('nl');
registerLocale('nl', nl);
registerLocale('fr', fr);

type Props = BoxProps & {
  id: string;
  selected?: Date;
  onChange?: (value: Date) => void;
};

const getValue = getValueFromTheme('datePicker');

const DatePicker = ({ id, selected, onChange, className, ...props }: Props) => {
  return (
    <Box className={className} {...getBoxProps(props)}>
      <ReactDatePicker
        id={id}
        selected={selected}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        css={`
          border: 1px solid ${getValue('borderColor')};
          padding: 0.2rem 0.4rem;
        `}
      />
    </Box>
  );
};

DatePicker.defaultProps = {
  selected: new Date(),
};

export { DatePicker };
