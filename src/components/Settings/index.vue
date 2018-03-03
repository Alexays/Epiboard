<template>
  <div id="settings">
    <v-content>
      <v-container fluid>
        <v-card class="container">
          <Config :settings="settings" id="global"/>
          <p class="text-xs-right">Made with <v-icon small color="red">favorite</v-icon> by <a href="https://arouillard.fr">Alexis Rouillard</a></p>
        </v-card>
      </v-container>
    </v-content>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
