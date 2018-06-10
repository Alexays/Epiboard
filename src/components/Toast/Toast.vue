<template>
  <v-snackbar :timeout="timeout" :color="color" :multi-line="!!desc" top right v-model="active" @click="dismiss">
    <v-icon dark left v-if="icon.length > 0">
      {{icon}}
    </v-icon>
    <v-layout column>
      <v-flex class="subheading">{{title}}</v-flex>
      <v-flex class="caption" v-if="desc">{{desc}}</v-flex>
    </v-layout>
    <v-btn v-if="dismissible" flat @click="dismiss">Close</v-btn>
  </v-snackbar>
</template>
<script src="./main.js"></script>
