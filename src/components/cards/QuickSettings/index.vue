<template>
<div class="blue-grey">
    <v-card-title class="white--text">
      <span class="headline">Quick Settings</span>
    </v-card-title>
    <v-card-text class="white">
      <p>
				<input type="checkbox" id="checkCache" />
				<label for="checkCache">Cache</label>
			</p>
			<p>
				<input type="checkbox" id="checkCookies" />
				<label for="checkCookies">Cookies</label>
			</p>
			<p>
				<input type="checkbox" id="checkHistory" />
				<label for="checkHistory">History</label>
			</p>
			<p>
				<input type="checkbox" id="checkLocalStorage" />
				<label for="checkLocalStorage">Local Storage</label>
			</p>
			<button ng-click="clear(); track(card.name, 'Cleared')" class="btn-flat white">Clear</button>
    </v-card-text>
</div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
