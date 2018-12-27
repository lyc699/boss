<style lang="less">
</style>

<template>
    <aside id="menu">
        <el-row>
            <el-col :span="24">
                <el-menu :default-active="defaultActive" @open="handleOpen" @close="handleClose" @select="handleSelect" unique-opened router>
                    <template v-for="(item,index1) in routes" v-if="!item.meta.hidden">
                        <el-submenu :index="index1+''" :key="index1">
                            <template slot="title"><i :class="item.meta.iconClass"></i><label class="middle">{{item.meta.title}}</label></template>
                            <el-menu-item-group v-for="(child,index2) in item.children" :key="index2" v-if="!child.meta.hidden">
                                <el-menu-item :index="child.path" :key="child.path" v-if="child.path != 'keep'">
                                    {{child.meta.title}}
                                </el-menu-item>
                                <el-submenu :index="`${index1}-${index2}`" v-else>
                                    <template slot="title">{{child.meta.title}}</template>
                                    <el-menu-item v-for="(three, index3) in child.children" :index="three.path" :key="`${index1}-${index2}-${index3}`" v-if="!three.meta.hidden">{{three.meta.title}}</el-menu-item>
                                </el-submenu>
                            </el-menu-item-group>
                        </el-submenu>
                    </template>
                </el-menu>
            </el-col>
        </el-row>
    </aside>
</template>

<script>
import routes from '../../routesAll.js'
export default {
    data() {
        return {
            routes,
            defaultActive:''
        };
    },
    watch:{
        $route(){
            this.setPath()
        }
    },
    mounted() {
        this.setPath()
    },
    methods: {
        setPath(){
            let path = this.$route.path.split('/')[1]
            
            this.defaultActive = `/${path}`            
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        }
    }
};
</script>