<script setup lang="ts">
import FormInput from '@/components/layouts/form/FormInput.vue';
import FormModal from '@/components/layouts/form/FormModal.vue';
import Header from '@/components/shared/Header.vue';
import type { FormInstance } from '@/types/form';
import { reactive, ref } from 'vue';
import { RouterView } from 'vue-router';
import { apiService } from './api/apiService';


const formInstance = reactive<Map<string, FormInstance>>(new Map());
const isLogin = ref<boolean>(sessionStorage.getItem('accessToken') ? true : false);
const isSubmitLogin = ref<boolean>(false);

const handleLoginSubmit = async () => {
  const formData = {
    username: formInstance.get('userName')?.editableContent as string,
    password: formInstance.get('password')?.editableContent as string,
  }

  const response = await apiService.auth.login(formData);
  sessionStorage.setItem('accessToken', response.data.access_token as string);
  isSubmitLogin.value = false;
  isLogin.value = true;
};

const registerRef = async (key:string, instance: any) => {
  if (instance) {
    formInstance.set(key, instance)
  }
}
</script>

<template>
  <div class="flex-col no-scrollbar">
    <Header :is-login="isLogin" @login="isSubmitLogin = true;" />
    <RouterView />
  </div>
  <FormModal :is-open="isSubmitLogin" :title="'Configure Node'" :cancel-button-name="'Cancel'" :save-button-name="'Save'" @close="isSubmitLogin = false" @save="handleLoginSubmit">
    <template #fields>
      <FormInput :label-name="'User Name'" :label-id="'userName'" :placeholder="'Enter your name'" :ref="el => registerRef('userName', el)" />
      <FormInput :label-name="'Password'" :label-id="'password'" :placeholder="'Enter your password'" :type="'password'" :ref="el => registerRef('password', el)" />
    </template>
  </FormModal>
</template>
