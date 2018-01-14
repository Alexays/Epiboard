<template>
    <div id="container">
        <transition-group name="slide-fade" appear tag="div" id="card-container">
          <v-card v-for="card in cards" :data-item-id="card.name" :key="card.name">
            <component :is="card"></component>
          </v-card>
        </transition-group>
    </div>
</template>
<script src="../../../node_modules/web-animations-js/web-animations.min.js"></script>
<script src="../../../node_modules/hammerjs/hammer.min.js"></script>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
