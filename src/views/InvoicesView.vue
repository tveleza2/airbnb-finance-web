// ...existing code from ExpensesView.vue, but as InvoicesView.vue...
// This file is now the main invoices view, using Invoice types and CreateInvoiceForm.
// ...existing code...
<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Invoices</h1>

    <!-- Invoice List -->
    <div class="grid grid-cols-1 gap-4 mb-16">
      <div v-if="invoices.length === 0" class="text-center text-gray-500 py-8">
        No invoices recorded yet
      </div>

      <div v-for="invoice in invoices" :key="invoice.id" class="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center group" @click="showInvoiceImage(invoice)">
        <div>
          <h3 class="text-lg font-semibold">{{ invoice.concept }}</h3>
          <p class="text-gray-600">Full Amount: ${{ invoice.full_amount.toFixed(2) }}</p>
          <p class="text-gray-600">VAT: ${{ invoice.vat.toFixed(2) }}</p>
          <p class="text-gray-600">Date: {{ formatDate(invoice.date) }}</p>
          <span class="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded mt-2">
            {{ getCategoryName(invoice.category_id) }}
          </span>
          <span v-if="invoice.invoice_image" class="ml-2 text-xs text-blue-500">[View Image]</span>
        </div>
        <div class="flex items-center space-x-2">
          <button
            v-if="typeof invoice.id === 'string' && invoice.id.length > 0"
            @click.stop="openEditModal(invoice)"
            class="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            title="Edit Invoice"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182L7.5 20.213l-4.182.545.545-4.182 13-13z" />
            </svg>
          </button>
          <button
            v-if="typeof invoice.id === 'string' && invoice.id.length > 0"
            @click.stop="deleteInvoice(invoice.id as string)"
            class="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            title="Delete Invoice"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Add Button -->
    <div class="fixed bottom-6 right-6">
      <button 
        @click="showOptions = !showOptions"
        class="bg-violet-400 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-violet-600 focus:outline-none"
      >
        <span class="text-2xl leading-none">+</span>
      </button>

      <!-- Options Menu -->
      <div v-if="showOptions" class="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-2 w-48">
        <button 
          @click="openModal('invoice')"
          class="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
        >
          Create Invoice
        </button>
        <button 
          @click="openModal('issuer')"
          class="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
        >
          Create Issuer
        </button>
        <button 
          @click="openModal('category')"
          class="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
        >
          Create Category
        </button>
      </div>
    </div>

    <!-- Modals -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <CreateInvoiceForm
                  v-if="activeModal === 'invoice'"
                  :categories="categories"
                  :issuers="issuers"
                  :invoice="editInvoice"
                  @success="handleInvoiceSuccess"
                  @error="handleInvoiceError"
                  @close="closeModal"
                />
                <CreateIssuerForm
                  v-if="activeModal === 'issuer'"
                  @success="handleIssuerSuccess"
                  @error="handleIssuerError"
                  @close="closeModal"
                />
                <CreateCategoryForm
                  v-if="activeModal === 'category'"
                  @success="handleCategorySuccess"
                  @error="handleCategoryError"
                  @close="closeModal"
                />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Add image modal -->
    <TransitionRoot appear :show="showImageModal" as="template">
      <Dialog as="div" @close="closeImageModal" class="relative z-20">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-40" />
        </TransitionChild>
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <h2 class="text-lg font-semibold mb-4">Invoice Image</h2>
                <div v-if="selectedInvoice && selectedInvoice.invoice_image">
                  <img :src="fixDropboxUrl(selectedInvoice.invoice_image)" alt="Invoice" class="max-w-full max-h-[60vh] mx-auto rounded border" />
                </div>
                <div v-else class="text-gray-500">No image available for this invoice.</div>
                <button @click="closeImageModal" class="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Close</button>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import CreateInvoiceForm from '../components/CreateInvoiceForm.vue'
import CreateIssuerForm from '../components/CreateIssuerForm.vue'
import CreateCategoryForm from '../components/CreateCategoryForm.vue'
import { Invoice, Category, Issuer } from '../types/models'
import { api } from '../services/api'

export default defineComponent({
  name: 'InvoicesView',
  components: {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
    CreateInvoiceForm,
    CreateIssuerForm,
    CreateCategoryForm
  },
  setup() {
    const invoices = ref<Invoice[]>([])
    const categories = ref<Category[]>([])
    const issuers = ref<Issuer[]>([])
    const showOptions = ref(false)
    const isModalOpen = ref(false)
    const activeModal = ref<'invoice' | 'issuer' | 'category' | null>(null)
    const error = ref('')
    const success = ref('')
    const showImageModal = ref(false)
    const selectedInvoice = ref<Invoice | null>(null)
    const editInvoice = ref<Invoice | null>(null)

    onMounted(() => {
      loadData()
    })

    const loadData = async () => {
      try {
        invoices.value = await api.getInvoices()
        categories.value = await api.getCategories()
        issuers.value = await api.getIssuers()
      } catch (err: any) {
        error.value = err.message || 'Failed to load data'
      }
    }

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString()
    }

    const getCategoryName = (categoryId?: string) => {
      if (!categoryId) return 'Uncategorized'
      const category = categories.value.find(c => c.id === categoryId)
      return category?.name || 'Uncategorized'
    }

    const openModal = (type: 'invoice' | 'issuer' | 'category') => {
      activeModal.value = type
      isModalOpen.value = true
      showOptions.value = false
      error.value = ''
      success.value = ''
    }

    const closeModal = () => {
      isModalOpen.value = false
      activeModal.value = null
    }

    const showInvoiceImage = (invoice: Invoice) => {
      selectedInvoice.value = invoice
      showImageModal.value = true
    }
    const closeImageModal = () => {
      showImageModal.value = false
      selectedInvoice.value = null
    }

    const openEditModal = (invoice: Invoice) => {
      editInvoice.value = { ...invoice }
      activeModal.value = 'invoice'
      isModalOpen.value = true
      showOptions.value = false
      error.value = ''
      success.value = ''
    }

    // --- New event-based handlers ---
    const handleInvoiceSuccess = async (created: Invoice) => {
      success.value = 'Invoice created successfully!'
      await loadData()
      closeModal()
    }
    const handleInvoiceError = (msg: string) => {
      error.value = msg
    }
    const handleIssuerSuccess = async (created: Issuer) => {
      success.value = 'Issuer created successfully!'
      await loadData()
      closeModal()
    }
    const handleIssuerError = (msg: string) => {
      error.value = msg
    }
    const handleCategorySuccess = async (created: Category) => {
      success.value = 'Category created successfully!'
      await loadData()
      closeModal()
    }
    const handleCategoryError = (msg: string) => {
      error.value = msg
    }

    const fixDropboxUrl = (url: string) => {
      // Convert Dropbox shared link to direct download link
      return url
        .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
        .replace('/scl/fi/', '/s/')
        .replace(/\?dl=0$/, '')
        .replace(/\?dl=1$/, '')
        .replace(/\?raw=1$/, '')
    }

    // --- Delete invoice handler ---
    const deleteInvoice = async (id: string) => {
      if (!confirm('Are you sure you want to delete this invoice?')) return
      try {
        await api.deleteInvoice(id)
        success.value = 'Invoice deleted successfully!'
        await loadData()
      } catch (err: any) {
        error.value = err.message || 'Failed to delete invoice'
      }
    }

    return {
      invoices,
      categories,
      issuers,
      showOptions,
      isModalOpen,
      activeModal,
      error,
      success,
      showImageModal,
      selectedInvoice,
      editInvoice,
      formatDate,
      getCategoryName,
      openModal,
      closeModal,
      showInvoiceImage,
      closeImageModal,
      openEditModal,
      handleInvoiceSuccess,
      handleInvoiceError,
      handleIssuerSuccess,
      handleIssuerError,
      handleCategorySuccess,
      handleCategoryError,
      fixDropboxUrl,
      deleteInvoice,
    }
  }
})
</script>
