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
  var url = 'https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current_weather=true';
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
