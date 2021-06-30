type TextFormat = 'xs-text' | 'sm-text' | 'md-text' | 'lg-text';
type HtmlFormat = 'xs-hmtl' | 'sm-html' | 'md-html' | 'lg-html';
type Format = TextFormat | HtmlFormat;

type CalendarSummaries = {
  [key: string]: Format;
};

const createEmbededCalendarSummaries = (formats: Format[]): CalendarSummaries =>
  formats.reduce(
    (accumulator, currentValue, currentIndex) => ({
      ...accumulator,
      [`embedCalendarSummaries[${currentIndex}]`]: currentValue,
    }),
    {},
  );

export { createEmbededCalendarSummaries };
export type { Format as CalendarSummaryFormat };
