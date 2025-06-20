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
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const metrics = ref([
      { title: 'Total Income', value: '$0.00' },
      { title: 'Total Expenses', value: '$0.00' },
      { title: 'Net Profit', value: '$0.00' },
      { title: 'Monthly Balance', value: '0' }
    ])

    return {
      metrics
    }
  }
})
</script>