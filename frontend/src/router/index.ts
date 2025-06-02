import CreateRepository from '@/components/views/repositories/CreateRepository.vue';
import EditRepository from '@/components/views/repositories/EditRepository.vue';
import RepositoryOverview from '@/components/views/repositories/RepositoryOverview.vue';
import RepositoryDetails from '@/components/views/repositories/RepositoryDetails.vue';
import { createRouter, createWebHistory } from 'vue-router';


const routes = [
  {
    path: '/',
    name: 'RepositoryOverview',
    component: RepositoryOverview,
  },
  {
    path: '/repositories',
    name: 'RepositoryOverview',
    component: RepositoryOverview,
  },
  {
    path: '/repositories/create',
    name: 'CreateRepository',
    component: CreateRepository
  },
  {
    path: '/repositories/:id',
    name: 'RepositoryDetails',
    component: RepositoryDetails,
    props: true,
  },
  {
    path: '/repositories/:id/edit',
    name: 'EditRepository',
    component: EditRepository,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;