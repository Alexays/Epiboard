<template>
  <v-snackbar :timeout="timeout" :color="color" top right v-model="active" @click="dismiss">
    <v-icon dark left v-if="icon.length > 0">
      {{icon}}
    </v-icon>
    <span>{{text}}</span>
    <v-btn v-if="dismissible" flat @click="dismiss">Close</v-btn>
  </v-snackbar>
</template>
<script src="./main.js"></script>
