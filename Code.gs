function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate()
    .setTitle('Route Operations Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
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
      weathercode: data.current_weather.weathercode
    };
  }
  return null;
}
