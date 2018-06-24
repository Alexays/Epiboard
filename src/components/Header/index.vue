<template>
  <header class="grey">
    <progressive-background class="background" no-ratio v-if="background" :src="background" :placeholder="placeholder" :fallback="fallback" />
    <img class="doodle" v-if="doodle" :src="`https:${doodle.url}`" :alt="doodle.title"/>
    <template v-if="$store.state.settings.header.design === 'full'">
      <vue-typer :text="texts" full-erase :erase-delay="5000" :repeat="messagesRepeat"></vue-typer>
      <v-btn title="Home" v-if="$route.path === '/settings'" id="settings" outline flat icon color="white" to="/">
        <v-icon>&#xE5C4;</v-icon>
      </v-btn>
      <v-btn title="Settings" v-else-if="$route.path !== '/onboarding'" id="settings" outline flat icon color="white" to="/settings">
        <v-icon>&#xE5D4;</v-icon>
      </v-btn>
    </template>
    <v-toolbar v-else prominent>
      <v-btn icon disabled>
        <v-icon>&#xE8B6;</v-icon>
      </v-btn>
      <vue-typer text-field :text="texts" full-erase :erase-delay="5000" :repeat="messagesRepeat"></vue-typer>
      <v-spacer></v-spacer>
      <v-btn title="Home" v-if="$route.path === '/settings'" to="/" icon>
        <v-icon>&#xE5C4;</v-icon>
      </v-btn>
      <v-btn title="Settings" v-else-if="$route.path !== '/onboarding'" to="/settings" icon>
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
