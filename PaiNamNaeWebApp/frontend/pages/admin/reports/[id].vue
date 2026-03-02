<template>
  <div class="p-6">
    <h1 class="mb-6 text-2xl font-bold">Report Detail</h1>

    <div v-if="report" class="p-6 bg-white rounded shadow">
      <p><strong>ผู้รายงาน:</strong> {{ report.reporter.email }}</p>
      <p><strong>ผู้ถูกรายงาน:</strong> {{ report.reportedUser.email }}</p>
      <p><strong>รายละเอียด:</strong> {{ report.description }}</p>

      <div class="mt-6 space-x-3">
        <button @click="blacklist"
          class="px-4 py-2 text-white bg-red-600 rounded">
          Blacklist
        </button>

        <button @click="warn"
          class="px-4 py-2 text-white bg-yellow-500 rounded">
          Warning
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const route = useRoute()
const report = ref(null)

const fetchDetail = async () => {
  const res = await axios.get(`/reports/${route.params.id}`)
  report.value = res.data.data
}

const blacklist = async () => {
  await axios.patch(`/reports/${route.params.id}/review`, {
    severity: 'blacklist',
    adminNote: 'ละเมิดกฎระบบ'
  })
  alert('แบนสำเร็จ')
}

const warn = async () => {
  await axios.post(`/reports/${route.params.id}/send-warning`, {
    subject: 'คำเตือน',
    message: 'กรุณาปฏิบัติตามกฎ'
  })
  alert('ส่งคำเตือนสำเร็จ')
}

onMounted(fetchDetail)
</script>