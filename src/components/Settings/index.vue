<template>
  <div id="settings">
    <v-content>
      <v-container fluid>
        <v-card class="container">
          <h4 class="headline">Header</h4>
          <h4 class="subheading">Choose your preferred design</h4>
          <v-layout align-center class="design-layout">
            <v-flex>
              <v-card hover class="design" :color="settings.header.design==='full' ? 'blue-grey': 'white'">
                <v-card-media @click="settings.header.design='full'" src="/static/img/full.jpg" height="125px" cover></v-card-media>
              </v-card>
            </v-flex>
            <v-flex>
              <v-card hover class="design" :color="settings.header.design==='toolbar' ? 'blue-grey': 'white'">
                <v-card-media @click="settings.header.design='toolbar'" src="/static/img/toolbar.jpg" height="125px" cover></v-card-media>
              </v-card>
            </v-flex>
          </v-layout>
          <h4 class="subheading">Background</h4>
          <v-select :items="artworks" v-model="settings.header.background" label="Pick a Background" autocomplete></v-select>
          <h4 class="headline">Dark mode</h4>
          <v-layout align-center>
            <v-switch :label="settings.dark.enabled ? `On` : `Off`" hide-details v-model="settings.dark.enabled"></v-switch>
            <v-checkbox :label="`Auto`" :disabled="!settings.dark.enabled" hide-details v-model="settings.dark.auto"></v-checkbox>
            <v-menu ref="menu_from" :disabled="!settings.dark.auto" lazy :close-on-content-click="false" v-model="menu.from" transition="scale-transition"
              offset-y full-width :nudge-right="40" max-width="290px" min-width="290px" :return-value.sync="settings.dark.from">
              <v-text-field :disabled="!settings.dark.auto" slot="activator" label="from" v-model="settings.dark.from" prepend-icon="access_time" readonly></v-text-field>
              <v-time-picker format="24h" v-model="settings.dark.from" @change="$refs.menu_from.save(settings.dark.from)"></v-time-picker>
            </v-menu>
            <v-menu ref="menu_to" :disabled="!settings.dark.auto" lazy :close-on-content-click="false" v-model="menu.to" transition="scale-transition"
              offset-y full-width :nudge-right="40" max-width="290px" min-width="290px" :return-value.sync="settings.dark.to">
              <v-text-field :disabled="!settings.dark.auto" slot="activator" label="to" v-model="settings.dark.to" prepend-icon="access_time" readonly></v-text-field>
              <v-time-picker format="24h" v-model="settings.dark.to" @change="$refs.menu_to.save(settings.dark.to)"></v-time-picker>
            </v-menu>
          </v-layout>
          <h4 class="headline">Google Trends</h4>
          <v-switch v-model="settings.trends.enabled" :label="settings.trends.enabled ? `On` : `Off`"></v-switch>
          <h4 class="subheading">Country</h4>
          <v-select :items="country" v-model="settings.trends.country" label="Pick a country" autocomplete></v-select>
          <h4 class="headline">Google Analytics</h4>
          <v-switch :label="settings.analytics ? `On` : `Off`" v-model="settings.analytics"></v-switch>
          <h4 class="headline">Debug</h4>
          <v-switch :label="settings.debug ? `On` : `Off`" v-model="settings.debug"></v-switch>
          <v-layout align-center>
            <v-btn v-on:click="save()" color="primary">Save</v-btn>
            <v-flex>
              <p class="text-xs-right">Made with
                <v-icon small color="red">favorite</v-icon> by
                <a href="https://arouillard.fr">Alexis Rouillard</a>
              </p>
            </v-flex>
          </v-layout>
        </v-card>
      </v-container>
    </v-content>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
