<template>
  <v-content id="onboarding">
    <v-container fluid>
      <v-layout align-center>
        <transition name="slide-fade-transition" mode="out-in">
          <component :is="$options.board[index]" @next="next" @prev="prev"/>
        </transition>
      </v-layout>
    </v-container>
  </v-content>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
