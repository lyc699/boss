import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        breadList: [],
    },
    //private 不公开
    mutations: {
        setBreadList(state, amount) {
            state.breadList = amount
        },
    },
    //获取
    getters: {
        getBreadList: (state) => {
            return state.breadList
        },
    }
});