import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import InvoicesView from '../views/InvoicesView.vue';
import ReportsView from '../views/ReportsView.vue';
import LoginView from '../views/LoginView.vue';
import { isAuthenticated as sessionIsAuthenticated } from '../services/session';
function isAuthenticated() {
    return sessionIsAuthenticated();
}
const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { public: true }
    },
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/invoices',
        name: 'invoices',
        component: InvoicesView,
    },
    {
        path: '/reports',
        name: 'reports',
        component: ReportsView,
    },
    {
        path: '/expenses',
        redirect: '/invoices'
    }
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});
router.beforeEach((to, from, next) => {
    if (!to.meta.public && !isAuthenticated()) {
        next({ name: 'login' });
    }
    else if (to.meta.public && isAuthenticated() && to.name === 'login') {
        next({ name: 'home' });
    }
    else {
        next();
    }
});
export default router;
