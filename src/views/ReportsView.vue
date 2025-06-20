<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Financial Reports</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Monthly Summary -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Monthly Summary</h2>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Total Income:</span>
            <span class="font-medium">${{ monthlyStats.income.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Total Expenses:</span>
            <span class="font-medium">${{ monthlyStats.expenses.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center font-semibold">
            <span class="text-gray-600">Net Profit:</span>
            <span :class="monthlyStats.profit >= 0 ? 'text-green-600' : 'text-red-600'">
              ${{ monthlyStats.profit.toFixed(2) }}
            </span>
          </div>
        </div>
        <button 
          @click="showMonthlyDetails = true"
          class="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>

      <!-- Category Summary -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Expense Categories</h2>
        <div class="space-y-2">
          <div v-for="category in categoryStats" :key="category.id" class="flex justify-between items-center">
            <span class="text-gray-600">{{ category.name }}:</span>
            <span class="font-medium">${{ category.total.toFixed(2) }}</span>
          </div>
        </div>
        <button 
          @click="showCategoryDetails = true"
          class="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>

      <!-- Occupancy Stats -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Occupancy Rate</h2>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Current Month:</span>
            <span class="font-medium">{{ occupancyStats.currentMonth }}%</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Last Month:</span>
            <span class="font-medium">{{ occupancyStats.lastMonth }}%</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Average:</span>
            <span class="font-medium">{{ occupancyStats.average }}%</span>
          </div>
        </div>
        <button 
          @click="showOccupancyDetails = true"
          class="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>

    <!-- Modal Templates -->
    <TransitionRoot appear :show="showMonthlyDetails" as="template">
      <Dialog as="div" @close="showMonthlyDetails = false" class="relative z-10">
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl transition-all">
              <DialogTitle class="text-lg font-medium leading-6 text-gray-900">
                Monthly Details
              </DialogTitle>
              <!-- Add monthly details content here -->
              <button
                @click="showMonthlyDetails = false"
                class="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Close
              </button>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Similar modals for category and occupancy details -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { api } from '../services/api'

interface MonthlyStats {
  income: number
  expenses: number
  profit: number
}

interface CategoryStat {
  id: number
  name: string
  total: number
}

interface OccupancyStats {
  currentMonth: number
  lastMonth: number
  average: number
}

export default defineComponent({
  name: 'ReportsView',
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
  },
  setup() {
    const monthlyStats = ref<MonthlyStats>({
      income: 0,
      expenses: 0,
      profit: 0
    })

    const categoryStats = ref<CategoryStat[]>([])
    const occupancyStats = ref<OccupancyStats>({
      currentMonth: 0,
      lastMonth: 0,
      average: 0
    })
    const showMonthlyDetails = ref(false)
    const showCategoryDetails = ref(false)
    const showOccupancyDetails = ref(false)
    const error = ref('')

    onMounted(async () => {
      await loadReportData()
    })

    const loadReportData = async () => {
      try {
        const monthly = await api.getMonthlyStats()
        monthlyStats.value = monthly
        categoryStats.value = await api.getCategoryStats()
        occupancyStats.value = await api.getOccupancyStats()
      } catch (err: any) {
        error.value = err.message || 'Failed to load report data'
      }
    }

    return {
      monthlyStats,
      categoryStats,
      occupancyStats,
      showMonthlyDetails,
      showCategoryDetails,
      showOccupancyDetails,
      error
    }
  }
})
</script>
