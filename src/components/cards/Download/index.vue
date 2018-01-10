<template>
<div class="blue-grey">
    <div class="card-header white-text">
      <span class="card-title">Download</span>
    </div>
    <div class="card-content white">
      <li class="download" v-for="download in downloads" :key="download.id">
        <div class="icon">
          <div class="fileicon" v-if="download.filename && download.icon" :style="{'background-image': 'url(' + download.icon + ')'}"></div>
        </div>
				<div class="info">
					<div class="name">{{download.filename | filename}}</div>
					<span class="size"><span v-if="download.state == 'in_progress'">
            {{download.bytesReceived | bytes}} / </span>{{download.totalBytes | bytes}}</span> -
					<a :href="download.url" class="host">{{download.url}}</a>
				</div>
      </li>
    </div>
</div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
