
<style lang="less">
.fade-enter-active,
.fade-leave-active {
    transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
    opacity: 0;
}
</style>
<template>
    <section>
        <app-header></app-header>
        <section id="container">
            <app-menu></app-menu>
            <main id="main">
                <breadcrumb></breadcrumb>
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </main>
        </section>
    </section>
</template>

<script>
import appHeader from './common/Header'
import appMenu from './common/Menu'
import Breadcrumb from './common/Breadcrumb'

export default {
    components:{
        appHeader,
        appMenu,
        Breadcrumb
    },
    data() {
        return {};
    },
    created() {
    },
    methods: {}
};
</script>
