/**
 * PawShelter – Adoptions Page Logic (Sıfır Başlangıçlı & Kalıcı Hafızalı Sürüm)
 * Handles: localStorage data management, rendering, status filtering, approval/rejection logic
 */

// GÜNCELLENDİ: Yapay statik veriler uçuruldu, tamamen animals sayfasından gelen canlı verilere bağlandı
let adoptionsData = JSON.parse(localStorage.getItem('pawshelter_adoptions')) || [];
let activeFilter = 'all';

// ── 2. Sayaçları Dinamik Güncelleme Fonksiyonu ──────────────────────────────────
function updateStats() {
  const total = adoptionsData.length;
  const pending = adoptionsData.filter(a => a.status === 'pending').length;
  const approved = adoptionsData.filter(a => a.status === 'approved').length;
  const rejected = adoptionsData.filter(a => a.status === 'rejected').length;

  document.getElementById('totalCount') && (document.getElementById('totalCount').textContent = total);
  document.getElementById('pendingCount') && (document.getElementById('pendingCount').textContent = pending);
  document.getElementById('approvedCount') && (document.getElementById('approvedCount').textContent = approved);
  document.getElementById('rejectedCount') && (document.getElementById('rejectedCount').textContent = rejected);
}

// ── 3. Tabloyu Ekrana Basma Fonksiyonu (Dinamik Rol Korumalı) ────────────────────
function renderTable() {
  const tbody = document.getElementById('adoptionsTableBody');
  if (!tbody) return;

  const currentUser = window.AuthState ? window.AuthState.getUser() : null;
  const isAdmin = currentUser && currentUser.role === 'admin';

  const filteredData = adoptionsData.filter(item => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  if (filteredData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-gray-400">Bu kategoride talep bulunmuyor.</td></tr>`;
    return;
  }

  tbody.innerHTML = filteredData.map(item => {
    const statusMap = {
      pending:  { label: 'Beklemede', cls: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
      approved: { label: 'Onaylandı', cls: 'bg-green-50 text-green-700 border border-green-200' },
      rejected: { label: 'Reddedildi', cls: 'bg-red-50 text-red-700 border border-red-200' }
    };
    const st = statusMap[item.status] || statusMap.pending;

    let actionsHTML = '';
    if (isAdmin && item.status === 'pending') {
      actionsHTML = `
        <button onclick="handleStatusChange('${item.id}', 'approved')" class="text-green-600 hover:text-green-800 font-semibold mr-3 transition text-xs">
          <i class="fas fa-check mr-1"></i>Onayla
        </button>
        <button onclick="handleStatusChange('${item.id}', 'rejected')" class="text-red-500 hover:text-red-700 font-semibold mr-3 transition text-xs">
          <i class="fas fa-times mr-1"></i>Reddet
        </button>
      `;
    } else {
      actionsHTML = `<span class="text-gray-400 text-xs mr-3">—</span>`;
    }

    actionsHTML += `<button onclick="openDetailModal('${item.id}')" class="text-purple-700 hover:text-purple-900 font-semibold text-xs"><i class="fas fa-eye mr-1"></i>Detay</button>`;

    return `
      <tr class="hover:bg-gray-50 transition">
        <td class="px-6 py-4 font-mono text-gray-500 text-xs">${item.id}</td>
        <td class="px-6 py-4 font-semibold text-gray-800">${item.animalEmoji || '🐾'} ${item.animalName}</td>
        <td class="px-6 py-4">
          <div class="font-medium text-gray-800">${item.applicantName}</div>
          <div class="text-xs text-gray-400">${item.applicantEmail}</div>
        </td>
        <td class="px-6 py-4 text-gray-500">${item.date}</td>
        <td class="px-6 py-4"><span class="px-2.5 py-1 rounded-full text-xs font-semibold ${st.cls}">${st.label}</span></td>
        <td class="px-6 py-4">${actionsHTML}</td>
      </tr>
    `;
  }).join('');
}

// ── 4. Onaylama ve Reddetme Lojikleri (GÜNCELLENDİ: Hayvan listesiyle tam senkronize) ─
window.handleStatusChange = function(id, newStatus) {
  const currentUser = window.AuthState ? window.AuthState.getUser() : null;
  if (!currentUser || currentUser.role !== 'admin') {
    window.Notify.show('Bu işlem için yönetici yetkiniz bulunmuyor.', 'error');
    return;
  }

  const targetIndex = adoptionsData.findIndex(item => item.id === id);
  if (targetIndex !== -1) {
    const adoptionRequest = adoptionsData[targetIndex];
    adoptionRequest.status = newStatus;
    
    // 1. Talebi kalıcı hafızaya işle
    localStorage.setItem('pawshelter_adoptions', JSON.stringify(adoptionsData));

    // 2. KRİTİK ADIM: animalsData havuzundaki hayvanın statüsünü de anlık değiştir
    let animals = JSON.parse(localStorage.getItem('pawshelter_animals')) || [];
    const animalIndex = animals.findIndex(a => a.id === adoptionRequest.animalId);
    if (animalIndex !== -1) {
      // Talep onaylandıysa hayvan sahiplenildi (adopted) olur, reddedildiyse tekrar sahiplenilebilir (available) olur
      animals[animalIndex].status = newStatus === 'approved' ? 'adopted' : 'available';
      localStorage.setItem('pawshelter_animals', JSON.stringify(animals));
    }

    updateStats();
    renderTable();

    const msg = newStatus === 'approved' ? 'Başvuru onaylandı!' : 'Başvuru reddedildi.';
    const type = newStatus === 'approved' ? 'success' : 'error';
    window.Notify.show(msg, type);
  }
};

// ── 5. Detay Modalı Yönetimi ──────────────────────────────────────────────────
window.openDetailModal = function(id) {
  const item = adoptionsData.find(a => a.id === id);
  if (!item) return;

  const content = document.getElementById('detailContent');
  if (content) {
    content.innerHTML = `
      <div class="space-y-4">
        <div class="bg-purple-50 p-4 rounded-xl flex items-center gap-3">
          <span class="text-4xl">${item.animalEmoji || '🐾'}</span>
          <div>
            <div class="font-bold text-gray-800">${item.animalName} Başvurusu</div>
            <div class="text-xs text-gray-500">Talep ID: ${item.id}</div>
          </div>
        </div>
        <div class="border-t pt-3 text-sm space-y-2">
          <div><span class="font-semibold text-gray-600">Başvuran:</span> ${item.applicantName}</div>
          <div><span class="font-semibold text-gray-600">E-posta:</span> ${item.applicantEmail}</div>
          <div><span class="font-semibold text-gray-600">Tarih:</span> ${item.date}</div>
          <div><span class="font-semibold text-gray-600">Mesajı:</span> "${item.message || 'Bir başvuru mesajı belirtilmedi.'}"</div>
        </div>
      </div>
    `;
  }

  document.getElementById('detailModal')?.classList.remove('hidden');
};

document.getElementById('closeDetailModal')?.addEventListener('click', () => {
  document.getElementById('detailModal')?.classList.add('hidden');
});

// ── 6. Filtreleme Butonlarının Yönetimi ──────────────────────────────────────────
function setupFilterButtons() {
  const filters = [
    { id: 'filterAll', status: 'all' },
    { id: 'filterPending', status: 'pending' },
    { id: 'filterApproved', status: 'approved' },
    { id: 'filterRejected', status: 'rejected' }
  ];

  filters.forEach(f => {
    const btn = document.getElementById(f.id);
    if (!btn) return;

    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.className = "filter-btn px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-600 transition";
      });

      this.className = "filter-btn active px-4 py-2 rounded-xl text-sm font-semibold bg-purple-700 text-white";
      
      activeFilter = f.status;
      renderTable();
    });
  });
}

// ── 7. İlk Çalıştırma (Init) ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  renderTable();
  setupFilterButtons();
});