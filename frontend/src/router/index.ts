import CreatePrompt from '@/components/views/prompts/CreatePrompt.vue';
import EditPrompt from '@/components/views/prompts/EditPrompt.vue';
import CreateRepository from '@/components/views/repositories/CreateRepository.vue';
import EditRepository from '@/components/views/repositories/EditRepository.vue';
import RepositoryDetails from '@/components/views/repositories/RepositoryDetails.vue';
import RepositoryOverview from '@/components/views/repositories/RepositoryOverview.vue';
import { createRouter, createWebHistory } from 'vue-router';


const promptRoutes = [
  {
    path: '/prompts/create',
    name: 'CreatePrompt',
    component: CreatePrompt
  },
  {
    path: '/prompts/:id/edit',
    name: 'EditPrompt',
    component: EditPrompt,
    props: true,
  },
]

const repositoryRoutes = [
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

const routes = [
  {
    path: '/',
    name: 'RepositoryOverview',
    component: RepositoryOverview,
  }
]
  .concat(promptRoutes)
  .concat(repositoryRoutes)

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;