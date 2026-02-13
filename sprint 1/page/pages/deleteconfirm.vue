<template>
  <div class="delete-account-page">
    <!-- Header -->
    <header class="header">
      <div class="header-container">
        <div class="header-left">
          <span class="breadcrumb">PaiNamNae</span>
        </div>

        <!-- User Dropdown Button -->
        <div class="user-dropdown-wrapper">
          <button @click="toggleDropdown" class="user-button">
            <svg class="icon-sm" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            <span class="user-name">Jittranuch</span>
            <svg class="dropdown-arrow" :class="{ 'rotate-180': isDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <transition name="dropdown">
            <div v-if="isDropdownOpen" class="dropdown-menu">
              <div class="dropdown-header">
                <h3 class="dropdown-user-name">Jittranuch Pratoomwong</h3>
                <button class="bronze-badge">
                  <svg class="icon-xs" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  You're our Bronze Priority
                  <svg class="icon-xs icon-ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div class="dropdown-content">
                <a href="/editprofile" class="dropdown-item">
                  <svg class="icon-sm icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Edit Profile</span>
                </a>
                <a href="#" class="dropdown-item">
                  <svg class="icon-sm icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>My Booking</span>
                </a>
                <a href="#" class="dropdown-item">
                  <svg class="icon-sm icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Log Out</span>
                </a>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="main-container">
      <div class="content-wrapper">

        <!-- Sidebar -->
        <aside class="sidebar">
          <div class="sidebar-card">
            <div class="profile-header">
              <div class="profile-name">Jittranuch Pratoomwong</div>
              <div class="profile-badge">
                <svg class="icon-xs" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                You're our Bronze Priority
              </div>
            </div>
            <nav class="nav-menu">
              <a href="/editprofile" class="nav-item">
                <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Edit Profile</span>
              </a>
              <a href="#" class="nav-item">
                <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>My Booking</span>
              </a>
              <a href="#" class="nav-item nav-item-active">
                <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete Account</span>
              </a>
              <a href="#" class="nav-item">
                <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Log Out</span>
              </a>
            </nav>
          </div>
        </aside>

        <!-- Main Card -->
        <main class="settings-content">
          <div class="settings-card">
            <h2 class="settings-title">Delete Account</h2>

            <!-- Warning Banner -->
            <div class="warning-banner">
              <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <span>Deleting your account is permanent and cannot be undone. All your data will be removed.</span>
            </div>

            <!-- Upload ID Section -->
            <div class="form-container">
              <p class="upload-instruction">Please attach a copy of your National ID card.</p>

              <!-- Upload Box -->
              <div
                class="upload-box"
                :class="{ 'upload-box-dragover': isDragging, 'upload-box-filled': previewUrl }"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                @click="triggerFileInput"
              >
                <!-- Preview -->
                <img v-if="previewUrl" :src="previewUrl" alt="ID preview" class="upload-preview" />

                <!-- Placeholder -->
                <div v-else class="upload-placeholder">
                  <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="upload-text">Click or drag & drop to upload</p>
                  <p class="upload-subtext">PNG, JPG up to 10MB</p>
                </div>

                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="file-input-hidden"
                  @change="handleFileChange"
                />
              </div>

              <!-- File name display -->
              <div v-if="fileName" class="file-name-display">
                <svg class="icon-xs icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ fileName }}</span>
                <button class="remove-file-btn" @click.stop="removeFile">✕</button>
              </div>
            </div>

            <!-- Notes -->
            <div class="upload-notes">
              <p>*Please upload a clear photo of your National ID card.</p>
              <p>*The image must not be blurry, overexposed, or too dark.</p>
              <p>*Ensure that all details are clearly visible and not cropped.</p>
            </div>

            <!-- Actions -->
            <div class="action-row">
              <a href="/editprofile" class="cancel-btn">Cancel</a>
              <button class="confirm-btn" @click="handleConfirm">Confirm</button>
            </div>
          </div>
        </main>

      </div>
    </div>

    <!-- Overlay -->
    <div v-if="isDropdownOpen" @click="closeDropdown" class="dropdown-overlay"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isDropdownOpen = ref(false)
const isDragging = ref(false)
const previewUrl = ref(null)
const fileName = ref('')
const fileInput = ref(null)

const toggleDropdown = () => { isDropdownOpen.value = !isDropdownOpen.value }
const closeDropdown = () => { isDropdownOpen.value = false }

const triggerFileInput = () => { fileInput.value?.click() }

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) loadFile(file)
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) loadFile(file)
}

const loadFile = (file) => {
  fileName.value = file.name
  const reader = new FileReader()
  reader.onload = (e) => { previewUrl.value = e.target.result }
  reader.readAsDataURL(file)
}

const removeFile = () => {
  previewUrl.value = null
  fileName.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

const handleConfirm = () => {
  if (!previewUrl.value) {
    alert('Please upload a copy of your National ID card before confirming.')
    return
  }
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    alert('Account deletion request submitted.')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Nunito', sans-serif;
}

/* Icon utilities */
.icon-xs { width: 14px; height: 14px; flex-shrink: 0; }
.icon-sm  { width: 16px; height: 16px; flex-shrink: 0; }
.icon-blue { color: #4A90E2; }
.icon-ml-auto { margin-left: auto; }

/* Page */
.delete-account-page {
  min-height: 100vh;
  background: #f5f7fa;
  font-size: 14px;
}

/* Header */
.header {
  background: #4A7FB8;
  color: white;
  padding: 0.6rem 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.breadcrumb {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.8);
  font-weight: 500;
}

/* User button */
.user-dropdown-wrapper { position: relative; }
.user-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 6px;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.user-button:hover { background: rgba(255,255,255,0.25); }
.user-name { font-size: 0.8rem; }
.dropdown-arrow { width: 14px; height: 14px; transition: transform 0.3s ease; }
.rotate-180 { transform: rotate(180deg); }

/* Dropdown */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 260px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.12);
  overflow: hidden;
  z-index: 1000;
}
.dropdown-header {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  padding: 1rem 1.25rem;
  color: white;
}
.dropdown-user-name { font-size: 0.82rem; font-weight: 700; margin-bottom: 0.6rem; }
.bronze-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.375rem 0.75rem;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 6px;
  color: white;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}
.dropdown-content { padding: 0.5rem 0; }
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1.25rem;
  color: #495057;
  font-weight: 500;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.2s ease;
}
.dropdown-item:hover { background: #f8f9fa; padding-left: 1.5rem; }
.dropdown-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.2); z-index: 999; }

/* Transitions */
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px) scale(0.96); }

/* Layout */
.main-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
}
.content-wrapper {
  display: grid;
  grid-template-columns: 210px 1fr;
  gap: 1.5rem;
}

/* Sidebar */
.sidebar-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.profile-header {
  background: #4A7FB8;
  padding: 1rem;
  color: white;
}
.profile-name { font-size: 0.8rem; font-weight: 700; margin-bottom: 0.5rem; }
.profile-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.5rem;
  background: rgba(255,255,255,0.2);
  border-radius: 5px;
  font-size: 0.65rem;
  font-weight: 600;
}
.nav-menu { padding: 0.375rem 0; }
.nav-item, .nav-item-active {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1rem;
  color: #495057;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}
.nav-item:hover { background: #f8f9fa; }
.nav-item-active {
  background: #fff0f0;
  color: #dc3545;
  font-weight: 600;
  border-left: 3px solid #dc3545;
}

/* Settings card */
.settings-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.settings-title {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
}

/* Warning banner */
.warning-banner {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  background: #fff8f0;
  border: 1px solid #ffd6a5;
  border-radius: 8px;
  color: #b45309;
  font-size: 0.78rem;
  font-weight: 500;
  margin-bottom: 1.25rem;
}

/* Form container */
.form-container {
  border: 1.5px solid #4A90E2;
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 1rem;
}
.upload-instruction {
  font-size: 0.78rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 1rem;
}

/* Upload box */
.upload-box {
  position: relative;
  border: 2px dashed #c8d8f0;
  border-radius: 8px;
  background: #f8faff;
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  overflow: hidden;
}
.upload-box:hover {
  border-color: #4A90E2;
  background: #f0f6ff;
}
.upload-box-dragover {
  border-color: #4A90E2;
  background: #e8f0fe;
  transform: scale(1.01);
}
.upload-box-filled { border-style: solid; border-color: #4A90E2; }

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  text-align: center;
}
.upload-icon {
  width: 36px;
  height: 36px;
  color: #4A90E2;
  opacity: 0.7;
}
.upload-text { font-size: 0.82rem; font-weight: 600; color: #4A90E2; }
.upload-subtext { font-size: 0.72rem; color: #adb5bd; }

.upload-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-height: 200px;
  padding: 0.5rem;
}

.file-input-hidden {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  display: none;
}

/* File name */
.file-name-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.625rem;
  font-size: 0.75rem;
  color: #495057;
}
.remove-file-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: #adb5bd;
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
  transition: color 0.2s;
}
.remove-file-btn:hover { color: #dc3545; }

/* Notes */
.upload-notes {
  margin-bottom: 1.5rem;
}
.upload-notes p {
  font-size: 0.72rem;
  color: #dc3545;
  line-height: 1.7;
}

/* Action row */
.action-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
}
.cancel-btn {
  padding: 0.5rem 1.5rem;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  color: #6c757d;
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.cancel-btn:hover { background: #f8f9fa; border-color: #adb5bd; }

.confirm-btn {
  padding: 0.5rem 2rem;
  background: #dc3545;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(220,53,69,0.3);
}
.confirm-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(220,53,69,0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .content-wrapper { grid-template-columns: 1fr; }
}
</style>