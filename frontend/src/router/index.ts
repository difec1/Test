import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import GoalsPage from '../pages/GoalsPage.vue';
import AnalysisPage from '../pages/AnalysisPage.vue';
import HistoryPage from '../pages/HistoryPage.vue';
import NewTransactionPage from '../pages/NewTransactionPage.vue';
import { useAuthStore } from '../store/auth';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  { path: '/register', component: LoginPage, props: { registerMode: true } },
  { path: '/goals', component: GoalsPage },
  { path: '/analysis', component: AnalysisPage },
  { path: '/history', component: HistoryPage },
  { path: '/transactions/new', component: NewTransactionPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();
  if (!auth.token && to.path !== '/login' && to.path !== '/register') {
    next('/login');
  } else {
    next();
  }
});

export default router;
