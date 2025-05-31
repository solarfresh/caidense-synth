<script setup lang="ts">
import RepositoryCard from '@/components/views/repositories/RepositoryCard.vue';
import type { Repository } from '@/types/repositories';
import { apiService } from '@/api/apiService';
import { PlusIcon } from '@heroicons/vue/24/outline';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// --- State Management ---
const repositories = ref<Repository[]>([]);
const searchQuery = ref<string>('');
const selectedCategory = ref<string>(''); // Assuming categories are tags
const sortBy = ref<string>('updatedAtDesc'); // Default sort
const showSidebar = ref<boolean>(true); // Toggle sidebar visibility

const fetchRepositories = async () => {
  const response = await apiService.repository.get()
  const responseData: Repository[] = response.data

  repositories.value = responseData.map((repository: Repository) => {
    repository['templateCount'] = repository.prompts.length
    return repository
  })
};

onMounted(() => {
  fetchRepositories();
});

// --- Computed Properties for Filtering and Sorting ---
const availableCategories = computed(() => {
  const allTags = new Set<string>();
  repositories.value.forEach(repository => {
    repository.tags.forEach(tag => allTags.add(tag));
  });
  return Array.from(allTags).sort();
});

const filteredRepositories = computed(() => {
  let filtered = repositories.value;

  // 1. Search Filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(repository =>
      repository.name.toLowerCase().includes(query) ||
      repository.description?.toLowerCase().includes(query) ||
      repository.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // 2. Category Filter
  if (selectedCategory.value) {
    filtered = filtered.filter(repository =>
      repository.tags.includes(selectedCategory.value)
    );
  }

  // 3. Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'updatedAtDesc':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'templateCountDesc':
        return b.templateCount - a.templateCount;
      default:
        return 0;
    }
  });

  return filtered;
});

// --- Event Handlers / Actions ---
const goToCreateCollection = () => {
  router.push({ name: 'CreateCollection' }); // Assuming a router path named 'CreateCollection'
};

const handleEditCollection = (id: string) => {
  console.log('Editing repository:', id);
  router.push({ name: 'EditCollection', params: { id } }); // Assuming a router path 'EditCollection/:id'
};

const handleDeleteCollection = (id: string) => {
  if (confirm('Are you sure you want to delete this repository? This action cannot be undone.')) {
    console.log('Deleting repository:', id);
    // In a real app: make API call to delete, then update repositories.value
    repositories.value = repositories.value.filter(r => r.id !== id);
  }
};

const handleViewCollection = (id: string) => {
  console.log('Viewing repository details:', id);
  router.push({ name: 'RepositoryDetails', params: { id } }); // Assuming a router path 'CollectionDetails/:id'
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <div class="flex-grow container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Repositories</h1>
        <button
          @click="goToCreateCollection"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
          New Repository
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside v-if="showSidebar" class="md:col-span-1 bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Filters</h2>
          <div class="mb-4">
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search by Name</label>
            <input
              type="text"
              id="search"
              v-model="searchQuery"
              placeholder="Search repositories..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div class="mb-4">
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              v-model="selectedCategory"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Categories</option>
              <option v-for="category in availableCategories" :key="category" :value="category">{{ category }}</option>
            </select>
          </div>

          <div>
            <label for="sortBy" class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              id="sortBy"
              v-model="sortBy"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="name">Name (A-Z)</option>
              <option value="updatedAtDesc">Last Modified (Newest First)</option>
              <option value="templateCountDesc">Template Count (High to Low)</option>
            </select>
          </div>
        </aside>

        <div :class="{'md:col-span-3': showSidebar, 'md:col-span-4': !showSidebar}">
          <div v-if="filteredRepositories.length === 0" class="text-center py-10 text-gray-600">
            <p class="text-lg">No repositories found.</p>
            <p class="text-sm mt-2">Click "New Repository" to get started!</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <RepositoryCard
              v-for="repository in filteredRepositories"
              :key="repository.id"
              :repository="repository"
              @edit="handleEditCollection"
              @delete="handleDeleteCollection"
              @view="handleViewCollection"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>