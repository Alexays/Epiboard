<template>
	<div id="meteo">
		<h1>Meteo</h1>
		<img v-bind:src="'http://openweathermap.org/img/w/' + meteo_datas.weather[0].icon + '.png'">
		<p>{{meteo_datas.main.temp}}°C</p>
	</div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
