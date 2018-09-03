<template>
  <div>
    <v-btn
      color="primary" class="ma-0 foreground--text"
      block dark depressed small @click="getTimeline()">
      timeline
    </v-btn>
    <v-dialog v-model="enabled" lazy scrollable max-width="80%" width="unset">
      <v-card>
        <v-card-text class="text-xs-center">
          <canvas v-show="timeline.length" id="canvas"/>
          <v-progress-linear v-if="loading" :style="{ 'min-width': '150px' }" indeterminate/>
          <div v-else-if="!timeline.length" class="text-xs-center title">
            Happy holidays :)
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script src="./main.js"></script>
