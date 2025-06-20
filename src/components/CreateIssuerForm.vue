<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">Create New Issuer</h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Name</label>
        <input 
          v-model="form.name"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div class="flex justify-end space-x-3">
        <button 
          type="button" 
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          Create
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Issuer } from '../types/models'
import { api } from '../services/api'

export default defineComponent({
  name: 'CreateIssuerForm',
  emits: ['success', 'error', 'close'],
  setup(_, { emit }) {
    const form = ref<Partial<Issuer>>({
      name: ''
    })
    const loading = ref(false)
    const error = ref('')

    const handleSubmit = async () => {
      loading.value = true
      error.value = ''
      try {
        const created = await api.createIssuer(form.value)
        emit('success', created)
      } catch (e: any) {
        error.value = e.message || 'Failed to create issuer'
        emit('error', error.value)
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      handleSubmit,
      loading,
      error
    }
  }
})
</script>
