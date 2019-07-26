<template>
  <div id="header" class="grey">
    <template v-if="!$options.isPreRender">
      <v-img
        :src="background"
        :lazy-src="lazyBackground"
        :gradient="design === 'full' ? 'to bottom, transparent, rgba(0, 0, 0, 0.30)' : null"
        position="center 55%" width="100%" height="100%" class="background" />
      <v-img v-if="doodle" :src="`https:${doodle.url}`" :alt="doodle.title" class="doodle" contain/>
      <template v-if="design === 'full'">
        <vue-typer :text="texts" :erase-delay="5000" :repeat="messagesRepeat" full-erase/>
        <v-btn
          v-if="$route.path === '/settings'"
          id="settings" :title="$t('settings.save')" color="white" to="/" outline text icon>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn
          v-else-if="$route.path !== '/onboarding'"
          id="settings"
          :title="$t('settings.title')" color="white" to="/settings" outline text icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-toolbar v-else>
        <v-btn :disabled="$route.path !== '/'" icon @click="$refs.typer.search()">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <vue-typer
          ref="typer"
          :text="texts" :erase-delay="5000" :repeat="messagesRepeat" text-field full-erase/>
        <v-btn v-if="$route.path === '/settings'" :title="$t('settings.save')" to="/" icon>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn
          v-else-if="$route.path !== '/onboarding'"
          :title="$t('settings.title')" to="/settings" icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-toolbar>
    </template>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
