import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface WeatherData {
  dt: number;
  temp: number;
  icon: string;
  description: string;
}

export interface WeatherState {
  forecast: WeatherData[];
  currentWeather: (WeatherData & { locationName: string }) | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: WeatherState = {
  forecast: [],
  currentWeather: null,
  status: 'idle',
};

// Helper function to get location
const getCurrentPosition = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );

export const fetchWeatherByLocation = createAsyncThunk(
  'weather/fetchWeatherByLocation',
  async (_, { rejectWithValue }) => {
    try {
      let lat: number, lon: number, fallback = false;

      try {
        const position = await getCurrentPosition();
        lat = position.coords.latitude;
        lon = position.coords.longitude;
      } catch {
        // Fallback to New York
        lat = 40.7128;
        lon = -74.006;
        fallback = true;
      }

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=77055f3836356621dc9baee18992c5db&units=metric`
      );
      const data = await res.json();

      const forecast = data.list.map((item: any) => ({
        dt: item.dt,
        temp: item.main.temp,
        icon: item.weather[0].icon,
        description: item.weather[0].description,
      }));

      const currentWeather = {
        dt: data.list[0].dt,
        temp: data.list[0].main.temp,
        icon: data.list[0].weather[0].icon,
        description: data.list[0].weather[0].description,
        locationName: fallback ? 'New York' : data.city.name,
      };

      return { forecast, currentWeather };
    } catch (err) {
      return rejectWithValue('Failed to fetch weather');
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherByLocation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWeatherByLocation.fulfilled, (state, action) => {
        state.forecast = action.payload.forecast;
        state.currentWeather = action.payload.currentWeather;
        state.status = 'succeeded';
      })
      .addCase(fetchWeatherByLocation.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default weatherSlice.reducer;
