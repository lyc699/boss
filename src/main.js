import Vue from 'vue';
import VueRouter from 'vue-router';
import vueStore from './vuex/store.js';
import routes from './routes.js';
import routesAll from './routesAll.js';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import ElementUI from 'element-ui';
import './assets/js/interceptors';
import {filterRouter} from './assets/js/utils'
import './assets/js/global'

Vue.use(ElementUI);
Vue.use(VueRouter);


//事件通信
window.Bus = new Vue()

const router = new VueRouter({
    routes
})

let menuTree = localStorage.getItem('menuTree')
if(menuTree && window.location.href.indexOf('login') == -1){
    let localTree = JSON.parse(menuTree)
    router.addRoutes(filterRouter(routesAll,localTree))
}


router.beforeEach((to, from, next) => {
    let type = to.meta.type;
    let title = to.meta.title;

    //设置title
    document.title = title

    
    //保存面包屑
    vueStore.commit('setBreadList', to.matched);

    
    next()
})


const app = new Vue({
    router: router,
    render: h => h(App)
}).$mount("#app")