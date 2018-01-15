<template>
<div class="blue-grey">
    <v-card-title class="white--text">
      <span class="headline">Quick Settings</span>
    </v-card-title>
    <v-card-text class="white">
				<v-checkbox label="Cache" v-model="types.cache" color="primary" hide-details></v-checkbox>
				<v-checkbox label="Cookies" v-model="types.cookies" color="primary" hide-details></v-checkbox>
				<v-checkbox label="History" v-model="types.history" color="primary" hide-details></v-checkbox>
				<v-checkbox label="Local Storage" v-model="types.localStorage" color="primary" hide-details></v-checkbox>
				<v-progress-linear v-if="loading" v-bind:indeterminate="true"></v-progress-linear>
				<v-btn v-if="!loading" :disabled="isFalse()" v-on:click="clear()" flat>Clear</v-btn>
    </v-card-text>
</div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
