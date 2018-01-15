<template>
<div class="blue-grey">
    <v-card-title class="white--text">
      <span class="headline">System</span>
    </v-card-title>
    <v-card-text class="white">
        <div class="wrapper">
                <div class="wrapper-name">
                    <i class="material-icons">nfc</i>
                    <div>CPU</div>
                </div>
                <div class="wrapper-info">
                    <p>{{cpu.modelName}}</p>
                    <p>{{cpu.archName}} - {{cpu.numOfProcessors}} core{{cpu.numOfProcessors > 1 ? 's':''}}</p>
                    <v-progress-linear v-for="(core, key) in cpu.processors" :key="key"
                    :value="getCpuLoad(core.usage, key)"></v-progress-linear>
                </div>
            </div>
          <div class="wrapper">
                <div class="wrapper-name">
                    <i class="material-icons">memory</i>
                    <div>Memory</div>
                </div>
                <div class="wrapper-info">
                    <p>{{memory.availableCapacity | bytes}} available of {{memory.capacity | bytes}}</p>
                    <v-progress-linear
                        :value="((memory.capacity - memory.availableCapacity) / memory.capacity) * 100 "></v-progress-linear>
                </div>
            </div>
            <div class="wrapper">
                <div class="wrapper-name">
                    <i class="material-icons">storage</i>
                    <div>Storage</div>
                </div>
                <div class="wrapper-info">
                    <li class="storage-unit" v-for="unit in storage" :key="unit">
                        <i v-if="unit.type == 'removable'" class="material-icons">usb</i>
                        <span v-if="unit.name && storage.dev" class="disk-name" :title="unit.name">
                          {{ unit.name | truncate(25) }}
                        </span>
                        <span v-if="!unit.name && storage.dev" class="disk-name">{{unit.capacity | bytes}} Volume</span>
                        <span v-if="storage.dev" class="disk-capacity">{{unit.used | bytes}}/{{unit.capacity | bytes}}</span>
                        <v-progress-linear v-if="storage.dev"
                        :value="unit.percent"></v-progress-linear>
                        <span v-if="unit.name && !storage.dev" class="disk-name" :title="unit.name">
                            {{ unit.name | truncate(25) }}
                        </span>
                        <span v-if="!unit.name && !storage.dev" class="disk-name">{{unit.capacity | bytes}} Volume</span>
                        <span v-if="!storage.dev" class="disk-capacity">{{unit.capacity | bytes}}</span>
                    </li>
                </div>
            </div>
    </v-card-text>
</div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
