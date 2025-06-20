import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ExpensesView from '../views/ExpensesView.vue';
import ReportsView from '../views/ReportsView.vue';
import LoginView from '../views/LoginView.vue';

function isAuthenticated() {
  return !!localStorage.getItem('token');
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
    path: '/expenses',
    name: 'expenses',
    component: ExpensesView,
  },
  {
    path: '/reports',
    name: 'reports',
    component: ReportsView,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.meta.public && !isAuthenticated()) {
    next({ name: 'login' });
  } else if (to.meta.public && isAuthenticated() && to.name === 'login') {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;