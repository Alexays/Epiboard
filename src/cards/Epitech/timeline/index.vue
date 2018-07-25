<template>
  <div>
    <v-btn
      color="primary" class="ma-0 foreground--text"
      block dark depressed small @click="getTimeline()">
      timeline
    </v-btn>
    <v-dialog v-model="enabled" lazy scrollable max-width="80%">
      <v-card>
        <v-card-text>
          <canvas v-if="loading || timeline.length" id="canvas">
            <v-progress-linear v-show="loading" indeterminate/>
          </canvas>
          <div v-else class="text-xs-center title">
              Happy holidays :)
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script src="./main.js"></script>
