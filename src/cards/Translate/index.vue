<template>
  <div id="translate">
    <v-layout>
      <v-flex class="left" xs5>
        <v-textarea
          v-model="cachedText"
          :rows="3"
          :placeholder="$t('Translate.from_ph')"
          color="white"
          background-color="transparent"
          auto-grow
          solo flat dark full-width @input="getTranslation"/>
        <v-btn flat dark small @click="showLangs('from')">
          <v-icon v-if="!menu" dark left>arrow_drop_down</v-icon>
          <v-icon v-else dark left>arrow_drop_up</v-icon>
          {{ fromLang }}
        </v-btn>
        <v-btn color="#006CED" dark fab absolute small @click="switchLangs()">
          <v-icon>swap_horiz</v-icon>
        </v-btn>
      </v-flex>
      <v-flex class="right">
        <v-textarea
          ref="translated"
          :value="text"
          :loading="loading"
          :rows="3"
          :placeholder="$t('Translate.to_ph')"
          background-color="transparent"
          readonly auto-grow solo flat full-width @click="copyTranslation()"/>
        <v-btn flat small @click="showLangs('to')">
          <v-icon v-if="!menu" dark left>arrow_drop_down</v-icon>
          <v-icon v-else dark left>arrow_drop_up</v-icon>
          {{ $options.languages[to] }}
        </v-btn>
      </v-flex>
    </v-layout>
    <v-card-text v-show="!!menu" class="languages">
      <v-btn
        v-if="menu === 'from'"
        :flat="'auto' !== from" color="#2787F4" small dark depressed @click="setLang('auto')">
        {{ $t('Translate.auto') }}
      </v-btn>
      <v-btn
        v-for="(val, key) of $options.languages"
        :key="key"
        :flat="key !== (menu === 'to' ? to : from)" color="#2787F4"
        small dark depressed @click="setLang(key)">
        {{ val }}
      </v-btn>
    </v-card-text>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
