<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">Create New Expense</h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Concept</label>
        <input 
          v-model="form.concept"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Amount</label>
        <input 
          v-model="form.amount"
          type="number"
          step="0.01"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Date</label>
        <input 
          v-model="form.date"
          type="date"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Type</label>
        <select 
          v-model="form.type"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Category</label>
        <select 
          v-model="form.category_id"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Issuer</label>
        <select 
          v-model="form.issuer_id"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select an issuer</option>
          <option v-for="issuer in issuers" :key="issuer.id" :value="issuer.id">
            {{ issuer.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Invoice Image</label>
        <input 
          type="file"
          accept="image/*"
          @change="onFileChange"
          class="mt-1 block w-full text-sm text-gray-500"
        />
        <div v-if="imagePreview" class="mt-2">
          <img :src="imagePreview" alt="Preview" class="max-h-32 rounded border" />
        </div>
        <div v-if="fileLoading" class="text-xs text-gray-500 mt-1">Loading image...</div>
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
import { defineComponent, ref, PropType } from 'vue'
import { Expense, Category, Issuer } from '../types/models'
import { api } from '../services/api'

function toISODate(dateStr: string): string {
  // Converts 'YYYY-MM-DD' to ISO string (UTC midnight)
  return new Date(dateStr + 'T00:00:00Z').toISOString();
}

export default defineComponent({
  name: 'CreateExpenseForm',
  emits: ['success', 'error', 'close'],
  props: {
    categories: {
      type: Array as PropType<Category[]>,
      required: true
    },
    issuers: {
      type: Array as PropType<Issuer[]>,
      required: true
    }
  },
  setup(props, { emit }) {
    const form = ref<Partial<Expense>>({
      concept: '',
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      type: 'expense',
      category_id: undefined,
      issuer_id: undefined,
      invoice_image: undefined
    })
    const loading = ref(false)
    const error = ref('')
    const fileLoading = ref(false)
    const imagePreview = ref<string | null>(null)

    const onFileChange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      fileLoading.value = true
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Extra check: ensure Data URL prefix is present
        if (!result.startsWith('data:image/')) {
          error.value = 'Invalid image format. Please select a valid image file.'
          form.value.invoice_image = undefined
          imagePreview.value = null
          fileLoading.value = false
          return
        }
        form.value.invoice_image = result
        imagePreview.value = result
        fileLoading.value = false
      }
      reader.onerror = () => {
        error.value = 'Failed to read image file.'
        fileLoading.value = false
      }
      reader.readAsDataURL(file)
    }

    const handleSubmit = async () => {
      if (fileLoading.value) {
        error.value = 'Please wait for the image to finish loading.'
        return
      }
      loading.value = true
      error.value = ''
      try {
        // Prepare payload to match Go backend
        const payload: any = {
          concept: form.value.concept,
          amount: Number(form.value.amount),
          date: toISODate(form.value.date as string),
          type: form.value.type,
        }
        if (form.value.category_id) payload.category_id = form.value.category_id
        if (form.value.issuer_id) payload.issuer_id = form.value.issuer_id
        if (form.value.invoice_image) payload.invoice_image = form.value.invoice_image
        const created = await api.createExpense(payload)
        emit('success', created)
      } catch (e: any) {
        error.value = e.message || 'Failed to create expense'
        emit('error', error.value)
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      handleSubmit,
      loading,
      error,
      onFileChange,
      fileLoading,
      imagePreview
    }
  }
})
</script>
