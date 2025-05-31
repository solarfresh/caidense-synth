import { createRouter, createWebHistory } from 'vue-router';
import RepositoryOverview from '@/components/views/repositories/RepositoryOverview.vue'
import CreateRepository from '@/components/views/repositories/CreateRepository.vue';


const routes = [
  {
    path: '/',
    name: 'RepositoryOverview',
    component: RepositoryOverview,
  },
  {
    path: '/repositories/create',
    name: 'CreateRepository',
    component: CreateRepository
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;