<template>
  <v-card-text id="system">
    <div v-if="cpu" class="wrapper">
      <div class="wrapper-name">
        <v-icon>nfc</v-icon>
        <div>CPU</div>
      </div>
      <div class="wrapper-info">
        <span>{{ cpu.modelName }}</span>
        <p>
          {{ cpu.archName }} -
          {{ cpu.numOfProcessors }} {{ $tc('System.core', cpu.numOfProcessors) }}
        </p>
        <v-progress-linear
          v-for="(core, key) in cpu.processors" :key="key"
          :height="6" :value="coresLoad[key]" color="accent"/>
      </div>
    </div>
    <div v-if="memory" class="wrapper">
      <div class="wrapper-name">
        <v-icon>memory</v-icon>
        <div>{{ $t('System.memory') }}</div>
      </div>
      <div class="wrapper-info">
        <span>
          {{ memory.capacity - memory.availableCapacity | bytes }} /
          <span class="grey--text">{{ memory.capacity | bytes }}</span>
        </span>
        <v-progress-linear :height="6" :value="memoryLoad" color="accent"/>
      </div>
    </div>
    <div v-if="connection" class="wrapper">
      <div class="wrapper-name">
        <v-icon>network_cell</v-icon>
        <div>{{ $t('System.network') }}</div>
      </div>
      <div class="wrapper-info">
        <v-layout>
          <v-flex xs3>
            <span :title="$t('System.estimation')">
              <v-icon class="pr-1" small>cloud_download</v-icon>
              <span v-if="connection.downlink === 10">></span>
              {{ connection.downlink }} Mb/s
            </span>
          </v-flex>
          <v-flex xs3>
            <span :title="$t('System.rtt')">
              <v-icon small>swap_calls</v-icon>{{ connection.rtt }}ms
            </span>
            <sup class="grey--text">RTT</sup>
          </v-flex>
        </v-layout>
      </div>
    </div>
    <div v-if="storage.length" class="wrapper">
      <div class="wrapper-name">
        <v-icon>storage</v-icon>
        <div>{{ $t('System.storage') }}</div>
      </div>
      <div class="wrapper-info">
        <li v-for="unit in storage" :key="unit.name" class="storage-unit">
          <v-icon v-if="unit.type === 'removable'" small>usb</v-icon>
          <span class="disk-name">
            <template v-if="unit.name">{{ unit.name | truncate(25) }}</template>
            <template v-else>{{ unit.capacity | bytes }} Volume</template>
          </span>
          <template v-if="developper">
            <span class="disk-capacity">
              {{ unit.used | bytes }} / <span class="grey--text">{{ unit.capacity | bytes }}</span>
            </span>
            <v-progress-linear :height="6" :value="unit.percent" color="accent"/>
          </template>
          <span v-else class="disk-capacity">{{ unit.capacity | bytes }}</span>
        </li>
      </div>
    </div>
  </v-card-text>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
