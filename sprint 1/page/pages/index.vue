<template>
  <div class="travel-page" :style="cssVars">
    <!-- Header -->
    <header class="header">
      <div class="header-container">
        <!-- Logo -->
        <div class="logo">
          
          <span class="logo-text">PaiNamNae</span>
        </div>

        <!-- Top Navigation -->

        <a href="#" class="nav-link">Bookings</a>

        <a href="#" class="nav-link">Saved</a>

        <button class="nav-link">
            <span>Support</span>
          </button>
        <nav class="top-nav">
          <button class="nav-btn">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Crect x='2' y='4' width='20' height='14' rx='2' fill='%23fff'/%3E%3Crect x='2' y='10' width='20' height='3' fill='%23ff0000'/%3E%3C/svg%3E" alt="TH" class="flag-icon">
            <span>THB | EN</span>
          </button>
          
      
          <!-- User Dropdown -->
          <div class="user-dropdown-wrapper">
            <button @click="toggleDropdown" class="user-button">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              <span class="user-name">Jittranuch Pratoomwong</span>
              <div class="points-badge">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
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
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    You're our Bonze Priority
                    <svg class="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div class="dropdown-content">
                  <a href="#" @click.prevent="navigateToEditProfile" class="dropdown-item">
                    <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Edit Profile</span>
                  </a>

                  <a href="#" class="dropdown-item">
                    <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>My Booking</span>
                  </a>

                  <a href="#" class="dropdown-item">
                    <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Log Out</span>
                  </a>
                </div>
              </div>
            </transition>
          </div>
        </nav>
      </div>

    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Book with ease, PaiNamNae for every journey</h1>

    

        <!-- Flight Search Form -->
        <div class="search-card">
          <!-- Trip Type -->
          <div class="trip-type-tabs">
            <button class="trip-type-tab trip-type-active">One-way / Round-trip</button>
          
          </div>

          <!-- Search Form -->
          <div class="search-form">
            <!-- From/To Section -->
            <div class="location-section">
              <div class="location-input-group">
                <label class="input-label">From</label>
                <div class="location-input">
                  <svg class="location-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <input type="text" value="Home" class="input-field">
                </div>
              </div>

              <button class="swap-button">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>

              <div class="location-input-group">
                <label class="input-label">To</label>
                <div class="location-input">
                  <svg class="location-icon destination" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input type="text" value="Khonkaen University" class="input-field">
                </div>
              </div>
            </div>

            <!-- Date and Passengers -->
            <div class="date-passenger-section">
              <div class="date-input-group">
                <label class="input-label">Departure date</label>
                <div class="date-input">
                  <svg class="icon-sm icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input type="text" value="14 Feb 2026" class="input-field">
                </div>
              </div>

              <div class="passenger-input-group">
                <button class="passenger-button">
                  <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>1 Adult, 0 Child, 0 Infant (on lap)</span>
                </button>
              </div>
            </div>
            <!-- Book Now -->
            <div class="book-now-row">
              <button @click="navigateTo('/booking')" class="book-now-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Book Now
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- Overlay for dropdown -->
    <div v-if="isDropdownOpen" @click="closeDropdown" class="dropdown-overlay"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const isDropdownOpen = ref(false)

const cssVars = computed(() => ({
  '--primary-blue': '#0064D2',
  '--dark-blue': '#003B73',
  '--light-blue': '#4A90E2',
}))

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const navigateToEditProfile = () => {
  isDropdownOpen.value = false
  navigateTo('/editprofile')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Nunito', sans-serif;
}

/* Icon utilities */
.icon-sm  { width: 16px; height: 16px; flex-shrink: 0; }
.icon-blue { color: #4A90E2; }

/* Main Container */
.travel-page {
  min-height: 100vh;
  background: #ffffff;
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
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: white;
}

.logo-text {
  font-family: 'Poppins', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

/* Top Navigation */
.top-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-btn,
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.nav-btn:hover,
.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.flag-icon {
  width: 20px;
  height: 15px;
}

/* User Dropdown */
.user-dropdown-wrapper {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.user-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-name {
  font-size: 0.8rem;
}

.points-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 0.7rem;
}

.points-text {
  font-weight: 600;
}

.dropdown-arrow {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  width: 350px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 1000;
}

.dropdown-header {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  padding: 1.25rem 1.5rem;
  color: white;
}

.dropdown-user-name {
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  letter-spacing: -0.01em;
}

.bronze-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.bronze-badge:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(4px);
}

.dropdown-content {
  padding: 0.75rem 0;
  background: #ffffff;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.5rem;
  color: #495057;
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  background: transparent;
  margin: 0 0.625rem 0.375rem;
  border-radius: 10px;
}

.dropdown-item:last-child {
  margin-bottom: 0.375rem;
}

.dropdown-item:hover {
  background: #f8f9fa;
  padding-left: 1.75rem;
}

.dropdown-item svg {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
}

.new-badge {
  margin-left: auto;
  padding: 0.2rem 0.5rem;
  background: #ff6b6b;
  color: white;
  border-radius: 10px;
  font-size: 0.65rem;
  font-weight: 700;
}

/* Dropdown Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Main Navigation */
/* Hero Section */
.hero {
  position: relative;
  min-height: 550px;
  background: #ffffff;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 1;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: transparent;
  opacity: 0;
  z-index: 2;
}

.hero-content {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
  z-index: 10;
}

.hero-title {
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2.5rem;
  text-shadow: none;
  animation: fadeInUp 0.8s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Service Tabs */
.service-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: fadeInUp 0.8s ease 0.2s both;
}

.service-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  color: #495057;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.service-tab:hover {
  background: #e9ecef;
  border-color: #dee2e6;
  transform: translateY(-3px);
}

.service-tab-active {
  background: var(--primary-blue);
  color: white;
  border-color: var(--primary-blue);
  box-shadow: 0 8px 24px rgba(0, 100, 210, 0.2);
}

/* Search Card */
.search-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  animation: fadeInUp 0.8s ease 0.4s both;
}

/* Trip Type Tabs */
.trip-type-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.trip-type-tab {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #6c757d;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.trip-type-tab:hover {
  background: #f8f9fa;
  color: var(--primary-blue);
}

.trip-type-active {
  background: var(--primary-blue);
  color: white;
}

/* Search Form */
.search-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Location Section */
.location-section {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: end;
}

.location-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #495057;
}

.location-input {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.location-input:hover {
  border-color: #dee2e6;
}

.location-input:focus-within {
  border-color: var(--primary-blue);
  background: white;
  box-shadow: 0 0 0 4px rgba(0, 100, 210, 0.1);
}

.location-icon {
  width: 20px;
  height: 20px;
  color: var(--primary-blue);
  flex-shrink: 0;
}

.location-icon.destination {
  color: #28a745;
}

.input-field {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.9rem;
  font-weight: 600;
  color: #212529;
}

.input-field::placeholder {
  color: #adb5bd;
}

.swap-button {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-blue);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.swap-button:hover {
  background: var(--dark-blue);
  transform: rotate(180deg) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 100, 210, 0.3);
}

/* Date and Passenger Section */
.date-passenger-section {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 0.75rem;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.date-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.875rem;
  background: #f8f9fa;
  border: 1.5px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.date-input:hover {
  border-color: #dee2e6;
}

.passenger-input-group {
  display: flex;
  align-items: flex-end;
}

.passenger-button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.875rem;
  background: #f8f9fa;
  border: 1.5px solid #e9ecef;
  border-radius: 8px;
  color: #212529;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.passenger-button:hover {
  border-color: var(--primary-blue);
  background: white;
}

/* Book Now */
.book-now-row {
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 2px solid #e9ecef;
  margin-top: 1rem;
}

.book-now-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2.5rem;
  background: var(--primary-blue);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(0, 100, 210, 0.35);
}

.book-now-btn svg {
  width: 20px;
  height: 20px;
}

.book-now-btn:hover {
  background: var(--dark-blue);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 100, 210, 0.45);
}

.book-now-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 100, 210, 0.3);
}

/* Responsive */
@media (max-width: 1200px) {
  .location-section {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .swap-button {
    margin: 0;
    align-self: center;
  }

  .date-passenger-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 1rem;
  }

  .top-nav {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .search-card {
    padding: 1.5rem;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: var(--primary-blue);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--dark-blue);
}
</style>