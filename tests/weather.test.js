const { weatherCodeToText } = require('../weather');

test('returns correct mapping', () => {
  expect(weatherCodeToText(0)).toBe('Clear sky');
  expect(weatherCodeToText(95)).toBe('Thunderstorm');
  expect(weatherCodeToText(999)).toBe('Unknown');
});
