<template>
  <header tag="header" class="grey">
    <progressive-background no-ratio :src="background">
      <vue-typer tag="h1" :text="messages" pre-erase-delay='5000' erase-delay='250' :shuffle='true' @erased='addTrends'></vue-typer>
    </progressive-background>
    <router-link to="/settings">
      <v-btn id="settings" flat icon color="white">
        <v-icon>more_vert</v-icon>
      </v-btn>
    </router-link>
  </header>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
