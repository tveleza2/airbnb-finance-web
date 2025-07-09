<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-sm p-8 bg-white rounded shadow">
      <h1 class="mb-6 text-2xl font-bold text-center">Login</h1>
      <form @submit.prevent="onLogin">
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">Username</label>
          <input v-model="username" type="text" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" required />
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">Password</label>
          <input v-model="password" type="password" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" required />
        </div>
        <div v-if="error" class="mb-4 text-sm text-red-600">{{ error }}</div>
        <button type="submit" class="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login as apiLogin, getDropboxAuthUrl } from '../services/api'
import { getJwtClaims } from '../services/session'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function onLogin() {
  error.value = ''
  try {
    // Call backend login and get dropbox_connected flag
    const response = await apiLogin(username.value, password.value, true)
    if (response && response.dropbox_connected === false) {
      // Get user id from JWT
      const claims = getJwtClaims()
      const userId = claims && claims.user_id
      if (userId) {
        const { auth_url } = await getDropboxAuthUrl(userId)
        window.location.href = auth_url
        return
      }
    }
    router.push('/')
  } catch (e: any) {
    error.value = e.message || 'Login failed'
  }
}
</script>
