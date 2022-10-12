import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Countries, Country } from '@/types/Country';
import { BoxProps, getBoxProps } from '@/ui/Box';
import { Button } from '@/ui/Button';
import { Dropdown, DropDownVariants } from '@/ui/Dropdown';
import { Inline } from '@/ui/Inline';
import { Text } from '@/ui/Text';

import { CultuurKuurIcon } from '../CultuurKuurIcon';
import { FlagIcon } from '../FlagIcon';

type Props = BoxProps & {
  value: Country;
  onChange: (value: Country) => void;
};

const countries = [Countries.BE, Countries.NL, Countries.DE];

const CountryPicker = ({ value, onChange, className, ...props }: Props) => {
  const { t } = useTranslation();

  return (
    <Dropdown
      variant={DropDownVariants.SECONDARY}
      className={className}
      css={`
        & button {
          height: 2.4rem;
        }
      `}
      {...getBoxProps(props)}
    >
      <Button customChildren>
        <FlagIcon country={value} paddingRight={1} />
      </Button>

      {countries.map((countryValue) => (
        <Dropdown.Item
          key={countryValue}
          onClick={() => onChange(countryValue)}
        >
          <Inline spacing={3}>
            <FlagIcon country={countryValue} />
            <Text>{t(`countries.${countryValue}`)}</Text>
          </Inline>
        </Dropdown.Item>
      ))}

      <Dropdown.Divider />

      <Dropdown.Item onClick={() => onChange(undefined)}>
        <Inline spacing={3}>
          <CultuurKuurIcon />
          <Text>{t('country_picker.location_school')}</Text>
        </Inline>
      </Dropdown.Item>
    </Dropdown>
  );
};

export { CountryPicker };
