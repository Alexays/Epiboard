<template>
  <header class="grey">
    <div
      v-lazy:background-image="{ src: background, error: $options.fallback }"
      :key="background" class="background"/>
    <img v-if="doodle" :src="`https:${doodle.url}`" :alt="doodle.title" class="doodle">
    <template v-if="$store.state.settings.header.design === 'full'">
      <vue-typer :text="texts" :erase-delay="5000" :repeat="messagesRepeat" full-erase/>
      <v-btn
        v-if="$route.path === '/settings'"
        id="settings" :title="$t('settings.save')" color="white" to="/" outline flat icon>
        <v-icon>&#xE5C4;</v-icon>
      </v-btn>
      <v-btn
        v-else-if="$route.path !== '/onboarding'"
        id="settings" :title="$t('settings.title')" color="white" to="/settings" outline flat icon>
        <v-icon>&#xE5D4;</v-icon>
      </v-btn>
    </template>
    <v-toolbar v-else prominent>
      <v-btn icon disabled>
        <v-icon>&#xE8B6;</v-icon>
      </v-btn>
      <vue-typer :text="texts" :erase-delay="5000" :repeat="messagesRepeat" text-field full-erase/>
      <v-btn v-if="$route.path === '/settings'" :title="$t('settings.save')" to="/" icon>
        <v-icon>&#xE5C4;</v-icon>
      </v-btn>
      <v-btn
        v-else-if="$route.path !== '/onboarding'"
        :title="$t('settings.title')" to="/settings" icon>
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
