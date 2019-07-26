<template>
  <div id="tasks">
    <v-list v-if="$gauth_isConnected && tasks.length">
      <v-list-tile v-for="(task, idx) in tasks" :key="task.id">
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
            <v-icon color="grey">mdi-delete</v-icon>
          </v-btn>
          <v-btn v-else-if="editMode.indexOf(task.id) > -1" icon ripple @click="editTask(task)">
            <v-icon>mid-check</v-icon>
          </v-btn>
          <v-btn v-else icon ripple @click="editMode.push(task.id)">
            <v-icon color="grey">mdi-pencil</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-card-text v-else class="text-center">
      <template v-if="!$gauth_isConnected">
        <h2 v-t="'Tasks.need_login'" class="subtitle-1"/>
        <v-btn color="blue" class="white--text" @click="init()">
          <v-icon right dark>mdi-lock-open</v-icon>
          <span v-t="{ path: 'auth.connect_to', args: { service: 'Google' } }"/>
        </v-btn>
      </template>
      <template v-else>
        <v-icon x-large>mid-clipboard-check</v-icon>
        <h2 v-t="'Tasks.empty'" class="subtitle-1"/>
      </template>
    </v-card-text>
    <v-text-field
      v-if="$gauth_isConnected"
      v-model="newTask"
      :disabled="loading"
      :placeholder="$t('Tasks.add')" hide-details class="pa-4" @keyup.13="addTask()"/>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
