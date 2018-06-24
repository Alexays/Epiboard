<template>
  <v-card-text id="system">
    <div v-if="cpu" class="wrapper">
      <div class="wrapper-name">
        <i class="material-icons">nfc</i>
        <div>CPU</div>
      </div>
      <div class="wrapper-info">
        <span>{{cpu.modelName}}</span>
        <p>{{cpu.archName}} - {{cpu.numOfProcessors}} core{{cpu.numOfProcessors > 1 ? 's':''}}</p>
        <v-progress-linear height="6" v-for="(core, key) in cpu.processors" :key="key" :value="coresLoad[key]"></v-progress-linear>
      </div>
    </div>
    <div v-if="memory" class="wrapper">
      <div class="wrapper-name">
        <i class="material-icons">memory</i>
        <div>Memory</div>
      </div>
      <div class="wrapper-info">
        <span>{{memory.capacity - memory.availableCapacity | bytes}} / <span class="grey--text">{{memory.capacity | bytes}}</span></span>
        <v-progress-linear height="6" :value="memoryLoad"></v-progress-linear>
      </div>
    </div>
    <div v-if="storage.length" class="wrapper">
      <div class="wrapper-name">
        <i class="material-icons">storage</i>
        <div>Storage</div>
      </div>
      <div class="wrapper-info">
        <li class="storage-unit" v-for="unit in storage" :key="unit.name">
          <i v-if="unit.type == 'removable'" class="material-icons md-18">usb</i>
          <span v-if="unit.name && developper" class="disk-name" :title="unit.name">
            {{ unit.name | truncate(25) }}
          </span>
          <span v-if="!unit.name && developper" class="disk-name">{{unit.capacity | bytes}} Volume</span>
          <span v-if="developper" class="disk-capacity">{{unit.used | bytes}} / <span class="grey--text">{{unit.capacity | bytes}}</span></span>
          <v-progress-linear height="6" v-if="developper" :value="unit.percent"></v-progress-linear>
          <span v-if="unit.name && !developper" class="disk-name" :title="unit.name">
            {{ unit.name | truncate(25) }}
          </span>
          <span v-if="!unit.name && !developper" class="disk-name">{{unit.capacity | bytes}} Volume</span>
          <span v-if="!developper" class="disk-capacity">{{unit.capacity | bytes}}</span>
        </li>
      </div>
    </div>
  </v-card-text>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
