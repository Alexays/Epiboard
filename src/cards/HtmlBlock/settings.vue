<template>
  <v-card-text>
    <h4 v-t="'HtmlBlock.settings.cardName'" class="subheading"/>
    <v-text-field
      v-model="settings.cardName"/>
    <h4 v-t="'HtmlBlock.settings.html'" class="subheading"/>
    <v-textarea
      v-model="settings.html"
      :rows="5"
      auto-grow
      box
      />
    <h4 v-t="'HtmlBlock.settings.padding'" class="subheading"/>
    <v-text-field
      v-model="settings.padding"
      type="number"
      :min="0"
      :max="200" />
    <h4 v-t="'HtmlBlock.settings.height'" class="subheading"/>
    <v-checkbox v-model="settings.autoHeight" :label="$t('HtmlBlock.settings.autoHeight')"></v-checkbox>
    <v-text-field
      v-if="!settings.autoHeight"
      v-model="settings.height"
      type="number"
      :min="0"
      :max="1000" />
  </v-card-text>
</template>
<script src="./settings.js"></script>
