<template>
  <div>
    <AdminHeader />
    <AdminSidebar />

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

    <main id="main-content" class="main-content mt-16 ml-0 lg:ml-[280px] p-6">
      <div class="mx-auto max-w-8xl">

        <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 class="text-2xl font-semibold text-gray-800">
            Report Management
          </h1>
        </div>

        <div class="bg-white border border-gray-300 rounded-lg shadow-sm">

          <!-- Pagination Header -->
          <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 sm:px-6">
            <div class="text-sm text-gray-600">
              หน้าที่ {{ pagination.page }} / {{ pagination.pages || 1 }} • ทั้งหมด {{ pagination.total }} รายการ
            </div>
          </div>

          <!-- Loading -->
          <div v-if="isLoading" class="p-8 text-center text-gray-500">
            กำลังโหลดข้อมูล...
          </div>

          <!-- Empty -->
          <div v-else-if="!reports.length" class="p-10 text-center text-gray-400">
            ไม่มีรายงานในขณะนี้
          </div>

          <!-- Table -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-xs text-left text-gray-500 uppercase">ผู้รายงาน</th>
                  <th class="px-4 py-3 text-xs text-left text-gray-500 uppercase">ผู้ถูกรายงาน</th>
                  <th class="px-4 py-3 text-xs text-left text-gray-500 uppercase">หมวดหมู่</th>
                  <th class="px-4 py-3 text-xs text-left text-gray-500 uppercase">รายละเอียด</th>
                  <th class="px-4 py-3 text-xs text-left text-gray-500 uppercase">การดำเนินการ</th>
                  <th class="px-4 py-3 text-xs text-left text-gray-500 uppercase">สถานะ</th>
                </tr>
              </thead>

              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="report in reports" :key="report.id" class="hover:bg-gray-50">

                  <!-- Reporter -->
                  <td class="px-4 py-3">
                    {{ report.reporter?.firstName }}
                  </td>

                  <!-- Reported -->
                  <td class="px-4 py-3">
                    {{ report.reportedUser?.firstName }}
                  </td>

                  <td class="px-4 py-3">
                    {{ report.category }}
                  </td>

                  <td class="px-4 py-3 max-w-xs">
                    <div class="bg-gray-50 rounded-lg px-3 py-2 text-sm text-red-500 break-words">
                      {{ report.description }}
                    </div>
                  </td>

                  <!-- Select -->
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

                  <!-- Save / Badge -->
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

          <!-- Pagination Footer -->
          <div class="flex justify-between px-4 py-4 border-t border-gray-200 sm:px-6">
            <button
              class="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50"
              :disabled="pagination.page <= 1 || isLoading"
              @click="fetchReports(pagination.page - 1)"
            >
              ย้อนกลับ
            </button>

            <span class="px-4 py-1 text-sm font-medium border rounded-md bg-blue-50 text-blue-600">
              {{ pagination.page }}
            </span>

            <button
              class="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50"
              :disabled="pagination.page >= pagination.pages || isLoading"
              @click="fetchReports(pagination.page + 1)"
            >
              ถัดไป
            </button>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRuntimeConfig, useCookie } from '#app'
import axios from 'axios'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'

definePageMeta({ middleware: ['admin-auth'] })

const reports = ref([])
const isLoading = ref(false)

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
  pages: 1
})

const showToast = ref(false)
const toastMessage = ref('')

const fetchReports = async (page = 1) => {
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
        params: { page, limit: pagination.limit }
      }
    )

    const data = res.data

    reports.value = (data.data || []).map(r => ({
      ...r,
      action: 'normal',
      reviewed: false
    }))

    pagination.page = data.pagination?.page || 1
    pagination.pages = data.pagination?.pages || 1
    pagination.total = data.pagination?.total || 0

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

    report.reviewed = true

    toastMessage.value = 'บันทึกสำเร็จ'
    showToast.value = true
    setTimeout(() => showToast.value = false, 2500)

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

onMounted(() => fetchReports(1))
</script>

<style scoped>
.main-content { transition: margin-left 0.3s ease; }

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