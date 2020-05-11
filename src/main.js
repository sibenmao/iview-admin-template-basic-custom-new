import Vue from 'vue';
import App from './App.vue';
import router from './router';
import config from '@/config';
import store from './store';
import iView from 'view-design';
import i18n from '@/locale';
import 'view-design/dist/styles/iview.css';
// import './index.scss';
Vue.config.productionTip = false;

Vue.use(iView, {
    i18n: (key, value) => i18n.t(key, value),
});

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;

new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App),
}).$mount('#app');
