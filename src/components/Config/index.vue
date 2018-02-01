<template>
  <div id="config">
    <div v-for="config in settings" :key="config.title">
      <h4 class="headline">{{config.title}}</h4>
      <v-select v-if="config.type === 'select'" v-bind:items="config.items" v-model="config.value" label="Select" single-line bottom></v-select>
    </div>
    <v-btn v-on:click="save()" color="primary">Save</v-btn>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
