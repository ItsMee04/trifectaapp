<template>
  <!-- Header -->
  <div class="header">
    <!-- 💬 Bagian Logo -->
    <div :class="['header-left', { active: !isMiniSidebar }]">
      <RouterLink to="/dashboard" class="logo logo-normal">
        <img src="@/assets/img/logo.png" alt="logo normal" />
      </RouterLink>
      <RouterLink to="/dashboard" class="logo logo-white">
        <img src="@/assets/img/logo-white.png" alt="logo putih" />
      </RouterLink>
      <RouterLink to="/dashboard" class="logo logo-small">
        <img src="@/assets/img/logo-small.png" alt="logo kecil" />
      </RouterLink>

      <!-- Tombol toggle sidebar -->
      <a id="toggle_btn" href="javascript:void(0);" @click.prevent="toggleSidebar">
        <i data-feather="chevrons-left" class="feather-16"></i>
      </a>
    </div>
    <!-- /Logo -->

    <!-- Tombol mobile -->
    <a id="mobile_btn" class="mobile_btn" @click.prevent="toggleMobileMenu">
      <span class="bar-icon">
        <span></span><span></span><span></span>
      </span>
    </a>

    <!-- Sidebar overlay -->
    <div class="sidebar-overlay" :class="{ opened: isMobileMenuOpen }" @click="closeMobileMenu"></div>

    <!-- Header Menu -->
    <ul class="nav user-menu">
      <!-- Jam & Tanggal -->
      <li class="nav-item nav-searchinputs">
        <div>
          <div class="fw-bold fs-6">{{ currentTime }}</div>
          <div class="small text-muted">{{ currentDate }}</div>
        </div>
      </li>

      <!-- Tombol Fullscreen -->
      <li class="nav-item nav-item-box">
        <a href="javascript:void(0);" @click="toggleFullscreen">
          <i data-feather="maximize"></i>
        </a>
      </li>

      <!-- Notifikasi -->
      <li class="nav-item dropdown nav-item-box">
        <a href="javascript:void(0);" class="dropdown-toggle nav-link" data-bs-toggle="dropdown">
          <i data-feather="bell"></i>
          <span class="badge rounded-pill">2</span>
        </a>
        <div class="dropdown-menu notifications">
          <div class="topnav-dropdown-header">
            <span class="notification-title">Notifications</span>
            <a href="javascript:void(0)" class="clear-noti"> Clear All </a>
          </div>
          <div class="noti-content"></div>
          <div class="topnav-dropdown-footer">
            <a href="activities.html">View all Notifications</a>
          </div>
        </div>
      </li>

      <!-- 💬 User Dropdown -->
      <li class="nav-item dropdown has-arrow main-drop">
        <a href="javascript:void(0);" class="dropdown-toggle nav-link userset" data-bs-toggle="dropdown">
          <span class="user-info">
            <span class="user-letter">
              <!-- Jika punya foto -->
              <img v-if="user.image_url" :src="user.image_url" :alt="user.nama" class="img-fluid rounded-circle" />
              <!-- Jika tidak, tampilkan inisial -->
              <span v-else class="initials">{{ user.initials }}</span>
            </span>
            <span class="user-detail">
              <span class="user-name">{{ user.nama }}</span>
              <span class="user-role">{{ user.role }}</span>
            </span>
          </span>
        </a>

        <!-- 💬 Dropdown user -->
        <div class="dropdown-menu menu-drop-user">
          <div class="profilename">
            <div class="profileset">
              <span class="user-img">
                <img v-if="user.image_url" :src="user.image_url" :alt="user.nama" class="img-fluid rounded-circle" />
                <span v-else class="initials">{{ user.initials }}</span>
                <span class="status online"></span>
              </span>
              <div class="profilesets">
                <h6>{{ user.nama }}</h6>
                <h5>{{ user.role }}</h5>
              </div>
            </div>

            <hr class="m-0" />

            <a class="dropdown-item" href="/profile">
              <i class="me-2" data-feather="user"></i> My Profile
            </a>

            <hr class="m-0" />

            <a class="dropdown-item logout pb-0" href="javascript:void(0)" @click.prevent="handleLogout">
              <img src="/src/assets/img/icons/log-out.svg" class="me-2" alt="logout" /> Logout
            </a>
          </div>
        </div>
      </li>
    </ul>
    <!-- /Header Menu -->

    <!-- Menu versi Mobile -->
    <div class="dropdown mobile-user-menu">
      <a href="javascript:void(0);" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fa fa-ellipsis-v"></i>
      </a>
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
/* =======================
   📦 Import
======================= */
import { ref, onMounted, onUpdated, onBeforeUnmount, nextTick } from "vue";
import feather from "feather-icons";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore"; // 💬 ambil auth store
import { AVATAR_BASE_URL } from "@/composables/useBase";
/* =======================
   📅 State & Refs
======================= */
const currentTime = ref("");
const currentDate = ref("");
const isMiniSidebar = ref(false);
const isExpandMenu = ref(false);
const router = useRouter();
// ===== Mobile menu state =====
const isMobileMenuOpen = ref(false); // state overlay & mobile menu

const user = ref({
  nama: "Loading...",
  role: "Loading...",
  image_url: null,
  initials: "",
});

const defaultImageUrl = "/src/assets/img/avatar/defaultuser.png";

/* =======================
   🔑 Ambil data user dari store
======================= */
const fetchUserData = () => {
  const authStore = useAuthStore(); // ✅ panggil instance store
  const currentUser = authStore.user; // ambil data user dari store

  if (currentUser) {
    // isi data ke state local
    user.value.nama = currentUser.nama || "User";
    user.value.role = currentUser.role || "Member";

    // tentukan foto profil
    if (currentUser.image) {
      user.value.image_url = `${AVATAR_BASE_URL}/${currentUser.image}`;
    } else {
      user.value.image_url = defaultImageUrl;
    }

    // buat inisial (contoh: John Doe -> JD)
    const nameParts = currentUser.nama.split(" ");
    const firstInitial = nameParts[0] ? nameParts[0][0] : "";
    const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "";
    user.value.initials = `${firstInitial}${lastInitial}`.toUpperCase();
  } else {
    router.push("/login"); // jika belum login
  }
};

/* =======================
   🚪 Logout
======================= */
const handleLogout = async () => {
  const authStore = useAuthStore();
  await authStore.logout(); // pastikan store punya action logout()
  router.push("/login");
};

/* =======================
   📱 Sidebar & Mobile
======================= */
const toggleSidebar = () => {
  isMiniSidebar.value = !isMiniSidebar.value;

  if (isMiniSidebar.value) {
    document.body.classList.add("mini-sidebar");
    document.body.classList.remove("expand-menu");
    localStorage.removeItem("screenModeNightTokenState");
  } else {
    document.body.classList.remove("mini-sidebar");
    localStorage.setItem("screenModeNightTokenState", "night");
  }
};

const handleMouseOver = (e) => {
  if (isMiniSidebar.value) {
    const target = e.target.closest(".sidebar, .header-left");
    if (target) {
      isExpandMenu.value = true;
      document.body.classList.add("expand-menu");
      document.querySelectorAll(".subdrop + ul").forEach((ul) => (ul.style.display = "block"));
    } else {
      isExpandMenu.value = false;
      document.body.classList.remove("expand-menu");
      document.querySelectorAll(".subdrop + ul").forEach((ul) => (ul.style.display = "none"));
    }
  }
};

// ===== Toggle mobile menu (sidebar overlay) =====
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;

  const wrapper = document.querySelector('.main-wrapper') || document.body;

  wrapper.classList.toggle('slide-nav', isMobileMenuOpen.value);
  document.documentElement.classList.toggle('menu-opened', isMobileMenuOpen.value);

  // jika ada task window, close
  const taskWindow = document.getElementById('task_window');
  if (taskWindow) taskWindow.classList.remove('opened');
};

// ===== Close mobile menu when overlay clicked =====
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;

  const wrapper = document.querySelector('.main-wrapper') || document.body;
  wrapper.classList.remove('slide-nav');
  document.documentElement.classList.remove('menu-opened');

  const taskWindow = document.getElementById('task_window');
  if (taskWindow) taskWindow.classList.remove('opened');
};

/* =======================
   🕒 Waktu & Tanggal
======================= */
const updateTime = () => {
  const now = new Date();
  const optionsDate = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  currentDate.value = now.toLocaleDateString("id-ID", optionsDate);
  currentTime.value = now.toLocaleTimeString("id-ID", { hour12: false });
};

/* =======================
   🧭 Fullscreen
======================= */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

/* =======================
   ⚙️ Lifecycle
======================= */
let timer = null;

onMounted(async () => {
  fetchUserData(); // ambil user dari store
  await nextTick();
  document.addEventListener("mouseover", handleMouseOver);
  feather.replace(); // render icon
  updateTime();
  timer = setInterval(updateTime, 1000);

  // restore sidebar state dari localStorage
  if (localStorage.getItem("screenModeNightTokenState") === "night") {
    isMiniSidebar.value = false;
    document.body.classList.remove("mini-sidebar");
  } else {
    isMiniSidebar.value = true;
    document.body.classList.add("mini-sidebar");
  }
});

onUpdated(() => feather.replace());
onBeforeUnmount(() => clearInterval(timer));
</script>
