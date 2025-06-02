<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  TrashIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
  TagIcon,
  PlusIcon,
  PencilIcon,
  PlayIcon,
  ExclamationCircleIcon // For "no templates" state
} from '@heroicons/vue/24/outline'; // Or /20/outline for smaller icons
import { format, formatDistanceToNow } from 'date-fns'; // For date formatting
import ListDetails from '@/components/layouts/list/ListDetails.vue';

// --- Interfaces for Data ---
interface Template {
  id: string;
  name: string;
  description: string;
  lastModified: Date;
  // Add other template specific fields (e.g., content, parameters, type)
}

interface RepositoryDetails {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  lastModified: Date;
  permission: 'private' | 'team' | 'public';
  tags: string[];
  templateCount: number;
  templates: Template[]; // List of templates within this collection
  // Add other collection specific fields if needed
}

// --- State Management ---
const route = useRoute();
const router = useRouter();

const repository = ref<RepositoryDetails | null>(null);
const repositoryFound = ref(false)
const isLoading = ref(true);

// --- Data Fetching ---
onMounted(async () => {
  const repositoryId = route.params.id as string;
  if (!repositoryId) {
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    // Simulate API call to fetch repository details and its templates
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // Mock Data based on ID (replace with actual API fetch)
    const fetchedCollection: RepositoryDetails | undefined = mockCollectionsData.find(
      (c) => c.id === repositoryId
    );

    if (fetchedCollection) {
      repositoryFound.value = true
      // Ensure Date objects if fetching from JSON/string dates
      fetchedCollection.createdAt = new Date(fetchedCollection.createdAt);
      fetchedCollection.lastModified = new Date(fetchedCollection.lastModified);
      fetchedCollection.templates.forEach(t => t.lastModified = new Date(t.lastModified));

      repository.value = fetchedCollection;
    } else {
      repository.value = null; // Mark as not found
    }
  } catch (error) {
    console.error('Error fetching repository details:', error);
    repository.value = null; // Mark as not found on error
    alert('Failed to load repository details. Please try again.');
  } finally {
    isLoading.value = false;
  }
});

// --- Computed Properties / Helpers ---
const permissionBadgeClass = (permission: 'private' | 'team' | 'public') => {
  switch (permission) {
    case 'private': return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2';
    case 'team': return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2';
    case 'public': return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2';
    default: return '';
  }
};

// --- Event Handlers / Actions ---
const handleEditCollection = () => {
  if (repository.value) {
    router.push({ name: 'EditCollection', params: { id: repository.value.id } });
  }
};

const handleDeleteCollection = async () => {
  if (!repository.value) return;

  if (confirm(`Are you sure you want to delete the repository "${repository.value.name}"? This action cannot be undone.`)) {
    console.log('Deleting repository:', repository.value.id);
    // In a real app: make API call to delete repository
    // await api.deleteCollection(repository.value.id);

    // After successful deletion, redirect to overview
    router.push({ name: 'RepositoryOverview' });
    alert(`Collection "${repository.value.name}" deleted successfully.`);
  }
};

const handleAddNewTemplate = () => {
  if (repository.value) {
    router.push({ name: 'CreateTemplate', query: { repositoryId: repository.value.id } });
  }
};

const handleViewTemplate = (templateId: string) => {
  if (repository.value) {
    router.push({ name: 'TemplateDetails', params: { repositoryId: repository.value.id, templateId: templateId } });
  }
};

const handleEditTemplate = (templateId: string) => {
  if (repository.value) {
    router.push({ name: 'EditTemplate', params: { repositoryId: repository.value.id, templateId: templateId } });
  }
};

const handleRunTest = (templateId: string) => {
  console.log(`Running test for template ${templateId} in repository ${repository.value?.id}`);
  // Navigate to a testing page or trigger a modal
  // router.push({ name: 'TemplateTestRunner', params: { repositoryId: repository.value?.id, templateId } });
  alert(`Simulating test run for Template ID: ${templateId}`);
};

const handleDeleteTemplate = async (templateId: string) => {
  if (!repository.value) return;
  const templateName = repository.value.templates.find(t => t.id === templateId)?.name || 'this template';

  if (confirm(`Are you sure you want to delete ${templateName}? This action cannot be undone.`)) {
    console.log(`Deleting template ${templateId} from repository ${repository.value.id}`);
    // In a real app: make API call to delete template
    // await api.deleteTemplate(repository.value.id, templateId);

    // Update local state (optional, or re-fetch data)
    repository.value.templates = repository.value.templates.filter(t => t.id !== templateId);
    repository.value.templateCount = repository.value.templates.length;
    alert(`${templateName} deleted successfully.`);
  }
};

// --- Mock Data (for demonstration) ---
const mockCollectionsData: RepositoryDetails[] = [
  {
    id: 'coll-001',
    name: 'General Purpose Prompts',
    description: 'A repository of versatile prompts for various AI tasks like summarization, translation, and simple Q&A. This repository is designed to be a starting point for common use cases, providing a wide range of adaptable templates.',
    createdAt: new Date('2024-01-15T09:00:00Z'),
    lastModified: new Date('2025-05-30T14:30:00Z'),
    permission: 'team',
    tags: ['general', 'utility', 'foundation'],
    templateCount: 3,
    templates: [
      { id: 'temp-101', name: 'Summarize Text', description: 'Summarizes given text into a concise overview.', lastModified: new Date('2025-05-29T10:00:00Z') },
      { id: 'temp-102', name: 'Translate English to Spanish', description: 'Translates English text to Spanish.', lastModified: new Date('2025-05-28T11:30:00Z') },
      { id: 'temp-103', name: 'Generate Idea List', description: 'Generates a list of ideas based on a keyword.', lastModified: new Date('2025-05-27T16:00:00Z') },
    ],
  },
  {
    id: 'coll-002',
    name: 'Customer Service Bot Prompts',
    description: 'Prompts specifically designed for AI-powered customer service agents, handling common queries and scenarios. Focuses on empathetic and clear communication.',
    createdAt: new Date('2024-03-01T10:00:00Z'),
    lastModified: new Date('2025-05-29T18:00:00Z'),
    permission: 'private',
    tags: ['customer service', 'chatbot', 'support'],
    templateCount: 2,
    templates: [
      { id: 'temp-201', name: 'Handle Refund Request', description: 'Template for processing customer refund requests.', lastModified: new Date('2025-05-29T17:00:00Z') },
      { id: 'temp-202', name: 'Address Product Query', description: 'Provides information to common product questions.', lastModified: new Date('2025-05-28T09:00:00Z') },
    ],
  },
  {
    id: 'coll-003',
    name: 'Empty Collection Example',
    description: 'This is an example of a repository with no templates yet.',
    createdAt: new Date('2025-01-01T00:00:00Z'),
    lastModified: new Date('2025-01-01T00:00:00Z'),
    permission: 'public',
    tags: ['test', 'empty'],
    templateCount: 0,
    templates: [],
  },
];
</script>

<template>
  <ListDetails :isLoading="isLoading" :loadingDescription="'Loading repository details...'" :itemFound="repositoryFound" :itemFoundDescription="'Repository Not Found'">
    <template #page>
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-4 md:mb-0">
          {{ repository.name }}
        </h1>
        <div class="flex space-x-3">
          <button
            @click="handleEditCollection"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PencilSquareIcon class="h-5 w-5 mr-2" /> Edit Collection
          </button>
          <button
            @click="handleDeleteCollection"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon class="h-5 w-5 mr-2" /> Delete Collection
          </button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
        <p class="text-gray-700 text-lg mb-4">{{ repository.description }}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 text-sm text-gray-600">
          <div class="flex items-center">
            <ClockIcon class="h-4 w-4 mr-2 text-gray-500" />
            Created: {{ format(repository.createdAt, 'MMM d, yyyy') }}
          </div>
          <div class="flex items-center">
            <ArrowPathIcon class="h-4 w-4 mr-2 text-gray-500" />
            Last Modified: {{ formatDistanceToNow(repository.lastModified) }} ago
          </div>
          <div class="flex items-center">
            <UserGroupIcon class="h-4 w-4 mr-2 text-gray-500" />
            Permissions: <span :class="permissionBadgeClass(repository.permission)">{{ repository.permission }}</span>
          </div>
          <div class="flex items-center">
            <DocumentDuplicateIcon class="h-4 w-4 mr-2 text-gray-500" />
            Templates: {{ repository.templateCount }}
          </div>
          <div class="flex items-center col-span-1 md:col-span-2">
            <TagIcon class="h-4 w-4 mr-2 text-gray-500" />
            Tags:
            <div class="flex flex-wrap gap-2 ml-2">
              <span
                v-for="tag in repository.tags"
                :key="tag"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {{ tag }}
              </span>
              <span v-if="repository.tags.length === 0" class="text-gray-500 italic">No tags</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Templates in this Collection ({{ repository.templateCount }})</h2>
        <button
          @click="handleAddNewTemplate"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" /> Add New Template
        </button>
      </div>

      <div v-if="repository.templates.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center text-gray-600">
        <ExclamationCircleIcon class="h-10 w-10 text-gray-400 mx-auto mb-4" />
        <p class="text-lg mb-2">No templates found in this repository.</p>
        <p class="text-sm">Start by adding a new template above!</p>
      </div>
      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="template in repository.templates" :key="template.id" class="px-6 py-4 hover:bg-gray-50 transition duration-150 ease-in-out flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                <a href="#" @click.prevent="handleViewTemplate(template.id)" class="hover:text-indigo-600">{{ template.name }}</a>
              </h3>
              <p class="text-sm text-gray-600 line-clamp-1">{{ template.description || 'No description provided.' }}</p>
              <div class="text-xs text-gray-500 mt-1">
                Last Modified: {{ formatDistanceToNow(template.lastModified) }} ago
              </div>
            </div>
            <div class="flex space-x-2">
              <button @click="handleEditTemplate(template.id)" class="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-gray-100 transition"><PencilIcon class="h-5 w-5" /></button>
              <button @click="handleRunTest(template.id)" class="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-gray-100 transition"><PlayIcon class="h-5 w-5" /></button>
              <button @click="handleDeleteTemplate(template.id)" class="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition"><TrashIcon class="h-5 w-5" /></button>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </ListDetails>
</template>