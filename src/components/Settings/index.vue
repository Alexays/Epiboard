<template>
  <v-content id="settings">
    <v-container fluid>
      <v-card class="container">
        <h4 class="headline">Header</h4>
        <h4 class="subheading">Choose your preferred design</h4>
        <v-radio-group v-model="settings.header.design" :mandatory="false">
          <v-radio label="Full" value="full"/>
          <v-radio label="Toolbar" value="toolbar"/>
        </v-radio-group>
        <v-layout align-center>
          <v-autocomplete
            :items="artworks"
            v-model="settings.header.background" label="Choose your background"/>
          <v-text-field
            v-if="settings.header.background === 'url'"
            v-model.lazy="settings.header.backgroundUrl"
            label="From URL, e.g. https://i.imgur.com/foVYQ6T.jpg"/>
          <div v-if="settings.header.background === 'local'" class="file-btn">
            <input ref="inputLocal" type="file" accept="image/*" @change="fileChange"/>
            <v-btn :loading="localLoading" @click="$refs.inputLocal.click()">
              {{ backgroundLocal.filename || 'Browse' }}
            </v-btn>
            <v-btn
              v-show="backgroundLocal.filename"
              icon @click="deleteBackgroundLocal">
              <v-icon>delete</v-icon>
            </v-btn>
          </div>
        </v-layout>
        <h4 class="subheading">Google Trends</h4>
        <v-layout align-center>
          <v-switch
            v-model="settings.trends.enabled"
            :label="settings.trends.enabled ? `On` : `Off`" class="mt-0" hide-details/>
          <v-autocomplete
            :items="country"
            :disabled="!settings.trends.enabled"
            v-model="settings.trends.country" label="Choose your Google Trends Country"/>
        </v-layout>
        <h4 class="subheading">Google Doodles</h4>
        <v-switch
          :label="settings.doodle.enabled ? `On` : `Off`" v-model="settings.doodle.enabled"/>
        <h4 class="headline">Theme</h4>
        <h4 class="subheading">Choose the main color</h4>
        <v-layout>
          <v-flex xs6 class="picker">
            <li
              v-for="color in palette"
              :key="color" :style="{ 'background-color': color }" @click="themeChange(color)">
              <div v-show="settings.theme.primary.toLowerCase() === color" class="color-dot"/>
            </li>
          </v-flex>
          <v-text-field
            v-model.lazy="settings.theme.primary"
            :rules="[
            () => validateHex(settings.theme.primary) || 'Invalid hex, e.g. #607D8B']"
            label="Main color, e.g. #607D8B" @change="themeChange"/>
        </v-layout>
        <h4 class="headline">Dark mode</h4>
        <h4 class="subheading">It's gonna get all dark</h4>
        <v-layout align-center>
          <v-switch
            :label="settings.dark.enabled ? `On` : `Off`"
            v-model="settings.dark.enabled" class="mt-0" hide-details/>
          <v-checkbox
            :disabled="!settings.dark.enabled"
            :label="`Auto`" v-model="settings.dark.auto" class="mt-0" hide-details/>
          <v-menu
            ref="menu_from"
            :disabled="!settings.dark.auto || !settings.dark.enabled"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="settings.dark.from"
            v-model="menu.from"
            offset-y
            full-width lazy transition="scale-transition" max-width="290px" min-width="290px">
            <v-text-field
              slot="activator"
              :disabled="!settings.dark.auto"
              v-model="settings.dark.from" label="From" prepend-icon="access_time" readonly/>
            <v-time-picker
              v-model="settings.dark.from"
              format="24h" @change="$refs.menu_from.save(settings.dark.from)"/>
          </v-menu>
          <v-menu
            ref="menu_to"
            :disabled="!settings.dark.auto || !settings.dark.enabled"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="settings.dark.to"
            v-model="menu.to"
            offset-y
            full-width lazy transition="scale-transition" max-width="290px" min-width="290px">
            <v-text-field
              slot="activator"
              :disabled="!settings.dark.auto"
              v-model="settings.dark.to" label="To" prepend-icon="access_time" readonly/>
            <v-time-picker
              v-model="settings.dark.to"
              format="24h" @change="$refs.menu_to.save(settings.dark.to)"/>
          </v-menu>
        </v-layout>
        <h4 class="headline">Google Analytics</h4>
        <h4 class="subheading">Just to see how you use cards</h4>
        <v-switch :label="settings.analytics ? `On` : `Off`" v-model="settings.analytics"/>
        <h4 class="headline">Debug</h4>
        <h4 class="subheading">If you feel up to it</h4>
        <v-switch :label="settings.debug ? `On` : `Off`" v-model="settings.debug"/>
        <v-layout align-center>
          <v-btn flat small @click="reset">Reset settings</v-btn>
          <v-flex>
            <p class="text-xs-right">
              Made with
              <a alt="Donate" href="https://paypal.me/ARouillard">
                <v-icon small color="red">favorite</v-icon>
              </a> by
              <span><a href="https://arouillard.fr">Alexis Rouillard</a> | {{ version }}</span>
            </p>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </v-content>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
