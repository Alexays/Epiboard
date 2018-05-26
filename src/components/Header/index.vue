<template>
  <header class="grey">
    <progressive-background class="background" no-ratio v-if="background" :src="background" :placeholder="placeholder" />
    <template v-if="$store.state.settings.header.design === 'full'">
      <vue-typer :text="$route.path === '/' ? messages : [$route.name]" full-erase :erase-delay="5000" :repeat="messages.length === 1 || $route.path !== '/' ? 0 : Infinity"></vue-typer>
      <v-btn title="Home" v-if="$route.path === '/settings'" id="settings" flat icon color="white" to="/">
        <v-icon x-large>&#xE5C4;</v-icon>
      </v-btn>
      <v-btn title="Settings" v-else id="settings" flat icon color="white" to="/settings">
        <v-icon>&#xE5D4;</v-icon>
      </v-btn>
    </template>
    <v-toolbar v-else prominent>
      <v-btn icon disabled>
        <v-icon>&#xE8B6;</v-icon>
      </v-btn>
      <vue-typer text-field :text="$route.path === '/' ? messages : [$route.name]" full-erase :erase-delay="5000" :repeat="messages.length === 1 || $route.path !== '/' ? 0 : Infinity"></vue-typer>
      <v-spacer></v-spacer>
      <v-btn title="Home" v-if="$route.path === '/settings'" to="/" icon>
        <v-icon>&#xE5C4;</v-icon>
      </v-btn>
      <v-btn title="Settings" v-else to="/settings" icon>
        <v-icon>&#xE5D4;</v-icon>
      </v-btn>
    </v-toolbar>
  </header>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
<style>
.progressive-image-preloader {
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.35));
}
</style>
