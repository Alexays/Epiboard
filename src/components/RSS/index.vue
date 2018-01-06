<template>
    <div class="rss">
        <template v-if="feed">
            <h3 :style="{ backgroundColor: headerBgColor }">{{ feed.title }}</h3>
            <ul>
                <li v-for="item in feed.items"><a :href="item.link" target="_blank">{{ item.title }}</a></li>
            </ul>
        </template>
    </div>
</template>
<script src="./main.js"></script>
<style lang="sass" src="./style.scss" scoped></style>
