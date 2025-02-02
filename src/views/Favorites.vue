<template>
    <v-container fluid>
        <template v-if="isLoggedIn && favorites.length > 0">
            <LoadingOverlay :isLoading="isLoading" :showError="hasError" />
            <div v-show="!isLoading && !hasError">
                <div class="d-flex justify-space-between px-0 pb-3 pt-1 px-sm-3">
                    <div class="text-h6">
                        {{ $t("views.home.liveOrUpcomingHeading") }}
                    </div>
                    <v-btn icon @click="currentGridSize = (currentGridSize + 1) % 3" v-if="!$store.state.isMobile">
                        <v-icon>{{ $store.getters.gridIcon }}</v-icon>
                    </v-btn>
                </div>
                <VideoCardList
                    :videos="sortedLive"
                    includeChannel
                    includeAvatar
                    :limitRows="2"
                    :cols="colSizes"
                    :dense="currentGridSize > 0"
                >
                </VideoCardList>
                <v-divider class="my-3" />
                <div class="d-flex justify-space-between px-0 pb-3 pt-1 px-sm-3">
                    <div class="text-h6">
                        {{ $t("views.home.recentVideosHeading") }}
                    </div>
                    <v-btn-toggle v-model="recentVideoFilter" mandatory dense>
                        <v-btn value="all">
                            {{ $t("views.home.recentVideoToggles.all") }}
                        </v-btn>
                        <v-btn value="stream">
                            {{ $t("views.home.recentVideoToggles.official") }}
                        </v-btn>
                        <v-btn value="clip">
                            {{ $t("views.home.recentVideoToggles.subber") }}
                        </v-btn>
                    </v-btn-toggle>
                </div>
                <VideoCardList
                    :videos="videos"
                    includeChannel
                    :cols="colSizes"
                    :dense="currentGridSize > 0"
                    :lazy="scrollMode"
                    :identifier="identifier"
                    :paginateLoad="!scrollMode"
                    :infiniteLoad="scrollMode"
                    @load="loadNext"
                    pageLess
                ></VideoCardList>
            </div>
        </template>
        <template v-else>
            <v-row style="min-height: 50%">
                <v-col class="d-flex align-center justify-center flex-column">
                    <v-icon color="primary" large>{{ icons.mdiHeart }}</v-icon>
                    <div class="text-body-1 text-center" v-html="$t('views.favorites.promptForAction')"></div>
                    <v-btn :to="isLoggedIn ? '/channel' : '/login'">
                        {{ isLoggedIn ? $t("views.favorites.manageFavorites") : $t("component.mainNav.login") }}
                    </v-btn>
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>

<script lang="ts">
import VideoCardList from "@/components/video/VideoCardList.vue";
import LoadingOverlay from "@/components/common/LoadingOverlay.vue";
// eslint-disable-next-line no-unused-vars
import * as icons from "@/utils/icons";
import { mapState } from "vuex";
import reloadable from "@/mixins/reloadable";

export default {
    name: "Favorites",
    mixins: [reloadable],
    metaInfo() {
        const vm = this;
        return {
            get title() {
                return `${vm.$t("component.mainNav.favorites")} - Holodex`;
            },
        };
    },
    components: {
        VideoCardList,
        LoadingOverlay,
    },
    data() {
        return {
            icons,
            identifier: +new Date(),
            pageLength: 24,
        };
    },
    mounted() {
        this.init();
    },
    watch: {
        recentVideoFilter() {
            this.resetVideos();
        },
        favorites() {
            this.init();
        },
    },
    computed: {
        ...mapState("favorites", ["favorites", "live", "videos", "isLoading", "hasError", "currentOffset"]),
        recentVideoFilter: {
            get() {
                return this.$store.state.favorites.recentVideoFilter;
            },
            set(value) {
                this.$store.commit("favorites/setRecentVideoFilter", value);
            },
        },
        isLoggedIn() {
            return this.$store.getters.isLoggedIn;
        },
        scrollMode() {
            return this.$store.state.settings.scrollMode;
        },
        currentGridSize: {
            get() {
                return this.$store.state.currentGridSize;
            },
            set(val) {
                this.$store.commit("setCurrentGridSize", val);
            },
        },
        colSizes() {
            return {
                xs: 1,
                sm: 2,
                md: 3 + this.currentGridSize,
                lg: 4 + this.currentGridSize,
                xl: 5 + this.currentGridSize,
            };
        },
        sortedLive() {
            return this.live.sort((a, b) => {
                const dateA = new Date(a.available_at).getTime();
                const dateB = new Date(b.available_at).getTime();
                return dateA > dateB ? 1 : -1;
            });
        },
    },
    methods: {
        init() {
            if (this.favorites.length > 0 && this.isLoggedIn) {
                this.$store.commit("favorites/resetState");
                this.$store.dispatch("favorites/fetchLive", { minutes: 2 });
                this.resetVideos();
            }
        },
        reload() {
            this.init();
        },
        resetVideos() {
            this.$store.commit("favorites/resetVideos");
            this.identifier = +new Date();
        },
        loadNext($state) {
            const lastLength = this.videos.length;
            if (!this.scrollMode) this.$store.commit("favorites/resetVideos");
            this.$store
                .dispatch("favorites/fetchNextVideos", {
                    limit: this.pageLength,
                    ...(!this.scrollMode && { offset: this.pageLength * ($state.page - 1) }),
                })
                .then(() => {
                    if (
                        (this.scrollMode && this.videos.length === lastLength) ||
                        (!this.scrollMode && this.videos.length !== this.pageLength)
                    ) {
                        $state.completed();
                        return;
                    }
                    $state.loaded();
                })
                .catch((e) => {
                    console.error(e);
                    $state.error();
                });
        },
    },
};
</script>
