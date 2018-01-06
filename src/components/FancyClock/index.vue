<template>
    <div class="fancy-clock">
        <div class="message">Hi {{ name }}</div>
        <div class="datetime">
            <div class="datetime__time">{{ time }}</div>
            <div class="datetime__date">{{ date }}</div>
        </div>
        <div class="weather" v-if="cond">
            <div class="weather__temp">{{ temp }}&deg;</div>
            <div class="weather__cond">{{ cond }}</div>
        </div>
        <div class="gallery">
            <div class="gallery__slide" v-for="(img, index) in imgs" :style="{ backgroundImage: img }"></div>
        </div>
    </div>
</template>
<script src="./main.js"></script>
<style lang="sass" src="./style.scss" scoped></style>
