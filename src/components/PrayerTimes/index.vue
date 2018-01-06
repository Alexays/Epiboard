<template>
    <div class="prayer-times">
        <div v-bind:class="['row', { 'is-active': prayer == current }]" v-for="(data, prayer) in times">
            <div class="prayer-times__name row__column">
                <span>{{ data.name }}</span>
            </div>
            <div class="prayer-times__time row__column">
                <span>{{ data.time }}</span>
            </div>
        </div>
    </div>
</template>
<script src="./main.js"></script>
<style lang="sass" src="./style.scss" scoped></style>
