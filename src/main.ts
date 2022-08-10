// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')

import { defineCustomElement } from 'vue'
import VueWeatherWidget from './WeatherWidget.ce.vue'

const WeatherWidget = defineCustomElement(VueWeatherWidget);

customElements.define('weather-widget', WeatherWidget);
