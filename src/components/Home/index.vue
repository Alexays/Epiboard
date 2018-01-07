<template>
    <div id="container">
        <div id="card-container">
            <div v-for="card in cards" :key="card.name" :data-item-id="card.name" class="card">
              <component :is="card" :key="card.name"></component>
            </div>
        </div>
    </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
