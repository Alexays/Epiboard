<template>
    <header tag="header" class="grey">
    <progressive-background no-ratio :src="background">
        <vue-typer tag="h1" :text="messages" pre-erase-delay='2000' :shuffle='true' @erased='addTrends'></vue-typer>
    </progressive-background>
    </header>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
