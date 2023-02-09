import {
  PriceCategories,
  Rate,
} from '@/pages/steps/AdditionalInformationStep/PriceInformation';
import { Offer } from '@/types/Offer';
import { reconcileRates } from '@/utils/reconcileRates';

describe('reconcileRates', () => {
  it('can overwrite default values', () => {
    const currentRates: Rate[] = [
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
    const currentRates: Rate[] = [
      {
        name: { nl: 'foo' },
        category: PriceCategories.BASE,
        price: '5',
        priceCurrency: 'EUR',
      },
      {
        name: { nl: 'bar' },
        category: PriceCategories.BASE,
        price: 25,
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
        price: '25,00',
        priceCurrency: 'EUR',
      },
    ]);
  });

  it('can append embedded UiTPAS prices', () => {
    const currentRates: Rate[] = [
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

    expect(reconcileRates(currentRates, newRates)).toMatchSnapshot();
  });

  it('can updated embedded UiTPAS prices', () => {
    const currentRates: Rate[] = [
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

    expect(reconcileRates(currentRates, newRates)).toMatchSnapshot();
  });

  it('does not add back deleted prices', () => {
    const currentRates: Rate[] = [
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

    expect(reconcileRates(currentRates, newRates)).toMatchSnapshot();
  });

  it('can backfill price languages', () => {
    const currentRates: Rate[] = [
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
      reconcileRates(currentRates, newRates, { mainLanguage: 'fr' } as Offer),
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
});
