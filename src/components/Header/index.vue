<template>
  <header tag="header" class="grey">
    <div class="background" v-if="background">
      <img v-lazy="background" />
    </div>
    <v-toolbar card absolute prominent>
      <v-text-field v-on:keyup.native="search" prepend-icon="search" :value="typer.part" @input="typer.typed = $event" autofocus hide-details single-line></v-text-field>
      <v-spacer></v-spacer>
      <v-btn title="Go to settings" v-show="$route.path !== '/settings'" to="/settings" icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
      <v-btn title="Back to home" v-if="$route.path === '/settings'" to="/" icon>
        <v-icon>arrow_back</v-icon>
      </v-btn>
    </v-toolbar>
  </header>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
