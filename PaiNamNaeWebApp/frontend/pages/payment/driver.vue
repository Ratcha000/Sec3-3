<template>
   <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900"> ตรวจสอบการชำระเงิน</h1>
            <p class="text-gray-600 mt-2 text-sm md:text-base">ยืนยันหรือปฏิเสธการชำระเงินจากผู้โดยสาร</p>
          </div>
          
          <!--  QR Code Management Button -->
          <NuxtLink 
            to="/driver/qrCode"
            class="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition whitespace-nowrap"
          >
            <span class="text-lg"></span>
            <span class="hidden sm:inline">จัดการ QR Code</span>
            <span class="sm:hidden">QR Code</span>
          </NuxtLink>
        </div>
      </div>
    </div>
    

    <div class="max-w-6xl mx-auto px-4">
      <!-- ✅ Error Message -->
      <div v-if="error" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p class="font-semibold">❌ {{ error }}</p>
      </div>

      <!-- ✅ Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p class="text-gray-600">กำลังโหลดรายการรอตรวจสอบ...</p>
        </div>
      </div>

      <!-- ✅ Empty State -->
      <div v-else-if="pendingPayments.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <div class="text-6xl mb-4"></div>
        <p class="text-gray-500 text-lg">ไม่มีรายการที่รอตรวจสอบ</p>
        <p class="text-gray-400 text-sm mt-2">การชำระเงินทั้งหมดมีสถานะสมบูรณ์</p>
      </div>

      <!-- ✅ Payment Cards -->
      <div v-else class="grid grid-cols-1 gap-6">
        <div
          v-for="payment in pendingPayments"
          :key="payment.id"
          class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500"
        >
          <!-- Header -->
          <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-transparent">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-xl font-bold text-gray-900">
                   {{ payment.passenger.firstName }} {{ payment.passenger.lastName }}
                </h3>
                <p class="text-sm text-gray-600 mt-1">{{ payment.passenger.email }}</p>
              </div>
              <div class="text-right">
                <p class="text-4xl font-bold text-green-600">{{ payment.amount }} ฿</p>
                <span class="inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                   รอตรวจสอบ
                </span>
              </div>
            </div>
          </div>

          <!-- Route Info -->
          <div v-if="payment.booking?.route" class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600 font-semibold">📍 จากต้น</p>
                <p class="text-lg font-bold text-gray-900">{{ payment.booking.route.startLocation }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 font-semibold">📍 ปลายทาง</p>
                <p class="text-lg font-bold text-gray-900">{{ payment.booking.route.endLocation }}</p>
              </div>
            </div>
          </div>

          <!-- OCR Data -->
          <div v-if="payment.ocrData" class="px-6 py-4 border-b border-gray-200 bg-blue-50">
            <h4 class="font-semibold text-gray-900 mb-3"> ข้อมูลจากการอ่านสลิป</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div class="bg-white p-3 rounded border-l-4 border-blue-500">
                <p class="text-xs text-gray-600 uppercase font-bold">จำนวนเงิน</p>
                <p :class="isAmountMatch(payment) ? 'text-green-600' : 'text-red-600'" class="text-2xl font-bold">
                  {{ payment.ocrData.amount }} ฿
                </p>
              </div>
              <div class="bg-white p-3 rounded border-l-4 border-indigo-500">
                <p class="text-xs text-gray-600 uppercase font-bold">วันที่</p>
                <p class="text-lg font-bold text-gray-900">{{ payment.ocrData.date }}</p>
              </div>
              <div class="bg-white p-3 rounded border-l-4 border-purple-500">
                <p class="text-xs text-gray-600 uppercase font-bold">Reference</p>
                <p class="text-lg font-bold text-gray-900">{{ payment.ocrData.referenceNumber || '-' }}</p>
              </div>
            </div>

            <!-- Amount Check -->
            <div v-if="isAmountMatch(payment)" class="bg-green-100 border border-green-400 p-3 rounded">
              <p class="text-green-800 font-semibold"> ยอดเงินตรงกันสมบูรณ์</p>
            </div>
            <div v-else class="bg-red-100 border border-red-400 p-3 rounded">
              <p class="text-red-800 font-semibold"> ข้อเตือน: จำนวนเงินไม่ตรง</p>
              <p class="text-sm text-red-700 mt-1">
                ควรได้ {{ payment.amount }} ฿ แต่สลิปแสดง {{ payment.ocrData.amount }} ฿
              </p>
            </div>
          </div>

          <!-- Receipt Image -->
          <div v-if="payment.receiptImageUrl" class="px-6 py-4 border-b border-gray-200">
            <h4 class="font-semibold text-gray-900 mb-3"> รูปสลิป</h4>
            
            <div class="flex flex-col md:flex-row gap-4">
              <img 
                :src="payment.receiptImageUrl" 
                alt="Receipt"
                @click="openReceiptModal(payment.receiptImageUrl)"
                class="w-full md:w-64 h-80 object-cover rounded-lg border-2 border-gray-300 hover:border-blue-500 cursor-pointer transition"
              />
              <div class="flex-1">
                <button
                  @click="openReceiptModal(payment.receiptImageUrl)"
                  class="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                >
                   ดูขนาดใหญ่
                </button>

                <div class="bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
                  <p class="text-sm font-semibold text-yellow-900 mb-2">✓ ตรวจสอบ:</p>
                  <ul class="text-sm text-yellow-800 space-y-2">
                    <li class="flex items-center">
                      <span class="w-4 h-4 bg-yellow-400 rounded-full mr-2"></span>
                      ชื่อธนาคารตรงกับ QR Code
                    </li>
                    <li class="flex items-center">
                      <span class="w-4 h-4 bg-yellow-400 rounded-full mr-2"></span>
                      จำนวนเงินตรงกับการจองขั้น
                    </li>
                    <li class="flex items-center">
                      <span class="w-4 h-4 bg-yellow-400 rounded-full mr-2"></span>
                      บัญชีชื่อปลายทาง (Prompt Pay)
                    </li>
                    <li class="flex items-center">
                      <span class="w-4 h-4 bg-yellow-400 rounded-full mr-2"></span>
                      วันที่ตรงกับการชำระ
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- No Receipt Warning -->
          <div v-else class="px-6 py-4 border-b border-gray-200 bg-orange-50">
            <p class="text-orange-800"> ยังไม่มีรูปสลิป</p>
          </div>

          <!-- Action Buttons -->
          <div class="px-6 py-4 bg-gray-50 flex gap-3">
            <button
              @click="openVerificationModal(payment, 'approved')"
              :disabled="isSubmitting === payment.id"
              class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              <span v-if="isSubmitting !== payment.id"> ยืนยันการชำระ</span>
              <span v-else> กำลังบันทึก...</span>
            </button>
            <button
              @click="openVerificationModal(payment, 'rejected')"
              :disabled="isSubmitting === payment.id"
              class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              <span v-if="isSubmitting !== payment.id"> ปฏิเสธการชำระ</span>
              <span v-else> กำลังบันทึก...</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ Receipt Modal -->
    <div v-if="showReceiptModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div class="relative max-w-2xl w-full mx-4">
        <button
          @click="showReceiptModal = false"
          class="absolute -top-10 right-0 text-white hover:text-gray-300 text-3xl font-bold"
        >
          ✕
        </button>
        <div class="bg-white rounded-lg overflow-hidden">
          <img :src="selectedReceiptUrl" alt="สลิป" class="w-full h-auto object-contain" />
        </div>
      </div>
    </div>

    <!-- ✅ Verification Modal -->
    <div v-if="showVerificationModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <!-- Header -->
        <div :class="verificationStatus === 'approved' ? 'bg-green-50' : 'bg-red-50'" class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-bold" :class="verificationStatus === 'approved' ? 'text-green-900' : 'text-red-900'">
            {{ verificationStatus === 'approved' ? ' ยืนยันการชำระ' : ' ปฏิเสธการชำระ' }}
          </h2>
        </div>

        <!-- Body -->
        <div class="p-6">
          <div v-if="selectedPayment" class="mb-6 p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">ผู้โดยสาร</p>
            <p class="font-bold text-gray-900">{{ selectedPayment.passenger.firstName }} {{ selectedPayment.passenger.lastName }}</p>
            <p class="text-2xl font-bold text-green-600 mt-2">{{ selectedPayment.amount }} ฿</p>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              {{ verificationStatus === 'approved' ? 'หมายเหตุ (ไม่บังคับ)' : 'เหตุผลการปฏิเสธ' }}
            </label>
            <textarea
              v-model="verificationNote"
              :placeholder="verificationStatus === 'approved' 
                ? 'ระบุหมายเหตุ (ตัวอย่าง: สลิปตรวจสอบเรียบร้อย)' 
                : 'ระบุเหตุผลการปฏิเสธ...'"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              :class="verificationStatus === 'approved' ? 'focus:ring-green-500' : 'focus:ring-red-500'"
            ></textarea>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button
            @click="showVerificationModal = false"
            :disabled="isSubmitting === selectedPayment?.id"
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            @click="handleVerification"
            :disabled="isSubmitting === selectedPayment?.id"
            :class="verificationStatus === 'approved' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-red-600 hover:bg-red-700'"
            class="flex-1 px-4 py-2 text-white font-semibold rounded-lg disabled:opacity-50 transition"
          >
            <span v-if="isSubmitting !== selectedPayment?.id">
              {{ verificationStatus === 'approved' ? ' ยืนยัน' : ' ปฏิเสธ' }}
            </span>
            <span v-else> กำลังบันทึก...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: 'auth'
})

const router = useRouter()
const { $api } = useNuxtApp()

// State
const isLoading = ref(false)
const error = ref('')
const payments = ref([])
const isSubmitting = ref(null)

// Receipt Modal
const showReceiptModal = ref(false)
const selectedReceiptUrl = ref('')

// Verification Modal
const showVerificationModal = ref(false)
const selectedPayment = ref(null)
const verificationStatus = ref(null)
const verificationNote = ref('')

// Computed
const pendingPayments = computed(() => {
  return payments.value.filter(p => p.status === 'completed' && p.verificationStatus === 'pending')
})

// ดึงข้อมูล Payments
const fetchDriverPayments = async () => {
  try {
    isLoading.value = true
    error.value = ''

    const response = await $api('/payments/driver/list', {
      query: {
        status: 'completed',
        verificationStatus: 'pending'
      }
    })

    payments.value = response.payments || []
  } catch (err) {
    error.value = err.data?.message || 'ไม่สามารถดึงข้อมูลได้'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

// Modal: Receipt
const openReceiptModal = (url) => {
  selectedReceiptUrl.value = url
  showReceiptModal.value = true
}

// Modal: Verification
const openVerificationModal = (payment, status) => {
  selectedPayment.value = payment
  verificationStatus.value = status
  verificationNote.value = ''
  showVerificationModal.value = true
}

// ยืนยัน/ปฏิเสธการชำระ
const handleVerification = async () => {
  if (!selectedPayment.value) return

  isSubmitting.value = selectedPayment.value.id

  try {
    await $api(
      `/payments/${selectedPayment.value.id}/verify`,
      {
        method: 'PATCH',
        body: {
          verificationStatus: verificationStatus.value,
          verificationNote: verificationNote.value
        }
      }
    )

    const msg = verificationStatus.value === 'approved'
      ? `ยืนยันการชำระ ${selectedPayment.value.amount} ฿ สำเร็จแล้ว`
      : 'ปฏิเสธการชำระเงินสำเร็จแล้ว'

    alert(msg)
    showVerificationModal.value = false
    await fetchDriverPayments()
  } catch (err) {
    alert(err.data?.message || 'เกิดข้อผิดพลาด')
  } finally {
    isSubmitting.value = null
  }
}

// ตรวจสอบจำนวนเงินตรงกัน
const isAmountMatch = (payment) => {
  return payment.ocrData?.amount === payment.amount
}

onMounted(() => {
  fetchDriverPayments()
})
</script>

<style scoped>
</style>