/**
 * PawShelter – Main App Logic (En Güncel ve Birleştirilmiş Hali)
 * Handles: navigation, mobile menu, auth state, universal navbar rendering, notifications
 */

// ── 1. Mobile Menu Toggle ──────────────────────────────────────────────────────
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu    = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// ── 2. Sidebar Toggle (Dashboard) ──────────────────────────────────────────────
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar       = document.getElementById('sidebar');

if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });
}

// ── 3. Active Nav Link ─────────────────────────────────────────────────────────
(function setActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.includes(currentPath) && currentPath !== '') {
      link.classList.add('text-purple-700', 'font-semibold');
    }
  });
})();

// ── 4. Auth State Simulation ───────────────────────────────────────────────────
const AuthState = {
  getUser() {
    try {
      return JSON.parse(localStorage.getItem('pawshelter_user'));
    } catch {
      return null;
    }
  },
  isLoggedIn() {
    return !!this.getUser();
  },
  logout() {
    localStorage.removeItem('pawshelter_user');
    window.location.href = 'login.html';
  }
};

// ── 5. Evrensel Navbar Oturum Durumu Yönetimi (YENİ EKLENDİ) ──────────────────────
document.addEventListener('DOMContentLoaded', function() {
  const authArea = document.getElementById('navAuthArea');
  if (!authArea) return; // Eğer sayfada bu ID'ye sahip bir alan yoksa (Örn: login/register) fonksiyonu durdur

  // Oturum durumunu kontrol et
  const user = AuthState.getUser();

  if (user) {
    const isAdmin = user.role === 'admin';
    const avatarLetter = user.email.charAt(0).toUpperCase();
    
    // "Giriş Yap" butonu yerine Panel Linki, Profil Dairesi ve Çıkış Butonunu enjekte et
    authArea.innerHTML = `
      <div class="flex items-center gap-4">
        <a href="dashboard.html" class="text-gray-600 hover:text-purple-700 font-medium transition flex items-center gap-1 text-sm">
          <i class="fas fa-tachometer-alt"></i> Panel
        </a>
        <div class="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
          <div class="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
            ${avatarLetter}
          </div>
          <span class="text-xs font-semibold text-purple-800 max-w-[120px] truncate hidden sm:inline">
            ${isAdmin ? 'Admin' : user.email.split('@')[0]}
          </span>
        </div>
        <button onclick="window.AuthState.logout()" class="text-red-500 hover:text-red-700 text-sm transition flex items-center gap-1 focus:outline-none">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    `;
  }
});

// ── 6. Notification System ─────────────────────────────────────────────────────
const Notify = {
  show(message, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'fixed bottom-6 right-6 z-50';
      document.body.appendChild(toast);
    }

    const icons = {
      success: 'fa-check-circle text-green-400',
      error:   'fa-times-circle text-red-400',
      info:    'fa-info-circle text-blue-400',
      warning: 'fa-exclamation-triangle text-yellow-400'
    };

    toast.innerHTML = `
      <div class="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 slide-up">
        <i class="fas ${icons[type] || icons.success}"></i>
        <span class="text-sm font-medium">${message}</span>
      </div>
    `;
    toast.style.display = 'block';

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }
};

// Expose globally
window.AuthState = AuthState;
window.Notify    = Notify;