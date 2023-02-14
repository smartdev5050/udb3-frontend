import { isUitpasOrganizer } from '@/pages/steps/AdditionalInformationStep/OrganizerPicker';
import { PriceCategories } from '@/pages/steps/AdditionalInformationStep/PriceInformation';
import { Offer, PriceInfo } from '@/types/Offer';

const parseNumber = (number: string | number): number =>
  Number(String(number).replace(',', '.'));

export function reconcileRates(
  currentRates: PriceInfo[],
  newRates: PriceInfo[],
  offer?: Offer,
): PriceInfo[] {
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

  const hasUitpasOrganizer =
    offer?.organizer && isUitpasOrganizer(offer?.organizer);

  // If the form is in its initial state, replace it entirely
  if (isDefaultValue && newRates.length) {
    currentRates = newRates;
  }

  // If we're going to update or embed UiTPAS prices, purge current ones
  if (alreadyEmbeddedUitpasPrices && (newRates.length || hasUitpasOrganizer)) {
    currentRates = currentRates.filter(
      (rate) => rate.category !== PriceCategories.UITPAS,
    );
  }

  // Embed UiTPAS prices
  if (hasUitpasOrganizer) {
    newRates.forEach((rate) => {
      if (rate.category === PriceCategories.UITPAS) {
        currentRates.push(rate);
      }
    });
  }

  // Format names and prices
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
