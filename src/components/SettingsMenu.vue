<template>
    <div class="flex flex-col gap-3 items-center justify-center mx-auto w-fit">

        <h2 class="text-2xl text-left text-bold w-full">Settings</h2>

        <div v-for="weatherInfo, index in weatherInfoList"
        :key="weatherInfo.id"
        :draggable="isDraggable"
        @dragstart="dragStart(index)"
        @dragenter="dragEnter(weatherInfo.id)"
        @dragend="dragEnd"
        @dragover.prevent
        @drop.prevent="dragDrop(index)"
        class="flex items-center justify-between bg-gray-100 w-full container mx-auto mt-5 p-3 gap-3"
        :class="{'bg-gray-300': weatherInfo.id === elementId, 'bg-gray-100': weatherInfo.id !== elementId}"
        >

            <div class="flex items-center justify-center gap-1">
                <span class="w-5 cursor-grab"
                @mousedown="isDraggable = true"
                @mouseup="isDraggable = false"
                >
                <svg width="15px" height="15px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                        fill="currentColor"
                    />
                </svg>

                </span>
                <p class="text-center text-xl">
                    {{weatherInfo.city}}, {{weatherInfo.country}}
                </p>
                
            </div>
            <span class="cursor-pointer w-5 "
            @click="removeLocation(weatherInfo.id)">
                <svg version="1.1" viewBox="0 0 315 315" enable-background="new 0 0 315 315">
                    <g>
                        <path d="m256.774,23.942h-64.836v-6.465c0-9.636-7.744-17.477-17.263-17.477h-34.348c-9.521,0-17.266,7.841-17.266,17.478v6.465h-64.835c-9.619,0-17.445,7.76-17.445,17.297v11.429c0,7.168 4.42,13.33 10.698,15.951 1.989,39.623 13.5,231.193 14.018,239.801 0.222,3.696 3.284,6.58 6.987,6.58h170.033c3.703,0 6.766-2.884 6.987-6.58 0.518-8.607 12.028-200.178 14.018-239.801 6.278-2.621 10.698-8.783 10.698-15.951v-11.43c5.68434e-14-9.537-7.826-17.297-17.446-17.297zm-119.713-6.464c0-1.918 1.465-3.478 3.266-3.478h34.348c1.8,0 3.264,1.56 3.264,3.478v6.465h-40.877v-6.465zm-82.282,23.761c0-1.818 1.546-3.297 3.445-3.297h198.549c1.899,0 3.445,1.478 3.445,3.297v11.429c0,1.819-1.546,3.299-3.445,3.299h-198.548c-1.899,0-3.445-1.479-3.445-3.299v-11.429zm181.143,259.761h-156.848c-2.055-34.247-11.479-191.674-13.51-231.033h183.867c-2.031,39.359-11.454,196.786-13.509,231.033z"/>
                        <path d="m157.5,95.125c-3.866,0-7,3.134-7,7v176.109c0,3.866 3.134,7 7,7 3.866,0 7-3.134 7-7v-176.109c0-3.866-3.134-7-7-7z"/>
                        <path d="m110.2,102.04c-0.202-3.86-3.507-6.837-7.355-6.625-3.86,0.201-6.827,3.494-6.625,7.355l9.182,175.829c0.195,3.736 3.285,6.635 6.984,6.635 0.123,0 0.247-0.003 0.371-0.01 3.86-0.201 6.827-3.494 6.625-7.355l-9.182-175.829z"/>
                        <path d="m212.155,95.415c-3.899-0.223-7.153,2.764-7.355,6.625l-9.184,175.829c-0.202,3.861 2.765,7.154 6.625,7.355 0.125,0.007 0.248,0.01 0.371,0.01 3.698,0 6.789-2.898 6.984-6.635l9.184-175.829c0.202-3.861-2.764-7.154-6.625-7.355z"/>
                    </g>
                </svg>
            </span>

        </div>

        <div class="mt-10 flex flex-col gap-2">
            <h2 class="text-xl text-bold">Add Location</h2>
            <LocationInput class="" />
        </div>
    </div>

</template>

<script setup lang="ts">
import LocationInput from '@/components/LocationInput.vue'
import { ref, onUnmounted } from 'vue'
import { getWeatherInfoList, removeLocation, reorderList, storeData } from '@/composables/store.js'

const weatherInfoList = getWeatherInfoList();
const isDraggable = ref(false);
const elementId = ref<number | null>(null);
let dragStartIndex: number | null = null;
let dragEndIndex: number | null = null;

const dragStart = (index: number) => {
    dragStartIndex = index;
}
const dragEnter = (id: number) => {
    elementId.value = id;
}

const dragEnd = () => {
    elementId.value = null;
}
const dragDrop = (index: number) => {

    dragEndIndex = index;
    elementId.value = null;
    reorderList(dragStartIndex!, dragEndIndex);
    dragStartIndex = null;
    dragEndIndex = null;
    isDraggable.value = false;
}

onUnmounted(() => {
    storeData();
}) 


</script>


<style>

</style>