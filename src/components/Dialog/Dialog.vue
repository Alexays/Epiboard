<template>
  <v-dialog v-model="active" :max-width="500" class="application" persistent>
    <v-card>
      <v-card-title class="headline">
        {{ title }}
      </v-card-title>
      <v-card-text class="subheading">
        {{ text }}
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="green darken-1" flat="flat" @click="close()">{{ cancel }}</v-btn>
        <v-btn color="green darken-1" flat="flat" @click="valid()">{{ ok }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script src="./main.js"></script>
