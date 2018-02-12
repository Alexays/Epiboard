<template>
	<div id="top-sites">
    <ul>
			<li v-for="node in topSites" :key="node">
				<a :href="node.url">
				  <i :style="{'background-image': 'url('+getFavicon(node.url)+')'}"></i>
				  <span class="n-title">{{node.title}}</span>
			  </a>
			</li>
		</ul>
	</div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
