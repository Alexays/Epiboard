<template>
  <v-snackbar
    v-model="active"
    :timeout="timeout"
    :color="color" :multi-line="!!desc" top right class="application" @click="dismiss">
    <v-icon v-if="icon.length > 0" dark left>
      {{ icon }}
    </v-icon>
    <v-layout column>
      <v-flex v-if="title">{{ title }}</v-flex>
      <v-flex v-if="desc">{{ desc }}</v-flex>
    </v-layout>
    <v-btn v-if="dismissible" flat @click="dismiss">
      <v-icon>close</v-icon>
    </v-btn>
  </v-snackbar>
</template>
<script src="./main.js"></script>
