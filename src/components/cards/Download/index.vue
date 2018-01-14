<template>
<div class="blue-grey">
    <v-card-title class="white--text">
      <span class="headline">Downloads</span>
    </v-card-title>
    <v-card-text class="white">
      <li class="download" v-for="download in downloads" :key="download.id">
        <div title="Open Download" class="icon" v-on:click="open(download)">
          <div class="fileicon" v-if="download.filename && download.icon" :style="{'background-image': 'url(' + download.icon + ')'}"></div>
          <i v-if="!download.filename || !download.icon" class="material-icons">insert_drive_file</i>
        </div>
				<div class="d-info">
					<div title="Open Download" class="name" v-on:click="open(download)">{{download.filename | filename}}</div>
					<span class="size"><span v-if="download.state == 'in_progress'">
            {{download.bytesReceived | bytes}} / </span>{{download.totalBytes | bytes}}</span> -
					<a :href="download.url" class="host">{{download.url}}</a>
				</div>
      </li>
    </v-card-text>
</div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
