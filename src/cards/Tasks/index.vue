<template>
  <div id="tasks">
    <v-list v-if="tasks.length">
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
      <v-icon x-large>assignment</v-icon>
      <h2 class="subheading">No tasks</h2>
    </v-card-text>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
