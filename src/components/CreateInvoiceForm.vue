<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">{{ isEditMode ? 'Edit' : 'Create New' }} Invoice</h2>
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
        <label class="block text-sm font-medium text-gray-700">Full Amount</label>
        <input 
          :value="isEditingFullAmount ? form.full_amount : formattedFullAmount"
          @input="onFullAmountInput($event)"
          @focus="isEditingFullAmount = true"
          @blur="onFullAmountBlur"
          type="text"
          inputmode="decimal"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">VAT</label>
        <input 
          :value="isEditingVat ? form.vat : formattedVat"
          @input="onVatInput($event)"
          @focus="isEditingVat = true"
          @blur="onVatBlur"
          type="text"
          inputmode="decimal"
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
          <option value="cost">Cost</option>
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
          <button type="button" @click="removeImage" class="mt-2 ml-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Remove Image</button>
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
          {{ isEditMode ? 'Update' : 'Create' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, watch } from 'vue'
import { Invoice, Category, Issuer } from '../types/models'
import { api } from '../services/api'

function toISODate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00Z').toISOString();
}

export default defineComponent({
  name: 'CreateInvoiceForm',
  emits: ['success', 'error', 'close'],
  props: {
    categories: {
      type: Array as PropType<Category[]>,
      required: true
    },
    issuers: {
      type: Array as PropType<Issuer[]>,
      required: true
    },
    invoice: {
      type: Object as PropType<Invoice | null>,
      default: null
    }
  },
  setup(props, { emit }) {
    const form = ref<Partial<Invoice>>({
      concept: '',
      full_amount: 0,
      vat: 0,
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
    const isEditingFullAmount = ref(false)
    const isEditingVat = ref(false)

    // Watch for invoice prop to pre-fill form
    watch(() => props.invoice, (newInvoice) => {
      if (newInvoice) {
        form.value = {
          ...newInvoice,
          date: newInvoice.date ? newInvoice.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
        }
        imagePreview.value = newInvoice.invoice_image || null
      } else {
        form.value = {
          concept: '',
          full_amount: 0,
          vat: 0,
          date: new Date().toISOString().slice(0, 10),
          type: 'expense',
          category_id: undefined,
          issuer_id: undefined,
          invoice_image: undefined
        }
        imagePreview.value = null
      }
    }, { immediate: true })

    const onFileChange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      fileLoading.value = true
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
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

    // Currency formatting helpers
    const formatCurrency = (value: number) => {
      return value.toLocaleString('en-US', { style: 'currency', currency: 'COP' })
    }
    const parseCurrency = (value: string) => {
      // Remove all non-numeric except dot and minus
      const num = Number(value.replace(/[^\d.-]/g, ''))
      return isNaN(num) ? 0 : num
    }

    const formattedFullAmount = computed({
      get: () => formatCurrency(Number(form.value.full_amount) || 0),
      set: (val: string) => {
        form.value.full_amount = parseCurrency(val)
      }
    })
    const formattedVat = computed({
      get: () => formatCurrency(Number(form.value.vat) || 0),
      set: (val: string) => {
        form.value.vat = parseCurrency(val)
      }
    })

    const isEditMode = computed(() => !!props.invoice && !!props.invoice.id)

    function onFullAmountInput(e: Event) {
      const val = (e.target as HTMLInputElement).value
      form.value.full_amount = parseCurrency(val)
    }
    function onFullAmountBlur() {
      form.value.full_amount = parseCurrency(String(form.value.full_amount))
      isEditingFullAmount.value = false
    }
    function onVatInput(e: Event) {
      const val = (e.target as HTMLInputElement).value
      form.value.vat = parseCurrency(val)
    }
    function onVatBlur() {
      form.value.vat = parseCurrency(String(form.value.vat))
      isEditingVat.value = false
    }

    const handleSubmit = async () => {
      if (fileLoading.value) {
        error.value = 'Please wait for the image to finish loading.'
        return
      }
      loading.value = true
      error.value = ''
      try {
        const payload: any = {
          concept: form.value.concept,
          full_amount: Number(form.value.full_amount),
          vat: Number(form.value.vat),
          date: toISODate(form.value.date as string),
          type: form.value.type,
        }
        if (form.value.category_id) payload.category_id = form.value.category_id
        if (form.value.issuer_id) payload.issuer_id = form.value.issuer_id
        if (form.value.invoice_image) payload.invoice_image = form.value.invoice_image
        let result
        if (isEditMode.value && props.invoice && props.invoice.id) {
          // Update
          result = await api.updateInvoice(props.invoice.id, payload)
        } else {
          // Create
          result = await api.createInvoice(payload)
        }
        emit('success', result)
      } catch (e: any) {
        error.value = e.message || 'Failed to save invoice'
        emit('error', error.value)
      } finally {
        loading.value = false
      }
    }

    function removeImage() {
      form.value.invoice_image = undefined
      imagePreview.value = null
    }

    return {
      form,
      handleSubmit,
      loading,
      error,
      onFileChange,
      fileLoading,
      imagePreview,
      formattedFullAmount,
      formattedVat,
      onFullAmountInput,
      onVatInput,
      onFullAmountBlur,
      onVatBlur,
      isEditingFullAmount,
      isEditingVat,
      isEditMode,
      removeImage
    }
  }
})
</script>
