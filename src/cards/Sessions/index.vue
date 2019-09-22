<template>
  <v-tabs
    v-model="tab"
    id="sessions"
    :dark="!$store.state.settings.theme.light"
    :light="$store.state.settings.theme.light"
    background-color="primary"
    grow
    show-arrows
  >
    <v-tab v-for="(tab, i) in tabs" :key="i">{{ tab.name }}</v-tab>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="(tab, i) in tabs" :key="i">
        <List v-if="tab.data.length" :data="tab.data" icon padding />
        <v-card-text v-else class="text-center">
          <v-icon x-large>mdi-book-open-page-variant</v-icon>
          <h2 v-t="'Sessions.empty'" class="subtitle-1" />
        </v-card-text>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
