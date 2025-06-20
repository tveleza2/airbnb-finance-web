import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ExpensesView from '../views/ExpensesView.vue';
import ReportsView from '../views/ReportsView.vue';

const routes = [
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

export default router;