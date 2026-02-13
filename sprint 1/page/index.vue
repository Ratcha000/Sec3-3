<template>
  <div class="min-h-screen bg-gray-100 p-10">
    <div class="bg-white rounded-xl shadow-md p-8">

      <!-- Navbar -->
      <div class="flex justify-end">
        <div class="relative">
          
          <!-- Profile Button -->
          <button
            @click="toggleDropdown"
            class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <div class="w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
              J
            </div>
            Jittranuch
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown -->
          <div
            v-if="isOpen"
            class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border"
          >
            <!-- Header -->
            <div class="bg-blue-600 text-white p-4 rounded-t-lg">
              <p class="font-semibold">Jittranuch Pratoomwong</p>
              <p class="text-sm bg-yellow-400 text-black inline-block px-2 py-1 rounded mt-1">
                You are our Bronze Priority
              </p>
            </div>

            <!-- Menu -->
            <div class="p-2">
              <button class="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded">
                👤 Edit Profile
              </button>

              <button class="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded">
                📅 My Booking
              </button>

              <button class="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded text-red-500">
                ⏻ Log Out
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}
</script>
