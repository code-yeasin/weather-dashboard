import { configureStore } from '@reduxjs/toolkit';
import cityWeatherReducer from './slices/cityWeatherSlice';
import currentWeatherReducer from './slices/currentWeatherSlice';
import forecastReducer from './slices/forecastSlice';
import weatherReducer from './slices/tehranWeatherSlice'; // Import corrected here

export const store = configureStore({
  reducer: {
    weather: weatherReducer,              // use this key for tehranWeatherSlice state
    cityWeather: cityWeatherReducer,
    currentWeather: currentWeatherReducer,
    forecast: forecastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
