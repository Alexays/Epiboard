<template>
    <header class="grey"
    :style="{ 'background-size': 'cover', 'background': 'url(' + background + ') no-repeat center center fixed' }">
        <vue-typer tag="h1" :text="welcomeMessage" :repeat='0'></vue-typer>
    </header>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
