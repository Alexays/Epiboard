<template>
  <div id="tasks">
    <v-list v-if="connected && tasks.length">
      <v-list-tile v-for="(task, idx) in tasks" :key="task.id" avatar>
        <v-list-tile-action>
          <v-checkbox
            v-model="task.status"
            true-value="completed" false-value="needsAction" @change="onStatus(task)"/>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-text-field
            v-if="editMode.indexOf(task.id) > -1"
            v-model="task.title" hide-details @keyup.13="editTask(task)"/>
          <v-list-tile-title v-else-if="task.status === 'completed'">
            <strike>{{ task.title }}</strike>
          </v-list-tile-title>
          <v-list-tile-title v-else>{{ task.title }}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn v-if="task.status === 'completed'" icon ripple @click="delTask(task, idx)">
            <v-icon color="grey">delete</v-icon>
          </v-btn>
          <v-btn v-else-if="editMode.indexOf(task.id) > -1" icon ripple @click="editTask(task)">
            <v-icon>check</v-icon>
          </v-btn>
          <v-btn v-else icon ripple @click="editMode.push(task.id)">
            <v-icon color="grey">edit</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-card-text v-else class="text-xs-center">
      <template v-if="!connected">
        <v-btn color="blue" class="white--text" @click="init()">
          <v-icon right dark>lock_open</v-icon>
          <span v-t="{ path: 'auth.connect_to', args: { service: 'Google' } }"/>
        </v-btn>
      </template>
      <template v-else>
        <v-icon x-large>assignment</v-icon>
        <h2 v-t="'Tasks.empty'" class="subheading"/>
      </template>
    </v-card-text>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
