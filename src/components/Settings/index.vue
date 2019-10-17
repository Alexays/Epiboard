<template>
  <v-content id="settings">
    <v-container fluid>
      <v-card class="container">
        <h4 v-t="'settings.langs'" class="headline"/>
        <v-autocomplete
          :items="langs"
          v-model="settings.lang" :label="$t('settings.choose.lang')"/>
        <h4 v-t="'settings.choose.24h'" class="subheading"/>
        <v-switch
          v-model="settings.hour24"
          :label="$tc('settings.onOff', settings.hour24)" class="mt-0 mb-2" hide-details/>
        <h4 v-t="'settings.header'" class="headline"/>
        <h4 v-t="'settings.choose.design'" class="subheading"/>
        <v-radio-group v-model="settings.header.design" :mandatory="false">
          <v-radio :label="$t('settings.design.full')" value="full"/>
          <v-radio :label="$t('settings.design.toolbar')" value="toolbar"/>
        </v-radio-group>
        <v-layout align-center>
          <v-autocomplete
            :items="artworks"
            v-model="settings.header.background" :label="$t('settings.choose.background')"/>
          <v-text-field
            v-if="settings.header.background === 'url'"
            v-model.lazy="settings.header.backgroundUrl"
            :label="$t('settings.placeholder.background')"/>
          <div v-if="settings.header.background === 'local'" class="file-btn">
            <input ref="inputLocal" type="file" accept="image/*" @change="fileChange">
            <v-btn :loading="localLoading" @click="$refs.inputLocal.click()">
              {{ backgroundLocal.filename || $t('settings.browse') }}
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
          <v-flex xs2>
            <v-switch
              v-model="settings.trends.enabled"
              :label="$tc('settings.onOff', settings.trends.enabled)" class="mt-0" hide-details/>
          </v-flex>
          <v-autocomplete
            :items="$options.countries"
            :disabled="!settings.trends.enabled"
            v-model="settings.trends.country" :label="$t('settings.choose.trends')"/>
        </v-layout>
        <h4 v-t="'settings.custom_message'" class="subheading"/>
        <v-layout align-center>
          <v-flex xs2>
            <v-switch
              v-model="settings.header.customMessage"
              :disabled="settings.trends.enabled"
              :label="$tc('settings.onOff', settings.header.customMessage)"
              class="mt-0" hide-details/>
          </v-flex>
          <v-text-field
            v-model.lazy="settings.header.message"
            :disabled="settings.trends.enabled || !settings.header.customMessage"
            :label="$t(`settings.placeholder.${settings.trends.enabled
            ? 'custom_desactived' : 'custom_message'}`)"/>
        </v-layout>
        <h4 class="subheading">Google Doodles</h4>
        <v-switch
          :label="$tc('settings.onOff', settings.doodle.enabled)"
          v-model="settings.doodle.enabled"/>
        <h4 v-t="'settings.theme'" class="headline"/>
        <h4 v-t="'settings.choose.color'" class="subheading"/>
        <v-layout>
          <v-flex xs6 class="picker mr-3">
            <li
              v-for="color in $options.palette"
              :key="color" :style="{ 'background-color': color }" @click="themeChange(color)">
              <div v-show="settings.theme.primary.toLowerCase() === color" class="color-dot"/>
            </li>
          </v-flex>
          <v-text-field
            v-model.lazy="settings.theme.primary"
            :rules="[
            () => validateHex(settings.theme.primary) || $t('settings.error.color')]"
            :label="$t('settings.placeholder.color')" @change="themeChange"/>
        </v-layout>
        <h4 v-t="'settings.choose.custom_font'" class="subheading"/>
        <v-layout align-center>
          <v-flex xs2>
            <v-switch
              v-model="settings.theme.customFont"
              :label="$tc('settings.onOff', settings.theme.customFont)" class="mt-0" hide-details/>
          </v-flex>
          <v-text-field
            v-model.lazy="settings.theme.font"
            :disabled="!settings.theme.customFont"
            :label="$t('settings.placeholder.custom_font')"/>
        </v-layout>
        <template v-if="settings.debug">
          <h4 v-t="'settings.custom_css'" class="subheading"/>
          <h3 v-t="'settings.custom_css_warning'" class="body-2 error--text"/>
          <v-text-field
            v-model="settings.theme.customCssUrl"
            :label="$t('settings.custom_css_desc')"/>
        </template>
        <h4 v-t="'settings.dark.title'" class="headline"/>
        <h4 v-t="'settings.dark.desc'" class="subheading"/>
        <v-layout align-center>
          <v-flex xs2>
            <v-switch
              :label="$tc('settings.onOff', settings.dark.enabled)"
              v-model="settings.dark.enabled" class="mt-0" hide-details/>
          </v-flex>
          <v-flex xs2>
            <v-checkbox
              :disabled="!settings.dark.enabled"
              :label="$t('settings.dark.auto')"
              v-model="settings.dark.auto" class="mt-0" hide-details/>
          </v-flex>
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
              v-model="settings.dark.from"
              :label="$t('settings.dark.from')" prepend-icon="access_time" readonly/>
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
              v-model="settings.dark.to"
              :label="$t('settings.dark.to')" prepend-icon="access_time" readonly/>
            <v-time-picker
              v-model="settings.dark.to"
              format="24h" @change="$refs.menu_to.save(settings.dark.to)"/>
          </v-menu>
        </v-layout>
        <h4 class="headline">Google Analytics</h4>
        <h4 v-t="'settings.analytics_desc'" class="subheading"/>
        <v-switch
          :disabled="!$ga"
          :label="$tc('settings.onOff', settings.analytics)" v-model="settings.analytics"/>
        <h4 class="headline">Debug</h4>
        <h4 v-t="'settings.debug_desc'" class="subheading"/>
        <v-switch :label="$tc('settings.onOff', settings.debug)" v-model="settings.debug"/>
        <h4 v-t="'settings.whatsnew'" class="subheading"/>
        <v-switch
          :label="$tc('settings.onOff', settings.whatsnew)"
          v-model="settings.whatsnew" hide-details/>
        <v-layout class="pt-3" align-center>
          <v-btn v-t="'settings.save'" color="primary" small @click="save"/>
          <v-btn v-t="'settings.reset'" flat small @click="reset"/>
          <v-flex>
            <p class="text-xs-right">
              Made with
              <a alt="Donate" href="https://paypal.me/ARouillard">
                <v-icon small color="red">favorite</v-icon>
              </a> by
              <a href="https://arouillard.fr">Alexis Rouillard</a> | {{ $options.version }}
            </p>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </v-content>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
