
<style lang="less">
@import "./less/main.less";
</style>
<template>
    <router-view></router-view>
</template>

<script>
import store from "./vuex/store.js";

export default {
    store: store,
    data() {
        return {};
    },
    created() {},
    methods: {}
};
</script>
