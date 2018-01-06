<template>
    <div class="dribbble">
        <a class="dribbble__shot" :href="shot.html_url" target="_blank" v-for="shot in shots"><img :src="shot.images.normal" :title="shot.title" :alt="shot.title"></a>
    </div>
</template>
<script src="./main.js"></script>
<style lang="sass" src="./style.scss" scoped></style>
