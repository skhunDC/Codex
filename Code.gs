function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate()
    .setTitle('Route Operations Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function weatherCodeToText(code) {
  var mapping = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };
  return mapping[code] || 'Unknown';
}

function getWeather() {
  // Example using Open-Meteo. Replace latitude and longitude with your own.
  var url = 'https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current_weather=true&temperature_unit=fahrenheit';
  var response = UrlFetchApp.fetch(url);
  var data = JSON.parse(response.getContentText());
  if (data && data.current_weather) {
    return {
      temperature: data.current_weather.temperature,
      windspeed: data.current_weather.windspeed,
      condition: weatherCodeToText(data.current_weather.weathercode)
    };
  }
  return null;
}

function getFrames() {
  var props = PropertiesService.getScriptProperties();
  var data = props.getProperty('frames');
  return data ? JSON.parse(data) : [];
}

function saveFrames(frames) {
  PropertiesService.getScriptProperties().setProperty('frames', JSON.stringify(frames));
}

function getDriverOfTheWeek() {
  var props = PropertiesService.getScriptProperties();
  return props.getProperty('driverOfWeek') || '';
}

function saveDriverOfTheWeek(name) {
  PropertiesService.getScriptProperties().setProperty('driverOfWeek', name || '');
}

function getRandomQuote() {
  var props = PropertiesService.getScriptProperties();
  var quote = props.getProperty('weeklyQuote');
  var timestamp = props.getProperty('weeklyQuoteDate');
  var now = new Date();
  var needNew = true;

  if (quote && timestamp) {
    var last = new Date(timestamp);
    if (now.getTime() - last.getTime() < 7 * 24 * 60 * 60 * 1000) {
      needNew = false;
    }
  }

  if (needNew) {
    var newQuote = fetchQuote();
    if (newQuote) {
      props.setProperty('weeklyQuote', newQuote);
      props.setProperty('weeklyQuoteDate', now.toISOString());
      quote = newQuote;
    }
  }

  return quote || 'Quote unavailable';
}

var FALLBACK_QUOTES = [
  'The only way to do great work is to love what you do. — Steve Jobs',
  'Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill',
  'Life is what happens when you\'re busy making other plans. — John Lennon',
  'You miss 100% of the shots you don\'t take. — Wayne Gretzky'
];

function fetchQuote() {
  var url = 'https://api.quotable.io/random';
  try {
    var response = UrlFetchApp.fetch(url);
    var data = JSON.parse(response.getContentText());
    if (data && data.content && data.author) {
      return data.content + ' — ' + data.author;
    }
  } catch (e) {
    // ignore errors and fall through
  }
  // Use a random local quote as a fallback
  return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
}

function getHeaderTitle() {
  var props = PropertiesService.getScriptProperties();
  return props.getProperty('headerTitle') || 'Route Operations Dashboard';
}

function saveHeaderTitle(title) {
  PropertiesService.getScriptProperties().setProperty(
    'headerTitle',
    title || 'Route Operations Dashboard'
  );
}

function getLogoImage() {
  var props = PropertiesService.getScriptProperties();
  return props.getProperty('logoImage') || '';
}

function saveLogoImage(data) {
  var props = PropertiesService.getScriptProperties();
  if (data) {
    props.setProperty('logoImage', data);
  } else {
    props.deleteProperty('logoImage');
  }
}

function getDriverImage() {
  var props = PropertiesService.getScriptProperties();
  var fileId = props.getProperty('driverImageId');
  if (!fileId) return '';
  try {
    var file = DriveApp.getFileById(fileId);
    var blob = file.getBlob();
    var base64 = Utilities.base64Encode(blob.getBytes());
    return 'data:' + blob.getContentType() + ';base64,' + base64;
  } catch (e) {
    props.deleteProperty('driverImageId');
    return '';
  }
}

function saveDriverImage(data) {
  var props = PropertiesService.getScriptProperties();
  var oldId = props.getProperty('driverImageId');
  if (oldId) {
    try {
      DriveApp.getFileById(oldId).setTrashed(true);
    } catch (e) {
      // ignore if file missing
    }
  }
  if (data) {
    var m = data.match(/^data:(.+);base64,(.+)$/);
    if (m) {
      var contentType = m[1];
      var bytes = Utilities.base64Decode(m[2]);
      var blob = Utilities.newBlob(bytes, contentType, 'driver-image');
      var file = DriveApp.createFile(blob);
      props.setProperty('driverImageId', file.getId());
      return;
    }
  }
  props.deleteProperty('driverImageId');
}
