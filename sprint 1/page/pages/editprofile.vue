<template>
  <div class="edit-profile-page">
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
                <h3 class="dropdown-user-name">Jkttranuch Pratoomwong</h3>
                <button class="bronze-badge">
                  <svg class="icon-xs" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  You're our Bonze Priority
                  <svg class="icon-xs icon-ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div class="dropdown-content">
                <a href="#" class="dropdown-item" @click.prevent="isDropdownOpen = false">
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
            <!-- Profile Header -->
            <div class="profile-header">
              <div class="profile-name">Jittranuch Pratoomwong</div>
              <div class="profile-badge">
                <svg class="icon-xs" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                You're our Bonze Priority
              </div>
            </div>

            <!-- Navigation Menu -->
            <nav class="nav-menu">
              <a href="#" :class="activeMenu === 'edit-profile' ? 'nav-item-active' : 'nav-item'" @click.prevent="activeMenu = 'edit-profile'">
                <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Edit Profile</span>
              </a>

              <a href="#" :class="activeMenu === 'my-booking' ? 'nav-item-active' : 'nav-item'" @click.prevent="activeMenu = 'my-booking'">
                <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>My Booking</span>
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

        <!-- Settings Content -->
        <main class="settings-content">
          <div class="settings-card">
            <h2 class="settings-title">Settings</h2>

            <!-- Personal Data Form -->
            <div class="form-container">
              <h3 class="form-section-title">Personal Data</h3>

              <div class="form-grid">
                <!-- Full Name -->
                <div class="form-group full-width">
                  <label class="form-label">Full Name</label>
                  <input v-model="formData.fullName" type="text" class="form-input" placeholder="Enter your full name">
                </div>

                <!-- Gender -->
                <div class="form-group">
                  <label class="form-label">Gender</label>
                  <select v-model="formData.gender" class="form-input">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <!-- Birthday -->
                <div class="form-group">
                  <label class="form-label">Birthday</label>
                  <input v-model="formData.birthday" type="date" class="form-input">
                </div>

                <!-- National Identification Card -->
                <div class="form-group full-width">
                  <label class="form-label">National Identification Card</label>
                  <input v-model="formData.nationalId" type="text" class="form-input" placeholder="X-XXXX-XXXXX-XX-X">
                </div>

                <!-- Mobile Number -->
                <div class="form-group">
                  <label class="form-label">Mobile Number</label>
                  <input v-model="formData.mobileNumber" type="tel" class="form-input" placeholder="+66 XX XXX XXXX">
                </div>

                <!-- Email -->
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input v-model="formData.email" type="email" class="form-input" placeholder="your.email@example.com">
                </div>
              </div>
            </div>

            <!-- Delete Account Button -->
            <button class="delete-account-btn">
              <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete Account</span>
            </button>

            <!-- Save Button -->
            <div class="save-button-wrapper">
              <button @click="saveSettings" class="save-button">
                Save
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Overlay for dropdown -->
    <div v-if="isDropdownOpen" @click="closeDropdown" class="dropdown-overlay"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isDropdownOpen = ref(false)
const activeMenu = ref('edit-profile')

const formData = ref({
  fullName: '',
  gender: '',
  birthday: '',
  nationalId: '',
  mobileNumber: '',
  email: ''
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const saveSettings = () => {
  console.log('Settings saved:', formData.value)
  alert('✓ Settings saved successfully!')
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

/* Icon utility classes */
.icon-xs {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.icon-sm {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.icon-blue {
  color: #4A90E2;
}

.icon-ml-auto {
  margin-left: auto;
}

/* Page Container */
.edit-profile-page {
  min-height: 100vh;
  background: #f5f7fa;
  font-size: 14px;
}

/* Header */
.header {
  background: #4A7FB8;
  color: white;
  padding: 0.6rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* User Dropdown */
.user-dropdown-wrapper {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 6px;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-button:hover {
  background: rgba(255, 255, 255, 0.25);
}

.user-name {
  font-size: 0.8rem;
}

.dropdown-arrow {
  width: 14px;
  height: 14px;
  transition: transform 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 260px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 1000;
}

.dropdown-header {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  padding: 1rem 1.25rem;
  color: white;
}

.dropdown-user-name {
  font-size: 0.82rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
}

.bronze-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.375rem 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: white;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.dropdown-content {
  padding: 0.5rem 0;
  background: #ffffff;
}

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

.dropdown-item:hover {
  background: #f8f9fa;
  padding-left: 1.5rem;
}

.dropdown-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 999;
}

/* Dropdown Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

/* Main Container */
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.profile-header {
  background: #4A7FB8;
  padding: 1rem;
  color: white;
}

.profile-name {
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.profile-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  font-size: 0.65rem;
  font-weight: 600;
}

/* Navigation Menu */
.nav-menu {
  padding: 0.375rem 0;
}

.nav-item,
.nav-item-active {
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

.nav-item:hover {
  background: #f8f9fa;
}

.nav-item-active {
  background: #e7f3ff;
  color: #4A7FB8;
  font-weight: 600;
  border-left: 3px solid #4A7FB8;
}

/* Settings Content */
.settings-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.settings-title {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.25rem;
}

/* Form Container */
.form-container {
  border: 1.5px solid #4A90E2;
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
}

.form-section-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.73rem;
  font-weight: 600;
  color: #6c757d;
}

.form-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #495057;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.form-input::placeholder {
  color: #adb5bd;
}

/* Delete Account Button */
.delete-account-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  color: #dc3545;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-account-btn:hover {
  background: #fff5f5;
  border-color: #dc3545;
}

/* Save Button */
.save-button-wrapper {
  margin-top: 1.25rem;
  display: flex;
  justify-content: flex-end;
}

.save-button {
  padding: 0.5rem 2rem;
  background: #4A7FB8;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(74, 127, 184, 0.3);
}

.save-button:hover {
  background: #3d6a9e;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(74, 127, 184, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>