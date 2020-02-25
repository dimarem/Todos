import "./index.scss";
import "./polyfills/polyfills.js";
import Vue    from "vue/dist/vue.min.js";
import store  from "./vuex/vuex.js";
import router from "./router/router.js";

/**
 * Создадим экземпляр Vue.
 */
new Vue({
    el: "#app-container",
    store,
    router
})
