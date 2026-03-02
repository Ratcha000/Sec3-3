<template>
  <!-- ✅ Toast -->
  <transition name="fade">
    <div
      v-if="showToast"
      class="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2"
    >
      <span class="text-lg">✓</span>
      {{ toastMessage }}
    </div>
  </transition>

  <div class="bg-white border border-gray-300 rounded-lg shadow-sm p-6">

    <h1 class="mb-6 text-2xl font-semibold">Report Management</h1>

    <div v-if="isLoading" class="p-8 text-center text-gray-500">
      กำลังโหลดข้อมูล...
    </div>

    <div v-else-if="!reports.length" class="text-gray-500">
      ไม่มีข้อมูลรายงาน
    </div>

    <table v-else class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">ผู้รายงาน</th>
          <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">รายงานใคร</th>
          <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">ประเภท</th>
          <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">รายละเอียด</th>
          <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">การดำเนินการ</th>
          <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">สถานะ</th>
        </tr>
      </thead>

      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="report in reports" :key="report.id">

          <td class="px-4 py-3">
            {{ report.reporter?.firstName }} ({{ report.reporter?.role }})
          </td>

          <td class="px-4 py-3">
            {{ report.reportedUser?.firstName }} ({{ report.reportedUser?.role }})
          </td>

          <td class="px-4 py-3">{{ report.category }}</td>

          <td class="px-4 py-3">{{ report.description }}</td>

          <!-- 🔥 Select -->
          <td class="px-4 py-3">
            <select
              v-model="report.action"
              :disabled="report.reviewed"
              class="border px-2 py-1 rounded disabled:bg-gray-100"
            >
              <option value="normal">ปกติ</option>
              <option value="warning">เตือน</option>
              <option value="blacklist">แบน</option>
            </select>
          </td>

          <!-- 🔥 ปุ่มหรือ Badge -->
          <td class="px-4 py-3">

            <!-- ถ้ายังไม่บันทึก -->
            <button
              v-if="!report.reviewed"
              @click="handleSave(report)"
              class="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              บันทึก
            </button>

            <!-- ถ้าบันทึกแล้ว -->
            <span
              v-else
              class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full"
              :class="{
                'bg-gray-100 text-gray-700': report.action === 'normal',
                'bg-yellow-100 text-yellow-700': report.action === 'warning',
                'bg-red-100 text-red-700': report.action === 'blacklist'
              }"
            >
              {{ actionLabel(report.action) }}
            </span>

          </td>

        </tr>
      </tbody>
    </table>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig, useCookie } from '#app'
import axios from 'axios'

const reports = ref([])
const isLoading = ref(false)

const showToast = ref(false)
const toastMessage = ref('')

const fetchReports = async () => {
  isLoading.value = true
  try {
    const config = useRuntimeConfig()
    const token =
      useCookie("token").value ||
      (process.client ? localStorage.getItem("token") : null)

    const res = await axios.get(
      `${config.public.apiBase}/reports`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 1, limit: 20 }
      }
    )

    reports.value = (res.data.data || []).map(r => ({
      ...r,
      action: 'normal',
      reviewed: false
    }))

  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const handleSave = async (report) => {
  try {
    const config = useRuntimeConfig()
    const token =
      useCookie("token").value ||
      (process.client ? localStorage.getItem("token") : null)

    const headers = { Authorization: `Bearer ${token}` }

    if (report.action === 'normal') {
      await axios.patch(
        `${config.public.apiBase}/reports/${report.id}/review`,
        { severity: null, adminNote: 'ไม่พบความผิด' },
        { headers }
      )
    }

    if (report.action === 'warning') {
      await axios.post(
        `${config.public.apiBase}/reports/${report.id}/send-warning`,
        {
          subject: 'คำเตือนจากผู้ดูแลระบบ',
          message: 'กรุณาปรับปรุงพฤติกรรม'
        },
        { headers }
      )
    }

    if (report.action === 'blacklist') {
      await axios.patch(
        `${config.public.apiBase}/reports/${report.id}/review`,
        {
          severity: 'blacklist',
          adminNote: 'แบนเนื่องจากละเมิดกฎ'
        },
        { headers }
      )
    }

    // ✅ ไม่ fetch ใหม่
    report.reviewed = true

    toastMessage.value = 'บันทึกสำเร็จ'
    showToast.value = true

    setTimeout(() => {
      showToast.value = false
    }, 2500)

  } catch (err) {
    console.error(err)
  }
}

const actionLabel = (action) => {
  if (action === 'normal') return 'ปกติ'
  if (action === 'warning') return 'เตือนแล้ว'
  if (action === 'blacklist') return 'แบนแล้ว'
  return action
}

onMounted(fetchReports)
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>