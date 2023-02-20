import 'react-datepicker/dist/react-datepicker.css';

import fr from 'date-fns/locale/fr';
import nl from 'date-fns/locale/nl';
import { useRef } from 'react';
import ReactDatePicker, {
  registerLocale,
  setDefaultLocale,
} from 'react-datepicker';

import type { BoxProps } from './Box';
import { Box } from './Box';
import { Button, ButtonVariants } from './Button';
import { Icons } from './Icon';
import { getInlineProps, Inline } from './Inline';
import { Input } from './Input';
import { getValueFromTheme } from './theme';

setDefaultLocale('nl');
registerLocale('nl', nl);
registerLocale('fr', fr);

const getValue = getValueFromTheme('datePicker');

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
  disabled,
  ...props
}: Props) => {
  const datePickerRef = useRef(null);

  return (
    <Inline
      {...getInlineProps(props)}
      css={`
        .react-datepicker__day--keyboard-selected {
          background-color: ${({ theme }) => theme.colors.grey1};
          color: #000;
          font-weight: bold;

          &:hover {
            color: ${({ theme }) => theme.colors.white};
          }
        }

        .react-datepicker {
          font-family: 'Open Sans', Helvetica, Arial, sans-serif;
          font-size: 1rem;
          border: none;
          box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
        }

        .react-datepicker__header {
          background: ${({ theme }) => theme.colors.grey1};
          color: #333;
          font-weight: bold;
          border: none;

          .react-datepicker__day-names {
            margin-top: 7px;
            background-color: rgba(0, 0, 0, 0.05);
          }

          .react-datepicker__day-name {
            color: #333;
          }
        }

        .react-datepicker-popper[data-placement^='bottom']
          .react-datepicker__triangle::before {
          border: none;
        }

        .react-datepicker-popper[data-placement^='bottom']
          .react-datepicker__triangle::after {
          border-bottom-color: ${({ theme }) => theme.colors.grey1};
        }

        .react-datepicker__year-read-view--down-arrow,
        .react-datepicker__month-read-view--down-arrow,
        .react-datepicker__month-year-read-view--down-arrow,
        .react-datepicker__navigation-icon::before {
          color: #333;
        }

        .react-datepicker__navigation-icon:hover::before {
          border-color: #ddd;
        }

        .react-datepicker__month-read-view--down-arrow,
        .react-datepicker__year-read-view--down-arrow {
          top: 6px;
        }

        .react-datepicker-wrapper {
          width: auto;
          z-index: ${getValue('zIndexInput')};
        }

        .react-datepicker__current-month {
          display: none;
        }

        .react-datepicker-popper {
          z-index: ${getValue('zIndexPopup')};
        }

        .react-datepicker__year-read-view,
        .react-datepicker__month-read-view {
          visibility: visible !important;
        }

        .react-datepicker__month-dropdown,
        .react-datepicker__year-dropdown {
          color: #333;
          background: white;
          width: 60%;
          left: 10%;
        }

        .react-datepicker__month-dropdown-container:hover,
        .react-datepicker__year-dropdown-container:hover {
          color: #999;
        }

        .react-datepicker__month-option,
        .react-datepicker__year-option {
          padding: 0.25rem 0.5rem;

          &:hover {
            background: ${({ theme }) => theme.colors.udbBlue};
            color: white;
          }
        }

        .react-datepicker__month-dropdown-container--scroll {
          margin-left: 0;
        }

        .react-datepicker__day--selected {
          background-color: ${({ theme }) => theme.colors.udbBlue};
          border-radius: 10px;
        }

        .react-datepicker__navigation {
          top: 12px;
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
        showMonthDropdown
        showYearDropdown
        minDate={minDate}
        maxDate={maxDate}
        customInput={<Input id={id} />}
        disabled={disabled}
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
        disabled={disabled}
        css={`
          &.btn {
            box-shadow: none;
            border: 1px lightgray solid;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            border-left: none;

            z-index: ${getValue('zIndexButton')};

            &:focus {
              border-left: inherit;
            }
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
