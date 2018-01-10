<template>
<div class="blue-grey">
    <div class="card-header white-text">
      <span class="card-title">System</span>
    </div>
    <div class="card-content white">
        <div class="wrapper">
                <div class="wrapper-name">
                    <i class="material-icons">nfc</i>
                    <div>CPU</div>
                </div>
                <div class="wrapper-info">
                    <p>{{cpu.modelName}}</p>
                    <p>{{cpu.archName}} - {{cpu.numOfProcessors}} core{{cpu.numOfProcessors > 1 ? 's':''}}</p>
                    <div v-for="(core, key) in cpu.processors" :key="key" class="progress">
                        <div class="determinate"
                        :style="{'width': getCpuLoad(key) + '%'}"></div>
                    </div>
                </div>
            </div>
          <div class="wrapper">
                <div class="wrapper-name">
                    <i class="material-icons">memory</i>
                    <div>Memory</div>
                </div>
                <div class="wrapper-info">
                    <p>{{memory.availableCapacity | bytes}} available of {{memory.capacity | bytes}}</p>
                    <div class="progress">
                        <div class="determinate"
                        :style="{'width': ((memory.capacity - memory.availableCapacity) / memory.capacity) * 100 + '%'}"></div>
                    </div>
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
                        <p v-if="unit.name && storage.dev" class="disk-name" :title="unit.name">
                          {{ unit.name | truncate(25) }}
                        </p>
                        <p v-if="!unit.name && storage.dev" class="disk-name ">{{unit.capacity | bytes}} Volume</p>
                        <p v-if="storage.dev" class="disk-capacity ">{{unit.used | bytes}}/{{unit.capacity | bytes}}</p>
                        <div v-if="storage.dev" class="progress">
                          <div class="determinate" :style="{'width': unit.percent + '%'}"></div>
                        </div>
                        <p v-if="unit.name && !storage.dev" class="disk-name" :title="unit.name">
                            {{ unit.name | truncate(25) }}
                        </p>
                        <p v-if="!unit.name && !storage.dev" class="disk-name ">{{unit.capacity | bytes}} Volume</p>
                        <p v-if="!storage.dev" class="disk-capacity ">{{unit.capacity | bytes}}</p>
                    </li>
                </div>
            </div>
    </div>
</div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
