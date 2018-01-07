<template>
<div class="blue-grey">
    <div class="card-header white-text">
      <span class="card-title">System</span>
    </div>
    <div class="card-content white">
        <div class="wrapper cpu">
                <div class="wrapper-name">
                    <i class="material-icons">nfc</i>
                    <div>CPU</div>
                </div>
                <div class="wrapper-info">
                    <p>{{cpu.modelName}}</p>
                    <p>{{cpu.archName}} - {{cpu.numOfProcessors}} core{{cpu.numOfProcessors > 1 ? 's':''}}</p>
                </div>
            </div>
    </div>
</div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
