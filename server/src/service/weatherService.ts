import dotenv from 'dotenv';
dotenv.config();
// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: string;
  lon: string;
}
// TODO: Define a class for the Weather object
class Weather {
  cityName: string;
  date: string;
  icon: string;
  description: string;
  temp: number;
  humidity: number;
  windspeed: number;
  constructor(
    cityName: string,
    date: string,
    icon: string,
    description: string,
    temp: number,
    humidity: number,
    windspeed: number,
  ) {
    this.cityName = cityName;
    this.date = date;
    this.icon = icon;
    this.description = description;
    this.temp = temp;
    this.humidity = humidity;
    this.windspeed = windspeed
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private APIkey?: string;
  private cityName?: string
  constructor(
    cityName:string
  ) {
    this.baseURL = process.env.API_BASE_URL || "";
    this.APIkey = process.env.API_KEY || "";
    this.cityName = cityName
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const geoCodeQuery = this.buildGeocodeQuery(query)
    const fetchData = await fetch(geoCodeQuery);

    if (!fetchData.ok) {
      alert(`Error:${fetchData.statusText}`);
    }

    return await fetchData.json()
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const locationCoordinates: Coordinates = {
      lat: locationData.lat,
      lon: locationData.lon
    }
    return locationCoordinates
  }


  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    const geocodeQuery = `${this.baseURL}/geo/1.0/direct?q=${query}&appid=${this.APIkey}`
    return geocodeQuery
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const apiKey = process.env.API_KEY;
    const baseURL = process.env.API_BASE_URL;
    const lat = coordinates.lat;
    const lon = coordinates.lon;
    const weatherQuery = `${baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    return weatherQuery
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(query: string) {
    const locationData = await this.fetchLocationData(query);
    const coordinates = await this.destructureLocationData(locationData)
    return coordinates
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherDataQuery = this.buildWeatherQuery(coordinates)
    const fetchWeather = await fetch(weatherDataQuery);

    if (!fetchWeather.ok) {
      alert(`Error:${fetchWeather.statusText}`);
    }

    return await fetchWeather.json()
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const parsedWeatherData = JSON.parse(response);
    return parsedWeatherData
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData:any) {
    const parseData = this.parseCurrentWeather(weatherData);
    const cityName = this.cityName ?? "";
    const bloatedForecastArray = parseData.list
    const forecastArray: Weather []= bloatedForecastArray.map((forecast:any)=>{
      const forecastObj:Weather = {
      cityName: cityName,
      date: forecast.dt,
      icon: forecast.weather.icon,
      description: forecast.weather.description,
      temp: forecast.main.temp,
      humidity: forecast.main.humidity,
      windspeed: forecast.wind.speed,
      }; return forecastObj
    }); return forecastArray
  }
  // TODO: Complete getWeatherForCity method
async getWeatherForCity(city: string) {
  const coordinates = await this.fetchAndDestructureLocationData(city);
  const weatherData = await this.fetchWeatherData(coordinates);
  return this.buildForecastArray(weatherData)
}
}

export default new WeatherService("cityName");
