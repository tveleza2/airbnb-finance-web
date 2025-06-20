<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow">
      <div class="container mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-800">My Accountant</h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="{ 'border-blue-500 text-gray-900': $route.path === '/' }"
              >
                Dashboard
              </router-link>
              <router-link
                to="/expenses"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="{ 'border-blue-500 text-gray-900': $route.path === '/expenses' }"
              >
                Expenses
              </router-link>
              <router-link
                to="/reports"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="{ 'border-blue-500 text-gray-900': $route.path === '/reports' }"
              >
                Reports
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>
