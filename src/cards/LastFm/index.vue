<template>
  <div id="lastfm">
    <v-card-text v-if="loading">
      <v-progress-linear indeterminate />
    </v-card-text>
    <template v-else-if="itemsLength">
      <div
        :title="$t('onboarding.previous')"
        class="prev"
        @click.stop="active > 0 ? active -= 1 : active = itemsLength - 1"
      />
      <v-tabs v-model="active" grow hide-slider>
        <v-tab v-for="(item, key) in items" :key="key" />
        <v-tab-item v-for="(item, key) in items" :key="key">
          <v-layout>
            <v-flex xs6 class="cover">
              <v-img
                :src="item.data[0].image.large || $options.fallback"
                :lazy-src="item.data[0].image.small"
              />
              <a :href="item.data[0].url" target="_blank" rel="noopener" class="overlay">
                <h4 class="caption">{{ item.data[0].name }}</h4>
                <span v-if="item.data[0].artist">{{ item.data[0].artist.name }}</span>
                <p>
                  {{
                  $tc('LastFm.plays', item.data[0].playcount, { nb: item.data[0].playcount })
                  }}
                </p>
              </a>
            </v-flex>
            <v-flex xs6>
              <v-layout wrap>
                <v-flex v-for="(node, i) in item.data.slice(1)" :key="i" xs6 class="cover">
                  <v-img :src="node.image.large || $options.fallback" :lazy-src="node.image.small" />
                  <a :href="node.url" target="_blank" rel="noopener" class="overlay">
                    <h4 class="caption">{{ node.name }}</h4>
                    <span v-if="node.artist">{{ node.artist.name }}</span>
                    <p>
                      {{
                      $tc('LastFm.plays', node.playcount, { nb: node.playcount })
                      }}
                    </p>
                  </a>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-tab-item>
      </v-tabs>
      <div
        :title="$t('onboarding.next')"
        class="next"
        @click.stop="active < itemsLength - 1 ? active += 1 : active = 0"
      />
    </template>
    <v-card-text v-else class="text-center">
      <v-icon x-large>mdi-library-music</v-icon>
      <h2 v-if="!user || !user.length" v-t="'LastFm.need_user'" class="subtitle-1" />
      <h2 v-else v-t="'LastFm.empty'" class="subtitle-1" />
    </v-card-text>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
