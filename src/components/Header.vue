<template>
  <!-- Header -->
  <div class="header">
    <!-- Logo -->
    <div class="header-left active">
      <RouterLink to="/dashboard" class="logo logo-normal">
        <img src="@/assets/img/logo.png" alt="">
      </RouterLink>
      <RouterLink to="/dashboard" class="logo logo-white">
        <img src="@/assets/img/logo-white.png" alt="">
      </RouterLink>
      <RouterLink to="/dashboard" class="logo logo-small">
        <img src="@/assets/img/logo-small.png" alt="">
      </RouterLink>
      <a id="toggle_btn" href="javascript:void(0);">
        <i data-feather="chevrons-left" class="feather-16"></i>
      </a>
    </div>
    <!-- /Logo -->

    <a id="mobile_btn" class="mobile_btn" @click="toggleSidebar">
      <span class="bar-icon">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </a>

    <!-- Header Menu -->
    <ul class="nav user-menu">

      <!-- Search -->
      <li class="nav-item nav-searchinputs">
        <div>
          <div class="fw-bold fs-6">{{ currentTime }}</div>
          <div class="small text-muted">{{ currentDate }}</div>
        </div>
      </li>
      <!-- /Search -->

      <li class="nav-item nav-item-box">
        <a href="javascript:void(0);" @click="toggleFullscreen">
          <i data-feather="maximize"></i>
        </a>
      </li>

      <!-- Notifications -->
      <li class="nav-item dropdown nav-item-box">
        <a href="javascript:void(0);" class="dropdown-toggle nav-link" data-bs-toggle="dropdown">
          <i data-feather="bell"></i><span class="badge rounded-pill">2</span>
        </a>
        <div class="dropdown-menu notifications">
          <div class="topnav-dropdown-header">
            <span class="notification-title">Notifications</span>
            <a href="javascript:void(0)" class="clear-noti"> Clear All </a>
          </div>
          <div class="noti-content">
            <!-- noti list -->
          </div>
          <div class="topnav-dropdown-footer">
            <a href="activities.html">View all Notifications</a>
          </div>
        </div>
      </li>
      <!-- /Notifications -->

      <!-- User Dropdown -->
      <li class="nav-item dropdown has-arrow main-drop">
        <a href="javascript:void(0);" class="dropdown-toggle nav-link userset" data-bs-toggle="dropdown">
          <span class="user-info">
            <span class="user-letter">
              <img src="@/assets/img/profiles/avator1.jpg" alt="" class="img-fluid">
            </span>
            <span class="user-detail">
              <span class="user-name">John Smilga</span>
              <span class="user-role">Super Admin</span>
            </span>
          </span>
        </a>
        <div class="dropdown-menu menu-drop-user">
          <div class="profilename">
            <div class="profileset">
              <span class="user-img"><img src="@/assets/img/profiles/avator1.jpg" alt="">
                <span class="status online"></span></span>
              <div class="profilesets">
                <h6>John Smilga</h6>
                <h5>Super Admin</h5>
              </div>
            </div>
            <hr class="m-0">
            <a class="dropdown-item" href="profile.html"><i class="me-2" data-feather="user"></i> My Profile</a>
            <a class="dropdown-item" href="general-settings.html"><i class="me-2" data-feather="settings"></i>
              Settings</a>
            <hr class="m-0">
            <a class="dropdown-item logout pb-0" href="signin.html">
              <img src="@/assets/img/icons/log-out.svg" class="me-2" alt="img"> Logout
            </a>
          </div>
        </div>
      </li>
    </ul>
    <!-- /Header Menu -->

    <!-- Mobile Menu -->
    <div class="dropdown mobile-user-menu">
      <a href="javascript:void(0);" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i
          class="fa fa-ellipsis-v"></i></a>
      <div class="dropdown-menu dropdown-menu-right">
        <a class="dropdown-item" href="profile.html">My Profile</a>
        <a class="dropdown-item" href="general-settings.html">Settings</a>
        <a class="dropdown-item" href="signin.html">Logout</a>
      </div>
    </div>
    <!-- /Mobile Menu -->
  </div>
  <!-- /Header -->
</template>
<script setup>
import { ref, onMounted, onUpdated, onBeforeUnmount } from "vue";
import feather from "feather-icons";

const currentTime = ref("");
const currentDate = ref("");

// Fungsi update jam & tanggal
const updateTime = () => {
  const now = new Date();
  const optionsDate = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  currentDate.value = now.toLocaleDateString("id-ID", optionsDate);
  currentTime.value = now.toLocaleTimeString("id-ID", { hour12: false });
};

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else if (document.exitFullscreen) {
    document.exitFullscreen()
  }
}

let timer = null;
onMounted(() => {
  feather.replace();
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUpdated(() => feather.replace());
onBeforeUnmount(() => clearInterval(timer));
</script>
