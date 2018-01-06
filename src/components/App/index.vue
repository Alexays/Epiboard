<template>
    <div id="container">
        <div id="card-container">
            <div v-for="card in cards" :key="card.id" class="card">
                <div class="card-content">
                    {{card.id}}
                </div>
            </div>
        </div>
    </div>
</template>
<script src="./main.js"></script>
<style lang="sass" src="./style.scss" scoped></style>
