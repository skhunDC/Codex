function getWeeklyQuote(date = new Date()) {
  const quotes = [
    "Believe you can and you're halfway there. — Theodore Roosevelt",
    "The only way to do great work is to love what you do. — Steve Jobs",
    "Hardships often prepare ordinary people for an extraordinary destiny. — C.S. Lewis",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill",
    "You miss 100% of the shots you don't take. — Wayne Gretzky"
  ];
  const startDate = new Date('2025-06-08');
  const diffMs = date - startDate;
  const week = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  const index = ((week % quotes.length) + quotes.length) % quotes.length;
  return quotes[index];
}

module.exports = { getWeeklyQuote };
