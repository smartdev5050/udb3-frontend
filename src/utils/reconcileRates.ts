import {
  PriceCategories,
  Rate,
} from '@/pages/steps/AdditionalInformationStep/PriceInformation';
import { Offer } from '@/types/Offer';
import { isUitpasOrganizer } from '@/pages/steps/AdditionalInformationStep/OrganizerPicker';

const parseNumber = (number: string | number): number => {
  return Number(String(number).replace(',', '.'));
};

export function reconcileRates(
  currentRates: Rate[],
  newRates: Rate[],
  offer?: Offer,
): Rate[] {
  const mainLanguage = offer?.mainLanguage;
  const formatter = Intl.NumberFormat('nl-NL', {
    style: 'decimal',
    minimumFractionDigits: 2,
    useGrouping: false,
  });

  const alreadyEmbeddedUitpasPrices = currentRates.some(
    (rate) => rate.category === PriceCategories.UITPAS,
  );

  const isDefaultValue =
    currentRates.length === 1 && currentRates[0].price === '';

  if (isDefaultValue && newRates.length) {
    currentRates = newRates;
  }

  const hasUitpasOrganizer =
    offer?.organizer && isUitpasOrganizer(offer?.organizer);

  if (alreadyEmbeddedUitpasPrices && (newRates.length || hasUitpasOrganizer)) {
    currentRates = currentRates.filter(
      (rate) => rate.category !== PriceCategories.UITPAS,
    );
  }

  if (hasUitpasOrganizer) {
    newRates.forEach((rate) => {
      if (rate.category === PriceCategories.UITPAS) {
        currentRates.push(rate);
      }
    });
  }

  currentRates = currentRates.map((rate) => {
    if (mainLanguage) {
      rate.name = {
        [mainLanguage]: Object.values(rate.name)[0],
        ...rate.name,
      };
    }

    return {
      ...rate,
      price: formatter.format(parseNumber(rate.price)),
    };
  });

  return currentRates;
}
