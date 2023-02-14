import { PriceCategories } from '@/pages/steps/AdditionalInformationStep/PriceInformation';
import { Offer } from '@/types/Offer';
import { Organizer } from '@/types/Organizer';
import { reconcileRates } from '@/utils/reconcileRates';

const uitpasOffer = {
  mainLanguage: 'nl',
  organizer: { labels: ['uitpas'] },
} as Offer;

describe('reconcileRates', () => {
  it('can overwrite default values', () => {
    const currentRates = [
      {
        name: { nl: 'Base Tarif' },
        category: PriceCategories.BASE,
        price: '',
        priceCurrency: 'EUR',
      },
    ];

    const newRates = [
      {
        name: { nl: 'foobar' },
        category: PriceCategories.BASE,
        price: '15',
        priceCurrency: 'EUR',
      },
    ];

    expect(reconcileRates(currentRates, newRates)).toMatchSnapshot();
    expect(reconcileRates(currentRates, [])).toEqual([
      {
        name: { nl: 'Base Tarif' },
        category: PriceCategories.BASE,
        price: '0,00',
        priceCurrency: 'EUR',
      },
    ]);
  });

  it('can format prices', () => {
    const currentRates = [
      {
        name: { nl: 'foo' },
        category: PriceCategories.BASE,
        price: '5',
        priceCurrency: 'EUR',
      },
      {
        name: { nl: 'bar' },
        category: PriceCategories.BASE,
        price: 2500000,
        priceCurrency: 'EUR',
      },
    ];

    expect(reconcileRates(currentRates, [])).toEqual([
      {
        name: { nl: 'foo' },
        category: PriceCategories.BASE,
        price: '5,00',
        priceCurrency: 'EUR',
      },
      {
        name: { nl: 'bar' },
        category: PriceCategories.BASE,
        price: '2500000,00',
        priceCurrency: 'EUR',
      },
    ]);
  });

  it('can append embedded UiTPAS prices', () => {
    const currentRates = [
      {
        name: { nl: 'foobar' },
        category: PriceCategories.BASE,
        price: '20',
        priceCurrency: 'EUR',
      },
    ];

    const newRates = [
      {
        name: { nl: 'foobar' },
        category: PriceCategories.BASE,
        price: '15',
        priceCurrency: 'EUR',
      },
      {
        name: { nl: 'foobar' },
        category: PriceCategories.UITPAS,
        price: '25',
        priceCurrency: 'EUR',
      },
    ];

    expect(
      reconcileRates(currentRates, newRates, uitpasOffer),
    ).toMatchSnapshot();
  });

  it('can updated embedded UiTPAS prices', () => {
    const currentRates = [
      {
        name: { nl: 'foo' },
        category: PriceCategories.BASE,
        price: '15',
        priceCurrency: 'EUR',
      },
      {
        name: { nl: 'bar' },
        category: PriceCategories.UITPAS,
        price: '25',
        priceCurrency: 'EUR',
      },
    ];

    const newRates = [
      {
        name: { nl: 'foo' },
        category: PriceCategories.BASE,
        price: '15',
        priceCurrency: 'EUR',
      },
      {
        name: { nl: 'bar' },
        category: PriceCategories.UITPAS,
        price: '20',
        priceCurrency: 'EUR',
      },
    ];

    expect(
      reconcileRates(currentRates, newRates, uitpasOffer),
    ).toMatchSnapshot();
  });

  it('does not add back deleted prices', () => {
    const currentRates = [
      {
        name: { nl: 'foo' },
        category: PriceCategories.BASE,
        price: '20',
        priceCurrency: 'EUR',
      },
      {
        name: { nl: 'uitpas' },
        category: PriceCategories.UITPAS,
        price: '25',
        priceCurrency: 'EUR',
      },
    ];

    const newRates = [
      {
        name: { nl: 'foo' },
        category: PriceCategories.BASE,
        price: '20',
        priceCurrency: 'EUR',
      },
      {
        name: { nl: 'bar' },
        category: PriceCategories.BASE,
        price: '20',
        priceCurrency: 'EUR',
      },
      {
        name: { nl: 'uitpas' },
        category: PriceCategories.UITPAS,
        price: '20',
        priceCurrency: 'EUR',
      },
    ];

    expect(
      reconcileRates(currentRates, newRates, uitpasOffer),
    ).toMatchSnapshot();
  });

  it('can backfill price languages', () => {
    const currentRates = [
      {
        name: { de: 'foo' },
        category: PriceCategories.BASE,
        price: '20',
        priceCurrency: 'EUR',
      },
      {
        name: { de: 'foo', fr: 'Le Foo' },
        category: PriceCategories.BASE,
        price: '20',
        priceCurrency: 'EUR',
      },
    ];

    const newRates = [
      {
        name: { nl: 'uitpas' },
        category: PriceCategories.UITPAS,
        price: '20',
        priceCurrency: 'EUR',
      },
    ];

    expect(
      reconcileRates(currentRates, newRates, {
        ...uitpasOffer,
        mainLanguage: 'fr',
      }),
    ).toEqual([
      {
        name: { fr: 'foo', de: 'foo' },
        category: PriceCategories.BASE,
        price: '20,00',
        priceCurrency: 'EUR',
      },
      {
        name: { fr: 'Le Foo', de: 'foo' },
        category: PriceCategories.BASE,
        price: '20,00',
        priceCurrency: 'EUR',
      },
      {
        name: { fr: 'uitpas', nl: 'uitpas' },
        category: PriceCategories.UITPAS,
        price: '20,00',
        priceCurrency: 'EUR',
      },
    ]);
  });

  it('can remove UiTPas prices from non UiTPas offer', () => {
    const currentRates = [
      {
        name: { nl: 'foo' },
        category: PriceCategories.BASE,
        price: '20,00',
        priceCurrency: 'EUR',
      },
      {
        name: { nl: 'bar' },
        category: PriceCategories.BASE,
        price: '20,00',
        priceCurrency: 'EUR',
      },
      {
        name: { nl: 'uitpas' },
        category: PriceCategories.UITPAS,
        price: '20,00',
        priceCurrency: 'EUR',
      },
    ];

    expect(reconcileRates(currentRates, [], uitpasOffer)).toHaveLength(2);
  });
});
