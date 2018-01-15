<template>
    <header tag="header" class="grey">
    <progressive-background no-ratio :src="background"
    :style="{ 'background-size': 'cover' }">
        <vue-typer tag="h1" :text="welcomeMessage" :repeat='0'></vue-typer>
    </progressive-background>
    </header>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
