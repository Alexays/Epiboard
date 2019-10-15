<template>
  <v-card :width="500" hover raised dark class="primary foreground--text mx-auto mt-3">
    <v-card-title class="secondary">
      <h3 v-t.preserve="'onboarding.settings.title'" class="headline"/>
    </v-card-title>
    <v-card-text>
      <h4 v-t.preserve="'settings.langs'" class="headline"/>
      <v-autocomplete
        :items="langs"
        v-model="settings.lang" :label="$t('settings.choose.lang')"/>
      <h4 v-t.preserve="'settings.choose.design'" class="subheading"/>
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
          :items="$options.countries"
          :disabled="!settings.trends.enabled"
          v-model="settings.trends.country" :label="$t('settings.choose.trends')"/>
      </v-layout>
      <v-switch :label="$t('settings.whatsnew')" v-model="settings.whatsnew" hide-details/>
    </v-card-text>
    <v-card-actions class="secondary">
      <v-btn
        v-t.preserve="'onboarding.previous'" color="teal lighten-4" flat @click="$emit('prev')"/>
      <v-spacer/>
      <v-btn v-t.preserve="'onboarding.next'" color="teal lighten-4" flat @click="$emit('next')"/>
    </v-card-actions>
  </v-card>
</template>
<script>
import { loadLang } from '@/i18n';
import countries from '../Settings/countries';
import artworks from '../Settings/artworks';

export default {
  name: 'Why',
  countries,
  data() {
    return {
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
