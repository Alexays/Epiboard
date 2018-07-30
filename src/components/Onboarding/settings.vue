<template>
  <v-card :width="500" hover raised dark class="primary foreground--text mx-auto mt-3">
    <v-card-title class="secondary">
      <h3 class="headline">{{ $t('onboarding.settings.title') }}</h3>
    </v-card-title>
    <v-card-text>
      <h4 class="headline">{{ $t('settings.langs') }}</h4>
      <v-autocomplete
        :items="langs"
        v-model="settings.lang" :label="$t('settings.choose.lang')"/>
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
      </v-layout>
      <h4 class="subheading">Google Trends</h4>
      <v-layout align-center>
        <v-switch
          v-model="settings.trends.enabled"
          :label="$tc('settings.onOff', settings.trends.enabled)" class="mt-0" hide-details/>
        <v-autocomplete
          :items="countries"
          :disabled="!settings.trends.enabled"
          v-model="settings.trends.country" :label="$t('settings.choose.trends')"/>
      </v-layout>
    </v-card-text>
    <v-card-actions class="secondary">
      <v-btn color="teal lighten-4" flat @click="$emit('prev')">
        {{ $t('onboarding.previous') }}
      </v-btn>
      <v-spacer/>
      <v-btn color="teal lighten-4" flat @click="$emit('next')">{{ $t('onboarding.next') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import * as VRadioGroup from 'vuetify/es5/components/VRadioGroup';
import { VSwitch, VAutocomplete, VTextField } from 'vuetify';
import { loadLang } from '@/i18n';
import countries from '../Settings/countries';
import artworks from '../Settings/artworks';

export default {
  name: 'Why',
  components: {
    ...VRadioGroup,
    VSwitch,
    VAutocomplete,
    VTextField,
  },
  data() {
    return {
      countries,
      settings: this.$store.state.settings,
    };
  },
  computed: {
    artworks() {
      const { locale } = this.$i18n;
      if (!locale) return [];
      return artworks.map(f => ({ text: this.$t(f.text), value: f.value }));
    },
    langs() {
      return Langs.map(f => ({ value: f.locale, text: f.name }));
    },
  },
  watch: {
    'settings.lang': function lang(val, old) {
      if (val === old || old === undefined) return;
      loadLang(this, val);
    },
  },
  beforeDestroy() {
    this.$store.commit('SET_SETTINGS', this.settings);
  },
};
</script>
