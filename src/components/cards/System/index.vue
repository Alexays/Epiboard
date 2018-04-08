<template>
  <div id="system" class="padding">
    <div class="wrapper">
      <div class="wrapper-name">
        <i class="material-icons">nfc</i>
        <div>CPU</div>
      </div>
      <div class="wrapper-info">
        <span>{{cpu.modelName}}</span>
        <p>{{cpu.archName}} - {{cpu.numOfProcessors}} core{{cpu.numOfProcessors > 1 ? 's':''}}</p>
        <v-progress-linear height="6" v-for="(core, key) in cpu.processors" :key="key" :value="getLoad({
                        progress: core.usage.kernel + core.usage.user,
                        total: core.usage.total
                    }, (cpu.prev || {}).processors ? {
                        progress: cpu.prev.processors[key].usage.kernel + cpu.prev.processors[key].usage.user,
                        total: cpu.prev.processors[key].usage.total
                    } : null)"></v-progress-linear>
      </div>
    </div>
    <div v-if="memory" class="wrapper">
      <div class="wrapper-name">
        <i class="material-icons">memory</i>
        <div>Memory</div>
      </div>
      <div class="wrapper-info">
        <span>{{memory.capacity - memory.availableCapacity | bytes}} / <span class="grey--text">{{memory.capacity | bytes}}</span></span>
        <v-progress-linear height="6" :value="getLoad({
                            progress: memory.capacity - memory.availableCapacity,
                            total: memory.capacity
                        }, (memory.prev || {}).capacity ? {
                            progress: memory.prev.capacity - memory.prev.availableCapacity,
                            total: memory.prev.capacity
                        } : null)"></v-progress-linear>
      </div>
    </div>
    <div v-if="storage" class="wrapper">
      <div class="wrapper-name">
        <i class="material-icons">storage</i>
        <div>Storage</div>
      </div>
      <div class="wrapper-info">
        <li class="storage-unit" v-for="unit in storage" :key="unit">
          <i v-if="unit.type == 'removable'" class="material-icons md-18">usb</i>
          <span v-if="unit.name && storage.dev" class="disk-name" :title="unit.name">
            {{ unit.name | truncate(25) }}
          </span>
          <span v-if="!unit.name && storage.dev" class="disk-name">{{unit.capacity | bytes}} Volume</span>
          <span v-if="storage.dev" class="disk-capacity">{{unit.used | bytes}} / <span class="grey--text">{{unit.capacity | bytes}}</span></span>
          <v-progress-linear height="6" v-if="storage.dev" :value="unit.percent"></v-progress-linear>
          <span v-if="unit.name && !storage.dev" class="disk-name" :title="unit.name">
            {{ unit.name | truncate(25) }}
          </span>
          <span v-if="!unit.name && !storage.dev" class="disk-name">{{unit.capacity | bytes}} Volume</span>
          <span v-if="!storage.dev" class="disk-capacity">{{unit.capacity | bytes}}</span>
        </li>
      </div>
    </div>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
