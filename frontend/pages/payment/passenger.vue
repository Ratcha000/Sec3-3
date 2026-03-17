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
          <!-- Header with Status -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ payment.booking?.route?.startLocation?.name || 'N/A' }} 
                  → 
                  {{ payment.booking?.route?.endLocation?.name || 'N/A' }}
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
              </div>
            </div>

            <!-- ✅ Status Badge - แสดงแค่ Badge เดียว ตามสถานะปัจจุบัน -->
            <div class="flex flex-wrap gap-2">
              <!--  แสดงตามสถานะปัจจุบัน -->
              <span 
                :class="getCurrentStatusDisplay(payment).class" 
                class="px-3 py-1 text-sm font-medium rounded-full"
              >
                {{ getCurrentStatusDisplay(payment).text }}
              </span>
            </div>
          </div>

          <!-- Details Section -->
          <div class="px-6 py-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p class="text-sm text-gray-600">คนขับ</p>
                <p class="font-medium">{{ payment.driver?.firstName || 'N/A' }} {{ payment.driver?.lastName || '' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">วิธีการชำระ</p>
                <p class="font-medium">{{ getPaymentMethodDisplay(payment.paymentMethod) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">ราคาต่อที่นั่ง</p>
                <p class="font-medium">{{ payment.booking?.route?.pricePerSeat || 0 }} ฿</p>
              </div>
            </div>

            <!-- ✅ Timeline / Status Flow -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <p class="text-sm font-semibold text-gray-700 mb-3">📍 ขั้นตอนการชำระเงิน:</p>
              <div class="space-y-2 text-sm">
                <!-- Step 1: ชำระเงิน -->
                <div class="flex items-center gap-3">
                  <div :class="payment.status !== 'pending' ? 'bg-green-500' : 'bg-gray-300'" 
                    class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    ✓
                  </div>
                  <span :class="payment.status !== 'pending' ? 'text-gray-900 font-medium' : 'text-gray-600'">
                    1. ชำระเงิน
                  </span>
                  <span v-if="payment.submittedAt" class="text-gray-500 text-xs">
                    {{ formatDate(payment.submittedAt) }}
                  </span>
                </div>

                <!-- Step 2: รอการตรวจสอบจากคนขับ -->
                <div class="flex items-center gap-3">
                  <div :class="['completed', 'cash_pending', 'approved', 'rejected'].includes(payment.status) ? 'bg-green-500' : 'bg-gray-300'" 
                    class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    ✓
                  </div>
                  <span :class="['completed', 'cash_pending', 'approved', 'rejected'].includes(payment.status) ? 'text-gray-900 font-medium' : 'text-gray-600'">
                    2. รอการตรวจสอบจากคนขับ
                  </span>
                  <span v-if="['completed', 'cash_pending'].includes(payment.status) && (!payment.verificationStatus || payment.verificationStatus === 'pending')" 
                    class="animate-pulse text-gray-500 text-xs">
                     รอ...
                  </span>
                </div>

                <!-- Step 3: ยืนยันเรียบร้อย -->
                <div class="flex items-center gap-3">
                  <div :class="payment.verificationStatus === 'approved' || payment.status === 'approved' ? 'bg-green-500' : 'bg-gray-300'" 
                    class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    ✓
                  </div>
                  <span :class="payment.verificationStatus === 'approved' || payment.status === 'approved' ? 'text-gray-900 font-medium' : 'text-gray-600'">
                    3. ยืนยันเรียบร้อย
                  </span>
                  <span v-if="(payment.verificationDate || payment.updatedAt) && (payment.verificationStatus === 'approved' || payment.status === 'approved')" 
                    class="text-gray-500 text-xs">
                     {{ formatDate(payment.verificationDate || payment.updatedAt) }}
                  </span>
                </div>
              </div>
            </div>

            <!--  OCR Data -->
            <div v-if="payment.ocrData" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-2"> ข้อมูลจากการอ่านสลิป</h4>
              <div class="text-sm text-gray-700 space-y-1">
                <p> จำนวนเงิน: <span class="font-medium">{{ payment.ocrData.amount }} ฿</span></p>
                <p v-if="payment.ocrData.referenceNumber"> อ้างอิง: <span class="font-medium">{{ payment.ocrData.referenceNumber }}</span></p>
                <p v-if="payment.ocrData.date"> วันที่: <span class="font-medium">{{ payment.ocrData.date }}</span></p>
              </div>
            </div>

            <!--  Verification Note - แสดงเมื่อปฏิเสธ -->
            <div v-if="payment.verificationStatus === 'rejected' && payment.verificationNote" 
              class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 class="font-semibold text-red-900 mb-2"> หมายเหตุจากคนขับ</h4>
              <p class="text-sm text-red-700">{{ payment.verificationNote }}</p>
              <p v-if="payment.verificationDate" class="text-xs text-red-600 mt-2">
                ตรวจสอบเมื่อ: {{ formatDate(payment.verificationDate) }}
              </p>
            </div>

            <!--  Verification Success -->
            <div v-if="(payment.verificationStatus === 'approved' || payment.status === 'approved') && payment.verificationNote" 
              class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 class="font-semibold text-green-900 mb-2"> หมายเหตุจากคนขับ</h4>
              <p class="text-sm text-green-700">{{ payment.verificationNote }}</p>
              <p class="text-xs text-green-600 mt-2">
                ตรวจสอบเมื่อ: {{ formatDate(payment.verificationDate || payment.updatedAt) }}
              </p>
            </div>
          </div>

          <!-- Actions Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
            <!-- Pay Button (only when pending) -->
            <button
              v-if="payment.status === 'pending' && payment.amount > 0"
              @click="openPaymentModal(payment)"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
               ชำระเงิน
            </button>

            <!-- Free message -->
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

            <!-- Re-upload if rejected -->
            <button
              v-if="payment.verificationStatus === 'rejected' && payment.status !== 'pending'"
              @click="openPaymentModal(payment)"
              class="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
               ส่งใหม่
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

// Fetch payments
const fetchPassengerPayments = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    if (!user.value || !token.value) {
      error.value = 'ไม่พบข้อมูล authentication'
      return
    }
    
    const response = await $api('/payments/passenger')
    
    let paymentData = []
    if (Array.isArray(response)) {
      paymentData = response
    } else if (response?.data && Array.isArray(response.data)) {
      paymentData = response.data
    } else if (response?.payments && Array.isArray(response.payments)) {
      paymentData = response.payments
    }
    
    payments.value = paymentData
    console.log(' Payments loaded:', payments.value.length)
    
  } catch (err) {
    console.error(' Fetch payments error:', err)
    
    if (err.status === 401 || err.statusCode === 401) {
      error.value = 'Session หมดอายุ กรุณา login ใหม่'
      await logout()
      await navigateTo('/auth/login')
    } else {
      error.value = err.data?.message || err.message || 'ไม่สามารถโหลดข้อมูลได้'
    }
  } finally {
    isLoading.value = false
  }
}

// Handle modals
const openPaymentModal = (payment) => {
  selectedPayment.value = payment
  showPaymentModal.value = true
}

const handleCloseModal = () => {
  showPaymentModal.value = false
  selectedPayment.value = null
}

const openReceipt = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}

// Handle payments
const handleCashPayment = async (cashData) => {
  try {
    const response = await $api(`/payments/${cashData.paymentId}/cash-confirm`, {
      method: 'POST',
      body: { method: 'cash' }
    })
    
    console.log(' Cash payment confirmed:', response)
    handleCloseModal()
    await fetchPassengerPayments()
  } catch (err) {
    console.error(' Cash payment error:', err)
    error.value = err.data?.message || 'ไม่สามารถยืนยันการชำระเงินสดได้'
  }
}

const handleUploadReceipt = async (uploadData) => {
  try {
    const formData = new FormData()
    formData.append('receipt', uploadData.file)
    formData.append('amount', uploadData.amount)
    formData.append('referenceNumber', uploadData.referenceNumber || '')
    
    const response = await $api(`/payments/${selectedPayment.value.id}/upload-receipt`, {
      method: 'POST',
      body: formData
    })
    
    console.log(' Receipt uploaded:', response)
    handleCloseModal()
    await fetchPassengerPayments()
  } catch (err) {
    console.error(' Upload receipt error:', err)
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

// ✅ ฟังก์ชันใหม่ - แสดง Status ปัจจุบัน (แค่ Badge เดียว)
const getCurrentStatusDisplay = (payment) => {
  // ✅ ถ้า payment status = approved → แสดง approved
  if (payment.status === 'approved') {
    return {
      text: ' ชำระเรียบร้อย',
      class: 'bg-green-100 text-green-800'
    }
  }

  // ✅ ถ้า payment status = rejected → แสดง rejected
  if (payment.status === 'rejected') {
    return {
      text: ' ถูกปฏิเสธ',
      class: 'bg-red-100 text-red-800'
    }
  }

  // ✅ ถ้า status = cash_pending → แสดง cash_pending (ไม่สนใจ verification status)
  if (payment.status === 'cash_pending') {
    return {
      text: ' รอยืนยันเงินสด',
      class: 'bg-orange-100 text-orange-800'
    }
  }

  // ✅ ถ้า status = completed → แสดง completed (ไม่สนใจ verification status)
  if (payment.status === 'completed') {
    return {
      text: ' รอการยืนยัน',
      class: 'bg-blue-100 text-blue-800'
    }
  }

  // ✅ ถ้า status = pending → แสดง pending
  if (payment.status === 'pending') {
    return {
      text: ' รอชำระเงิน',
      class: 'bg-yellow-100 text-yellow-800'
    }
  }

  // default
  return {
    text: payment.status || 'ไม่ทราบ',
    class: 'bg-gray-100 text-gray-800'
  }
}

// ✅ Payment Method Display
const getPaymentMethodDisplay = (method) => {
  const methods = {
    'bank_transfer': ' โอนจากธนาคาร',
    'qr_code': 'QR Code Payment',
    'cash': ' เงินสด',
    'mobile_wallet': ' Mobile Wallet'
  }
  return methods[method] || method || 'ยังไม่เลือก'
}

// Mount
onMounted(async () => {
  await fetchPassengerPayments()
})
</script>

<style scoped>
</style>