<template>
  <div id="tasks">
    <v-list v-if="connected && tasks.length">
      <v-list-tile v-for="task in tasks" :key="task.id" avatar>
        <v-list-tile-action>
          <v-checkbox v-model="task.status" value="completed"/>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-if="task.status === 'completed'">
            <strike>{{ task.title }}</strike>
          </v-list-tile-title>
          <v-list-tile-title v-else>{{ task.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-card-text v-else class="text-xs-center">
      <template v-if="!connected">
        <v-btn color="blue" class="white--text" @click="init()">
          <v-icon right dark>lock_open</v-icon>
          {{ $t('auth.connect_to', { service: 'Google'} ) }}
        </v-btn>
      </template>
      <template v-else>
        <v-icon x-large>assignment</v-icon>
        <h2 class="subheading">{{ $t('Tasks.empty') }}</h2>
      </template>
    </v-card-text>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
