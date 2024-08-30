import dotenv from 'dotenv';
dotenv.config();
// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: string;
  lon: string;
}
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  humidity: number;
  windSpeed: number;
  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    humidity: number,
    windSpeed: number,
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.humidity = humidity;
    this.windSpeed = windSpeed
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private APIkey?: string;
  // private cityName?: string
  constructor(
    // cityName:string
  ) {
    this.baseURL = process.env.API_BASE_URL || "";
    this.APIkey = process.env.API_KEY || "";
    // this.cityName = cityName
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const geoCodeQuery = this.buildGeocodeQuery(query)
    const fetchData = await fetch(geoCodeQuery);

    if (!fetchData.ok) {
      console.log(`Error:${fetchData.statusText}`);
    }

    return await fetchData.json()
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData:any): Coordinates {
    const locationCoordinates: Coordinates = {
      lat: locationData.coord.lat,
      lon: locationData.coord.lon
    }
    return locationCoordinates
  }


  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: any): string {
    // console.log(query);
    const cityName = query;
    const geocodeQuery = `${this.baseURL}/data/2.5/weather?units=imperial&q=${cityName}&appid=${this.APIkey}`
    // console.log(geocodeQuery)
    return geocodeQuery
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    // console.log(coordinates);
    
    const apiKey = process.env.API_KEY;
    const baseURL = process.env.API_BASE_URL;
    const lat = coordinates.lat;
    const lon = coordinates.lon;
    const weatherQuery = `${baseURL}/data/2.5/forecast?units=imperial&lat=${lat}&lon=${lon}&appid=${apiKey}`
    // console.log(weatherQuery)
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
      console.log(`Error:${fetchWeather.statusText}`);
    }

    return await fetchWeather.json()
  }

  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {
  //   console.log(response);
    
  //   const parsedWeatherData = JSON.parse(response);
  //   console.log(parsedWeatherData);
    
  //   return parsedWeatherData
  // }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData:any) {
    // const parseData = this.parseCurrentWeather(weatherData);
    // console.log(parseData);
    
    const cityName = weatherData.city.name;
    const bloatedForecastArray = weatherData.list;
    // const dateIsolation = weatherData.list.map((timeStamp:any)=>{
    //   const isolatetimeStamp = timeStamp.dt_txt;
    //  return isolatetimeStamp});
      // console.log(dateIsolation);
      const firstDate = bloatedForecastArray[0];
      const datesArray = bloatedForecastArray.filter((_:any, index:any) => index % 8 === 7);
      const allDates = [firstDate, ...datesArray];
     const formatAllDates = allDates.map(data=>{
      const date = new Date(data.dt_txt);
      const formattedDate = date.toLocaleDateString('en-US');
      return {
        ...data,
        dt_txt: formattedDate
      };
     }) 
    //  console.log(formatAllDates);
    
    const forecastArray: Weather []= formatAllDates.map((forecast:any)=>{
      const weatherArray = forecast.weather
      const forecastObj:Weather = {
      city: cityName,
      date: forecast.dt_txt,
      icon: weatherArray[0].icon,
      iconDescription: weatherArray[0].description,
      tempF: forecast.main.temp,
      humidity: forecast.main.humidity,
      windSpeed: forecast.wind.speed,
      }; return forecastObj
    }); return forecastArray
  }
  // TODO: Complete getWeatherForCity method
async getWeatherForCity(city: string) {
  const coordinates = await this.fetchAndDestructureLocationData(city);
  const weatherData = await this.fetchWeatherData(coordinates); 
  // console.log(weatherData);
  const forecastArray = this.buildForecastArray(weatherData)
  // console.log(forecastArray);
  
  return forecastArray
}
}

export default new WeatherService();
