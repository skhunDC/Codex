const { getWeeklyQuote } = require('../quotes');

test('cycles through quotes based on week difference', () => {
  const start = new Date('2025-06-08');
  const quote1 = getWeeklyQuote(new Date(start));
  const quote2 = getWeeklyQuote(new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000));
  const quote3 = getWeeklyQuote(new Date(start.getTime() + 2 * 7 * 24 * 60 * 60 * 1000));
  expect(quote1).not.toBeFalsy();
  expect(quote2).not.toBeFalsy();
  expect(quote3).not.toBeFalsy();
  expect(quote1).not.toEqual(quote2); // ensures rotation
});
