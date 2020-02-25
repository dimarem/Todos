import Vue         from "vue/dist/vue.min.js";
import VueRouter   from "vue-router/dist/vue-router.min.js";
import TheMainPage from "../components/TheMainPage.vue";
import TheEditPage from "../components/TheEditPage.vue";
import The404Page  from "../components/The404Page.vue";

/**
 * Подключим vue-роутер и настроим маршруты.
 */
Vue.use(VueRouter);

const routes = [
    { 
        path: "/", 
        component: TheMainPage,
    },
    { 
        path: "/edit/:index", 
        component: TheEditPage,
    },
    {
        path: "*",
        component: The404Page
    }
]

const router = new VueRouter({routes});

export default router;
