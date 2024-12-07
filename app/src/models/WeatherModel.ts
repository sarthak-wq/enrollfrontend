/**
 * Interface representing the structure of a weather forecast object.
 */
export interface WeatherForecast {
    name: string;
    temperature: number;
    temperatureUnit: string;
    shortForecast: string;
    detailedForecast: string;
    windSpeed: string;
    icon: string;
  }
  