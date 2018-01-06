<template>
    <header class="z-depth-3 valign-wrapper grey lighten-5"
    :style="{ 'background': 'url(' + background + ') no-repeat center center fixed',
    'background-size': 'cover' }">
        <h1><vue-typer :text="welcomeMessages" :repeat='0' :shuffle='true'></vue-typer></h1>
    </header>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
