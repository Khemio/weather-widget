<template>
    <div class="flex flex-col gap-3 items-center justify-center mx-auto w-fit">
        <WeatherInfoCard v-for="weatherInfo in weatherInfoList" 
        :key="weatherInfo.id" :weatherInfo="weatherInfo" />
    </div>
</template>

<script setup lang="ts">
import { getWeatherInfoList } from '@/composables/store.js'
import WeatherInfoCard from './WeatherInfoCard.vue'

const weatherInfoList = getWeatherInfoList();

</script>



<style>

</style>