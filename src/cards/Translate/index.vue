<template>
  <div id="translate">
    <v-layout>
      <v-flex class="left" xs5>
        <v-textarea
          @input="getTranslation"
          v-model="cachedText"
          :rows="3"
          :placeholder="$t('Translate.from_ph')"
          color="white"
          background-color="transparent"
          auto-grow solo flat dark full-width></v-textarea>
        <v-btn @click="showLangs('from')" flat dark small>
          <v-icon v-if="!menu" dark left>arrow_drop_down</v-icon>
          <v-icon v-else dark left>arrow_drop_up</v-icon>
          {{ fromLang }}
        </v-btn>
        <v-btn @click="switchLangs()" color="#006CED" dark fab absolute small>
          <v-icon>swap_horiz</v-icon>
        </v-btn>
      </v-flex>
      <v-flex class="right">
        <v-textarea
          @click="copyTranslation()"
          :value="text"
          :loading="loading"
          :rows="3"
          :placeholder="$t('Translate.to_ph')"
          ref="translated"
          background-color="transparent" readonly auto-grow solo flat light full-width></v-textarea>
        <v-btn @click="showLangs('to')" flat light small>
          <v-icon v-if="!menu" dark left>arrow_drop_down</v-icon>
          <v-icon v-else dark left>arrow_drop_up</v-icon>
          {{ $options.languages[to] }}
        </v-btn>
      </v-flex>
    </v-layout>
    <v-card-text v-show="!!menu" class="languages">
      <v-btn
        v-if="menu === 'from'"
        :flat="'auto' !== from" @click="setLang('auto')" color="#2787F4" small dark depressed>
        {{ $t('Translate.auto') }}
      </v-btn>
      <v-btn
        v-for="(val, key) of $options.languages"
        :key="key"
        :flat="key !== (menu === 'to' ? to : from)" @click="setLang(key)"
        color="#2787F4" small dark depressed>
        {{ val }}
      </v-btn>
    </v-card-text>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
