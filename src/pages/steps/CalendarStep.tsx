import { useTranslation } from 'react-i18next';

import { FormElement } from '@/ui/FormElement';
import { Inline } from '@/ui/Inline';
import { StackProps } from '@/ui/Stack';
import { Typeahead } from '@/ui/Typeahead';

import { FormDataUnion, StepsConfiguration } from './Steps';

type CalendarStepProps = StackProps;

const getHourOptions = () => {
  const hours = Array(24).fill(0);
  const quarterHours = ['00', '15', '30', '45'];
  const times = [];
  hours.forEach((_hour, i) => {
    quarterHours.forEach((quarterHour) =>
      times.push(`${i > 9 ? i : `0${i}`}:${quarterHour}`),
    );
  });
  return times;
};

const hourOptions = getHourOptions();

const CalendarStep = ({ ...props }: CalendarStepProps) => {
  const { t, i18n } = useTranslation();

  return (
    <Inline>
      <FormElement
        id="hourpicker"
        label="startuur"
        Component={
          <Typeahead<any>
            name="starthour"
            options={hourOptions}
            labelKey="name"
            onInputChange={() => console.log('on input change')}
            onChange={() => console.log('on change')}
            onBlur={() => {
              console.log('on blur');
            }}
            selected=""
            minLength={0}
            inputType="time"
            customFilter={() => true}
          />
        }
      />
    </Inline>
  );
};

const calendarStepConfiguration: StepsConfiguration<FormDataUnion> = {
  Component: CalendarStep,
  name: 'calendar',
  title: ({ t }) => 'Wanneer vindt dit evenement of deze activiteit plaats?',
  shouldShowStep: ({ watch, eventId, formState }) => {
    return true;
  },
};

export { CalendarStep, calendarStepConfiguration };
