<template>
  <div id="settings">
    <v-content>
      <v-container fluid>
        <v-card class="container">
          <Config :settings="settings" id="global"/>
        </v-card>
      </v-container>
    </v-content>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
