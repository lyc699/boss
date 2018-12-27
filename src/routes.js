/**
 * router.js-真实路由
 * routesAll.js-全量路由
 * 
 * author zxl
 * 2018-08-09
 */

const routes = [
    {
        path: '/',
        name: 'index',
        redirect: '/login',
        meta: {
            title: '登录',
            hidden:true,
        }
    },
    {
        path: '/login',
        name: 'login',
        component: resolve => require.ensure([], () => resolve(require('./components/login/login.vue')), "roleMain"),
        meta: {
            title: '登录',
            hidden:true,
        }
    }
]
export default routes
