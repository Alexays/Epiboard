<template>
  <header tag="header" class="grey">
    <div class="background" v-if="background">
      <img v-lazy="background" />
    </div>
    <template v-if="$store.state.settings.header.design === 'full'">
      <a :href="typer.current.length > 0 ? 'https://www.google.com/#q=' + typer.current : null" v-show="$route.path === '/'">
        <vue-typer tag="h1" :text="messages" pre-erase-delay='5000' erase-delay='250' shuffle :repeat='messages.length === 1 ? 0 : Infinity' @erased='addTrends' @typed='onTyped'></vue-typer>
      </a>
      <vue-typer v-if="$route.path !== '/'" tag="h1" :text="$route.name" :repeat='0'></vue-typer>
      <v-btn title="Home" v-if="$route.path === '/settings'" id="settings" flat icon color="white" to="/">
        <v-icon x-large>&#xE5C4;</v-icon>
      </v-btn>
      <v-btn title="Settings" v-show="$route.path !== '/settings'" id="settings" flat icon color="white" to="/settings">
        <v-icon>&#xE5D4;</v-icon>
      </v-btn>
    </template>
    <v-toolbar v-else prominent>
      <v-btn @click="search" icon :disabled="$route.path === '/settings'">
        <v-icon>&#xE8B6;</v-icon>
      </v-btn>
      <v-text-field v-on:keyup.13="search" :value="$route.path === '/' ? typer.part : $route.name"
      @input="typer.typed = $event" hide-details single-line :disabled="$route.path !== '/'"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn title="Settings" v-show="$route.path !== '/settings'" to="/settings" icon>
        <v-icon>&#xE5D4;</v-icon>
      </v-btn>
      <v-btn title="Home" v-if="$route.path === '/settings'" to="/" icon>
        <v-icon>&#xE5C4;</v-icon>
      </v-btn>
    </v-toolbar>
  </header>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
