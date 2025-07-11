<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Airbnb Finance Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <template v-for="(metric, index) in metrics" :key="index">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-center mb-2">{{ metric.title }}</h2>
          <p class="text-center text-3xl">{{ metric.value }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { api } from '../services/api'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const metrics = ref([
      { title: 'Total Income', value: '$0.00' },
      { title: 'Total Expenses', value: '$0.00' },
      { title: 'Net Profit', value: '$0.00' },
      { title: 'Monthly Balance', value: '0' }
    ])
    const error = ref('')

    onMounted(async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth()).padStart(2, '0'); // getMonth() is zero-based

        const monthly = await api.getMonthlyStats()
        const monthlyBalance = await monthly["monthly-balance"][`${year}-${month}`]

        console.log(`${year}-${month}`)
        metrics.value[0].value = `$${(monthly["total-income"]).toFixed(2)}`
        metrics.value[1].value = `$${monthly["total-expenses"].toFixed(2)}`
        metrics.value[2].value = `$${monthly["net-profit"].toFixed(2)}`
        metrics.value[3].value = '$' + (monthlyBalance >= 0 ? '+' : '') + monthlyBalance
      } catch (err: any) {
        error.value = err.message || 'Failed to load dashboard metrics'
      }
    })

    return {
      metrics,
      error
    }
  }
})
</script>