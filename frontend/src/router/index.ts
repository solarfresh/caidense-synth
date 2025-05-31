import { createRouter, createWebHistory } from 'vue-router';
import RepositoryOverview from '@/components/views/repositories/RepositoryOverview.vue'


const routes = [
  {
    path: '/',
    name: 'RepositoryOverview',
    component: RepositoryOverview,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;