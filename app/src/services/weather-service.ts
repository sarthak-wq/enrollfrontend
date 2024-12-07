import { iconButtonClasses } from '@mui/material';
import axios from 'axios';

/**
 * URL for fetching hourly weather forecasts.
 */
const WEATHER_API_URL = 'https://api.weather.gov/gridpoints/BOX/60,70/forecast/hourly';

/**
 * TypeScript interface representing the structure of the weather API response.
 */
interface WeatherAPIResponse {
  properties: {
    periods: {
      name: string;
      temperature: number;
      temperatureUnit: string;
      shortForecast: string;
      detailedForecast: string;
      windSpeed: string;
      icon: string;
    }[];
  };
}

/**
 * Fetches weather forecast data from the National Weather Service API.
 *
 * This function makes a GET request to the `WEATHER_API_URL` and retrieves hourly weather forecasts.
 * The API returns multiple forecast periods, but this function only extracts data for the first period.
 */
export const getWeatherData = async () => {
  const response = await axios.get<WeatherAPIResponse>(WEATHER_API_URL);
  const firstForecast = response.data.properties.periods[0];
  return {
    name: firstForecast.name,
    temperature: firstForecast.temperature,
    temperatureUnit: firstForecast.temperatureUnit,
    shortForecast: firstForecast.shortForecast,
    detailedForecast: firstForecast.detailedForecast,
    windSpeed: firstForecast.windSpeed,
    icon: firstForecast.icon
  };
};
