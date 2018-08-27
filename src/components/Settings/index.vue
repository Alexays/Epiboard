<template>
  <v-content id="settings">
    <v-container fluid>
      <v-card class="container">
        <h4 class="headline">{{ $t('settings.langs') }}</h4>
        <v-autocomplete
          :items="langs"
          v-model="settings.lang" :label="$t('settings.choose.lang')"/>
        <h4 class="headline">{{ $t('settings.header') }}</h4>
        <h4 class="subheading">{{ $t('settings.choose.design') }}</h4>
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
            :items="country"
            :disabled="!settings.trends.enabled"
            v-model="settings.trends.country" :label="$t('settings.choose.trends')"/>
        </v-layout>
        <h4 class="subheading">{{ $t('settings.custom_message') }}</h4>
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
        <h4 class="headline">{{ $t('settings.theme') }}</h4>
        <h4 class="subheading">{{ $t('settings.choose.color') }}</h4>
        <v-layout>
          <v-flex xs6 class="picker mr-3">
            <li
              v-for="color in palette"
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
        <h4 class="subheading">{{ $t('settings.choose.custom_font') }}</h4>
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
          <h4 class="subheading">{{ $t('settings.custom_css') }}</h4>
          <h3 class="body-2 error--text">{{ $t('settings.custom_css_warning') }}</h3>
          <v-text-field
            v-model="settings.theme.customCssUrl"
            :label="$t('settings.custom_css_desc')"/>
        </template>
        <h4 class="headline">{{ $t('settings.dark.title') }}</h4>
        <h4 class="subheading">{{ $t('settings.dark.desc') }}</h4>
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
        <h4 class="headline">{{ $t('settings.auth.title') }}</h4>
        <h4 class="subheading">{{ $t('settings.auth.desc') }}</h4>
        <v-btn
          :disabled="!$utils.gauth.isConnected()"
          color="blue" class="white--text" @click="$utils.gauth.revoke()">
          {{ $t('auth.disconnect_from', { service: 'Google'}) }}
        </v-btn>
        <h4 class="headline">Google Analytics</h4>
        <h4 class="subheading">{{ $t('settings.analytics_desc') }}</h4>
        <v-switch :label="$tc('settings.onOff', settings.analytics)" v-model="settings.analytics"/>
        <h4 class="headline">Debug</h4>
        <h4 class="subheading">{{ $t('settings.debug_desc') }}</h4>
        <v-switch :label="$tc('settings.onOff', settings.debug)" v-model="settings.debug"/>
        <v-layout align-center>
          <v-btn flat small @click="save">{{ $t('settings.save') }}</v-btn>
          <v-btn flat small @click="reset">{{ $t('settings.reset') }}</v-btn>
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
