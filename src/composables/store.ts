import { ref } from 'vue'

interface Location {
    city: String,
    country: String,
    lat: number,
    lon: number
}

interface WeatherInfo {
    id: number
    city: String,
    country: String,
    lat: number,
    lon: number,
    temp: number,
    feels_like: number,
    humidity: number,
    pressure: number,
    visibility: number,
    wind: Object,
    weather: Object
}

const apiKey = import.meta.env.VITE_APP_API_KEY;

const weatherInfoList = ref<WeatherInfo[]>([]);

export const isWeatherInfoEmpty = () => {
    return weatherInfoList.value[0] ? false : true;
}

export const getWeatherInfoList = () => {
    return weatherInfoList;
}

export const removeLocation = (id: number) => {
    weatherInfoList.value = weatherInfoList.value.filter(item => item.id !== id);
}

export const reorderList = (index1: number, index2: number) => {
    [weatherInfoList.value[index1], weatherInfoList.value[index2]] = [weatherInfoList.value[index2], weatherInfoList.value[index1]];
}

export const fetchGeoData = async (city: String) => {
    const geoLocURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    if(weatherInfoList.value.some(location => location.city && location.city.toLowerCase() === city.toLowerCase())) return;

        const res = await fetch(geoLocURL);
        const data = await res.json();
        const location: Location = {city: data[0].name, country: data[0].country, lat: data[0].lat, lon: data[0].lon}
        fetchWeatherData(location);
}

const fetchWeatherData = async (location: Location, index: number = weatherInfoList.value.length) => {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${apiKey}`;
    const res = await fetch(weatherURL);
    const data = await res.json();

    const weatherInfo: WeatherInfo = {
        id: data.id,
        city: data.name,
        country: data.sys.country,
        lat: location.lat,
        lon: location.lon,
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: data.visibility,
        wind: data.wind,
        weather: data.weather[0]
    }
    
    weatherInfoList.value[index] = weatherInfo;
    weatherInfoList.value = [...weatherInfoList.value];

}

export const storeData = () => {
    let locations: Location[] = [];
    localStorage.clear();

    weatherInfoList.value.forEach(item => {
        if(locations.some(location => location.city && location.city.toLowerCase() === item.city.toLowerCase())) return;
        locations.push({city: item.city, country: item.country, lat: item.lat, lon: item.lon})
    });

    
    const info = JSON.stringify(locations);
    localStorage.setItem('locationsInfo', info);

}

export const getData = () => {
    let locations: Location[] = [];
    weatherInfoList.value = [];
    locations = localStorage.getItem('locationsInfo') ? JSON.parse(localStorage.getItem('locationsInfo')!) : []
    locations.forEach((location, index) => fetchWeatherData(location, index))
}
