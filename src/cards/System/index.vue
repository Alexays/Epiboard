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
          :height="6" :value="coresLoad[key]"/>
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
        <v-progress-linear :height="6" :value="memoryLoad"/>
      </div>
    </div>
    <div v-if="storage.length" class="wrapper">
      <div class="wrapper-name">
        <v-icon>storage</v-icon>
        <div>Storage</div>
      </div>
      <div class="wrapper-info">
        <li v-for="unit in storage" :key="unit.name" class="storage-unit">
          <v-icon v-if="unit.type == 'removable'">usb</v-icon>
          <span v-if="unit.name && developper" :title="unit.name" class="disk-name">
            {{ unit.name | truncate(25) }}
          </span>
          <span v-if="!unit.name && developper" class="disk-name">
            {{ unit.capacity | bytes }} Volume
          </span>
          <span v-if="developper" class="disk-capacity">
            {{ unit.used | bytes }} / <span class="grey--text">{{ unit.capacity | bytes }}</span>
          </span>
          <v-progress-linear v-if="developper" :height="6" :value="unit.percent"/>
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
