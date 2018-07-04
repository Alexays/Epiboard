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
          <span>{{ cpu.archName }} - {{ cpu.numOfProcessors }} core</span>
          {{ cpu.numOfProcessors > 1 ? 's' : '' }}
        </p>
        <v-progress-linear
          v-for="(core, key) in cpu.processors" :key="key"
          :height="6" :value="coresLoad[key]" color="accent"/>
      </div>
    </div>
    <div v-if="memory" class="wrapper">
      <div class="wrapper-name">
        <v-icon>memory</v-icon>
        <div>Memory</div>
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
        <div>Network</div>
      </div>
      <div class="wrapper-info">
        <v-layout>
          <v-flex xs3>
            <v-icon title="Downlink estimation" small>cloud_download</v-icon>
            <span title="Downlink estimation" >{{ connection.downlink }} Mb/s</span>
          </v-flex>
          <v-flex xs3>
            <v-icon title="Round-trip time estimation" small>swap_calls</v-icon>
            <span title="Round-trip time estimation">{{ connection.rtt }}ms</span>
            <sup class="grey--text">RTT</sup>
          </v-flex>
        </v-layout>
      </div>
    </div>
    <div v-if="storage.length" class="wrapper">
      <div class="wrapper-name">
        <v-icon>storage</v-icon>
        <div>Storage</div>
      </div>
      <div class="wrapper-info">
        <li v-for="unit in storage" :key="unit.name" class="storage-unit">
          <v-icon v-if="unit.type == 'removable'" small>usb</v-icon>
          <span v-if="unit.name && developper" :title="unit.name" class="disk-name">
            {{ unit.name | truncate(25) }}
          </span>
          <span v-if="!unit.name && developper" class="disk-name">
            {{ unit.capacity | bytes }} Volume
          </span>
          <span v-if="developper" class="disk-capacity">
            {{ unit.used | bytes }} / <span class="grey--text">{{ unit.capacity | bytes }}</span>
          </span>
          <v-progress-linear v-if="developper" :height="6" :value="unit.percent" color="accent"/>
          <span v-if="unit.name && !developper" :title="unit.name" class="disk-name">
            {{ unit.name | truncate(25) }}
          </span>
          <span v-if="!unit.name && !developper" class="disk-name">
            {{ unit.capacity | bytes }} Volume
          </span>
          <span v-if="!developper" class="disk-capacity">{{ unit.capacity | bytes }}</span>
        </li>
      </div>
    </div>
  </v-card-text>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
