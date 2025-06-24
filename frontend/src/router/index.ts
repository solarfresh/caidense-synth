import BlockOverview from '@/components/views/blocks/BlockOverview.vue';
import CreateBlock from '@/components/views/blocks/CreateBlock.vue';
import CreatePrompt from '@/components/views/prompts/CreatePrompt.vue';
import EditPrompt from '@/components/views/prompts/EditPrompt.vue';
import PromptDetail from '@/components/views/prompts/PromptDetail.vue';
import CreateRepository from '@/components/views/repositories/CreateRepository.vue';
import EditRepository from '@/components/views/repositories/EditRepository.vue';
import RepositoryDetails from '@/components/views/repositories/RepositoryDetails.vue';
import RepositoryOverview from '@/components/views/repositories/RepositoryOverview.vue';
import CreateWorkflow from '@/components/views/workflows/CreateWorkflow.vue';
import WorkflowDetail from '@/components/views/workflows/WorkflowDetail.vue';
import WorkflowOverview from '@/components/views/workflows/WorkflowOverview.vue';
import { createRouter, createWebHistory } from 'vue-router';


const blockRoutes = [
  {
    path: '/blocks',
    name: 'BlockOverview',
    component: BlockOverview
  },
  {
    path: '/blocks/create',
    name: 'CreateBlock',
    component: CreateBlock
  }
]

const workflowRoutes = [
  {
    path: '/workflows',
    name: 'WorkflowOverview',
    component: WorkflowOverview
  },
  {
    path: '/workflows/create',
    name: 'CreateWorkflow',
    component: CreateWorkflow
  },
  {
    path: '/workflows/:id',
    name: 'WorkflowDetail',
    component: WorkflowDetail,
  }
]

const promptRoutes = [
  {
    path: '/prompts/create',
    name: 'CreatePrompt',
    component: CreatePrompt
  },
  {
    path: '/prompts/:id',
    name: 'PromptDetail',
    component: PromptDetail,
    props: true,
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
    name: 'Home',
    component: RepositoryOverview,
  }
]
  .concat(blockRoutes)
  .concat(workflowRoutes)
  .concat(promptRoutes)
  .concat(repositoryRoutes)

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;