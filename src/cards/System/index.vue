<template>
  <div id="system" class="pa-4">
    <div v-if="cpu" class="wrapper">
      <div class="wrapper-name">
        <v-icon v-if="cpu.archName.indexOf('64') > -1">mdi-cpu-64-bit</v-icon>
        <v-icon v-else>mdi-cpu-32-bit</v-icon>
        <span v-t="'System.cpu'" class="caption" />
      </div>
      <div class="wrapper-info">
        {{ cpu.modelName }}
        <p class="caption">
          {{ cpu.archName }} - {{ cpu.numOfProcessors }}
          <span
            v-t="{ path: 'System.core', choice: cpu.numOfProcessors }"
          />
        </p>
        <v-progress-linear
          v-for="(core, key) in cpu.loads"
          :key="key"
          :height="6"
          :value="core.value"
          :title="`${core.value}%`"
          color="accent"
        />
      </div>
    </div>
    <div v-if="memory" class="wrapper">
      <div class="wrapper-name">
        <v-icon>mdi-memory</v-icon>
        <span v-t="'System.memory'" class="caption" />
      </div>
      <div class="wrapper-info">
        {{ memory.load.progress | bytes }} /
        <span class="grey--text">{{ memory.capacity | bytes }}</span>
        <v-progress-linear
          :height="6"
          :value="memory.load.value"
          :title="`${memory.load.value}%`"
          color="accent"
        />
      </div>
    </div>
    <div v-if="connection" class="wrapper">
      <div class="wrapper-name">
        <v-icon>mdi-wan</v-icon>
        <span v-t="'System.network'" class="caption" />
      </div>
      <div class="wrapper-info">
        <v-layout>
          <div :title="$t('System.estimation')" class="mr-3">
            <v-icon small>mdi-download</v-icon>
            <span v-if="connection.downlink === 10">></span>
            {{ connection.downlink }} Mb/s
          </div>
          <div :title="$t('System.rtt')">
            <v-icon small>mdi-autorenew</v-icon>
            {{ connection.rtt }}ms
            <sup class="grey--text">RTT</sup>
          </div>
        </v-layout>
      </div>
    </div>
    <div v-if="storage.length" class="wrapper">
      <div class="wrapper-name">
        <v-icon>mdi-nas</v-icon>
        <span v-t="'System.storage'" class="caption" />
      </div>
      <div class="wrapper-info">
        <div v-for="unit in storage" :key="unit.name" class="storage-unit">
          <v-icon v-if="unit.type === 'removable'" small>mdi-usb</v-icon>
          <span class="disk-name">
            <template v-if="unit.name">{{ unit.name | truncate(25) }}</template>
            <template v-else>{{ unit.capacity | bytes }} Volume</template>
          </span>
          <template v-if="unit.used">
            <span class="disk-capacity">
              {{ unit.used | bytes }} /
              <span class="grey--text">{{ unit.capacity | bytes }}</span>
            </span>
            <v-progress-linear :height="6" :value="unit.percent" color="accent" />
          </template>
          <span v-else class="disk-capacity">{{ unit.capacity | bytes }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
