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

export default defineComponent({
  name: 'CreateExpenseForm',
  emits: ['submit', 'close'],
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
      issuer_id: undefined
    })

    const handleSubmit = () => {
      emit('submit', form.value)
    }

    return {
      form,
      handleSubmit
    }
  }
})
</script>
