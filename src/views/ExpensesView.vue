<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Expenses</h1>

    <!-- Expense List -->
    <div class="grid grid-cols-1 gap-4 mb-16">
      <div v-if="expenses.length === 0" class="text-center text-gray-500 py-8">
        No expenses recorded yet
      </div>

      <div v-for="expense in expenses" :key="expense.id" class="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50" @click="showExpenseImage(expense)">
        <h3 class="text-lg font-semibold">{{ expense.concept }}</h3>
        <p class="text-gray-600">Amount: ${{ expense.amount.toFixed(2) }}</p>
        <p class="text-gray-600">Date: {{ formatDate(expense.date) }}</p>
        <span class="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded mt-2">
          {{ getCategoryName(expense.category_id) }}
        </span>
        <span v-if="expense.invoice_image" class="ml-2 text-xs text-blue-500">[View Image]</span>
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
          @click="openModal('expense')"
          class="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
        >
          Create Expense
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
                <CreateExpenseForm
                  v-if="activeModal === 'expense'"
                  :categories="categories"
                  :issuers="issuers"
                  @success="handleExpenseSuccess"
                  @error="handleExpenseError"
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
                <div v-if="selectedExpense && selectedExpense.invoice_image">
                  <img :src="selectedExpense.invoice_image" alt="Invoice" class="max-w-full max-h-[60vh] mx-auto rounded border" />
                </div>
                <div v-else class="text-gray-500">No image available for this expense.</div>
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
import CreateExpenseForm from '../components/CreateExpenseForm.vue'
import CreateIssuerForm from '../components/CreateIssuerForm.vue'
import CreateCategoryForm from '../components/CreateCategoryForm.vue'
import { Expense, Category, Issuer } from '../types/models'
import { api } from '../services/api'

export default defineComponent({
  name: 'ExpensesView',
  components: {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
    CreateExpenseForm,
    CreateIssuerForm,
    CreateCategoryForm
  },
  setup() {
    const expenses = ref<Expense[]>([])
    const categories = ref<Category[]>([])
    const issuers = ref<Issuer[]>([])
    const showOptions = ref(false)
    const isModalOpen = ref(false)
    const activeModal = ref<'expense' | 'issuer' | 'category' | null>(null)
    const error = ref('')
    const success = ref('')
    const showImageModal = ref(false)
    const selectedExpense = ref<Expense | null>(null)

    onMounted(() => {
      loadData()
    })

    const loadData = async () => {
      try {
        expenses.value = await api.getExpenses()
        categories.value = await api.getCategories()
        issuers.value = await api.getIssuers()
      } catch (err: any) {
        error.value = err.message || 'Failed to load data'
      }
    }

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString()
    }

    const getCategoryName = (categoryId?: number) => {
      if (!categoryId) return 'Uncategorized'
      const category = categories.value.find(c => c.id === categoryId)
      return category?.name || 'Uncategorized'
    }

    const openModal = (type: 'expense' | 'issuer' | 'category') => {
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

    const showExpenseImage = (expense: Expense) => {
      selectedExpense.value = expense
      showImageModal.value = true
    }
    const closeImageModal = () => {
      showImageModal.value = false
      selectedExpense.value = null
    }

    // --- New event-based handlers ---
    const handleExpenseSuccess = async (created: Expense) => {
      success.value = 'Expense created successfully!'
      await loadData()
      closeModal()
    }
    const handleExpenseError = (msg: string) => {
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

    return {
      expenses,
      categories,
      issuers,
      showOptions,
      isModalOpen,
      activeModal,
      error,
      success,
      showImageModal,
      selectedExpense,
      formatDate,
      getCategoryName,
      openModal,
      closeModal,
      showExpenseImage,
      closeImageModal,
      handleExpenseSuccess,
      handleExpenseError,
      handleIssuerSuccess,
      handleIssuerError,
      handleCategorySuccess,
      handleCategoryError
    }
  }
})
</script>
