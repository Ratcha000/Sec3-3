<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">รายการชำระเงิน</h1>
        <p class="text-gray-600 mt-2">จัดการการชำระเงินสำหรับการเดินทางของคุณ</p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-300 rounded-lg p-6 mb-6">
        <h3 class="text-red-900 font-semibold mb-2">เกิดข้อผิดพลาด</h3>
        <p class="text-red-700">{{ error }}</p>
        <button 
          @click="fetchPassengerPayments"
          class="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          ลองใหม่
        </button>
      </div>

      <!-- No Data -->
      <div v-else-if="payments.length === 0" class="text-center py-16">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-receipt text-3xl text-gray-400"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">ไม่มีรายการชำระเงิน</h3>
        <p class="text-gray-600">คุณยังไม่มีรายการชำระเงินในระบบ</p>
      </div>

      <!-- Payments List -->
      <div v-else class="space-y-6">
        <div v-for="payment in payments" :key="payment.id" class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ payment.booking?.route?.startLocation || 'N/A' }} → {{ payment.booking?.route?.endLocation || 'N/A' }}
                </h3>
                <p class="text-sm text-gray-600">
                  วันที่: {{ formatDate(payment.booking?.route?.departureTime) }}
                </p>
                <p class="text-sm text-gray-500">
                  ระยะทาง: {{ payment.booking?.route?.distance || 'N/A' }} | 
                  ระยะเวลา: {{ payment.booking?.route?.duration || 'N/A' }}
                </p>
              </div>
              <div class="text-right">
                <span class="text-2xl font-bold text-gray-900">{{ payment.amount }} ฿</span>
                <div class="mt-1">
                  <span :class="getStatusDisplay(payment.status).class" class="px-3 py-1 text-sm font-medium rounded-full">
                    {{ getStatusDisplay(payment.status).text }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Details -->
          <div class="px-6 py-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-sm text-gray-600">คนขับ</p>
                <p class="font-medium">{{ payment.driver?.firstName || 'N/A' }} {{ payment.driver?.lastName || '' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">วิธีการชำระ</p>
                <p class="font-medium">{{ payment.paymentMethod || 'ยังไม่เลือก' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">ราคาต่อที่นั่ง</p>
                <p class="font-medium">{{ payment.booking?.route?.pricePerSeat || 0 }} ฿</p>
              </div>
            </div>

            <!-- OCR Data (if available) -->
            <div v-if="payment.ocrData" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-2">ข้อมูลจากการอ่านสลิป</h4>
              <div class="text-sm text-gray-700">
                <p>จำนวนเงิน: {{ payment.ocrData.amount }} ฿</p>
                <p v-if="payment.ocrData.referenceNumber">อ้างอิง: {{ payment.ocrData.referenceNumber }}</p>
                <p v-if="payment.ocrData.date">วันที่: {{ payment.ocrData.date }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
            <!-- Pay Button (only when pending and amount > 0) -->
            <button
              v-if="payment.status === 'pending' && payment.amount > 0"
              @click="openPaymentModal(payment)"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              ชำระเงิน
            </button>

            <!-- Free message (when amount = 0) -->
            <div v-else-if="payment.amount === 0" class="flex-1 bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-lg text-center">
              ไม่มีค่าใช้จ่าย (ฟรี)
            </div>

            <!-- View Receipt Button -->
            <button
              v-if="payment.receiptImageUrl"
              @click="openReceipt(payment.receiptImageUrl)"
              class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              ดูสลิป
            </button>

            <!-- Status info -->
            <div v-else class="flex-1"></div>
          </div>
        </div>
      </div>

      <!-- Payment Modal -->
      <PaymentQRModal
        :is-open="showPaymentModal"
        :payment="selectedPayment"
        @close="handleCloseModal"
        @upload="handleUploadReceipt"
        @cash-payment="handleCashPayment"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import PaymentQRModal from '~/components/Payment/PaymentQRModal.vue'

definePageMeta({ 
  middleware: 'auth'
})

const { $api } = useNuxtApp()
const { user, token, logout } = useAuth()

// State
const payments = ref([])
const isLoading = ref(false)
const error = ref('')
const showPaymentModal = ref(false)
const selectedPayment = ref(null)

// ✅ แก้ไข: ตรวจสอบ Response Structure แบบละเอียด
const fetchPassengerPayments = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    console.log('🔍 Debug info:')
    console.log('- Current user:', user.value)
    console.log('- Token exists:', !!token.value)
    
    if (!user.value || !token.value) {
      error.value = 'ไม่พบข้อมูล authentication'
      return
    }
    
    console.log('📡 Calling API: /payments/passenger')
    
    const response = await $api('/payments/passenger')
    
    // ✅ Debug response structure แบบละเอียด
    console.log('✅ Raw response:', response)
    console.log('✅ Response type:', typeof response)
    console.log('✅ Response keys:', response ? Object.keys(response) : 'null')
    
    // ✅ ตรวจสอบทุกรูปแบบที่เป็นไปได้
    let paymentData = []
    
    if (Array.isArray(response)) {
      // กรณี 1: response เป็น array โดยตรง
      console.log('📦 Case 1: response is array')
      paymentData = response
    } else if (response && Array.isArray(response.data)) {
      // กรณี 2: response = { data: [...], message: '...' }
      console.log('📦 Case 2: response.data is array')
      paymentData = response.data
    } else if (response && Array.isArray(response.payments)) {
      // กรณี 3: response = { payments: [...] }
      console.log('📦 Case 3: response.payments is array')
      paymentData = response.payments
    } else if (response && response.data && Array.isArray(response.data.data)) {
      // กรณี 4: double wrapped - { data: { data: [...] } }
      console.log('📦 Case 4: response.data.data is array')
      paymentData = response.data.data
    } else {
      console.log('⚠️ Unknown response structure:', JSON.stringify(response, null, 2))
    }
    
    console.log('✅ Final paymentData:', paymentData)
    console.log('✅ Final paymentData length:', paymentData.length)
    
    payments.value = paymentData
    
  } catch (err) {
    console.error('❌ Fetch payments error:', err)
    console.error('❌ Error details:', {
      status: err.status,
      statusCode: err.statusCode,
      message: err.message,
      data: err.data
    })
    
    if (err.status === 401 || err.statusCode === 401) {
      error.value = 'Session หมดอายุ กรุณา login ใหม่'
      await logout()
      await navigateTo('/auth/login')
    } else if (err.status === 404 || err.statusCode === 404) {
      error.value = 'ไม่พบ API Endpoint'
    } else {
      error.value = err.data?.message || err.message || 'ไม่สามารถโหลดข้อมูลได้'
    }
  } finally {
    isLoading.value = false
  }
}

// Handle payment modal
const openPaymentModal = (payment) => {
  selectedPayment.value = payment
  showPaymentModal.value = true
}

const handleCloseModal = () => {
  showPaymentModal.value = false
  selectedPayment.value = null
}

// ✅ แก้ไข: เปิด receipt ใน tab ใหม่
const openReceipt = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}

// Handle cash payment
const handleCashPayment = async (cashData) => {
  try {
    console.log('💵 Processing cash payment:', cashData)
    
    const response = await $api(`/payments/${cashData.paymentId}/cash-confirm`, {
      method: 'POST',
      body: { method: 'cash' }
    })
    
    console.log('✅ Cash payment response:', response)
    
    handleCloseModal()
    await fetchPassengerPayments()
    
  } catch (err) {
    console.error('❌ Cash payment error:', err)
    error.value = err.data?.message || 'ไม่สามารถยืนยันการชำระเงินสดได้'
  }
}

// Handle receipt upload
const handleUploadReceipt = async (uploadData) => {
  try {
    console.log('📤 Uploading receipt:', uploadData)
    
    const formData = new FormData()
    formData.append('receipt', uploadData.file)
    formData.append('amount', uploadData.amount)
    formData.append('referenceNumber', uploadData.referenceNumber || '')
    
    const response = await $api(`/payments/${selectedPayment.value.id}/upload-receipt`, {
      method: 'POST',
      body: formData
    })
    
    console.log('✅ Upload receipt response:', response)
    
    handleCloseModal()
    await fetchPassengerPayments()
    
  } catch (err) {
    console.error('❌ Upload receipt error:', err)
    error.value = err.data?.message || 'ไม่สามารถอัปโหลดสลิปได้'
  }
}

// Format date
const formatDate = (date) => {
  if (!date) return 'ไม่ระบุ'
  
  try {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return 'ไม่ระบุ'
  }
}

// Get status display
const getStatusDisplay = (status) => {
  const statusMap = {
    'pending': { text: 'รอชำระเงิน', class: 'bg-yellow-100 text-yellow-800' },
    'completed': { text: 'รอการยืนยัน', class: 'bg-blue-100 text-blue-800' },
    'cash_pending': { text: 'รอยืนยันเงินสด', class: 'bg-orange-100 text-orange-800' },
    'verified': { text: 'ชำระเรียบร้อย', class: 'bg-green-100 text-green-800' },
    'rejected': { text: 'ถูกปฏิเสธ', class: 'bg-red-100 text-red-800' }
  }
  return statusMap[status] || { text: status || 'ไม่ทราบ', class: 'bg-gray-100 text-gray-800' }
}

// Mount
onMounted(async () => {
  console.log('🚀 Component mounted')
  console.log('🚀 User:', user.value)
  await fetchPassengerPayments()
})
</script>

<style scoped>
</style>