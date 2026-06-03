/**
 * PawShelter – Animals Page Logic (Sıfır Başlangıçlı, Kalıcı Hafızalı & Entegre Sürüm)
 * Handles: localStorage data management, rendering, filtering (multi-species), search, adoption modal, and add animal logic
 */

// ── 1. Veri Yönetimi (Kalıcı Hafıza Kontrolü) ──────────────────────────────────
let animalsData = JSON.parse(localStorage.getItem('pawshelter_animals'));
if (!animalsData) {
  animalsData = []; // Başlangıçta hiç hayvan yok, tertemiz!
  localStorage.setItem('pawshelter_animals', JSON.stringify(animalsData));
}

let filteredAnimals = [...animalsData];
let selectedAnimalId = null;

// ── 2. Render (Hayvanları Ekrana Basma) ───────────────────────────────────────
function renderAnimals(animals) {
  const grid = document.getElementById('animalsGrid');
  const count = document.getElementById('resultCount');
  if (!grid) return;

  count && (count.textContent = `${animals.length} hayvan listeleniyor`);

  if (animals.length === 0) {
    grid.innerHTML = `
      <div class="col-span-1 sm:col-span-2 xl:col-span-3 text-center py-16 text-gray-400">
        <div class="text-5xl mb-4">🐾</div>
        <p class="text-lg font-semibold">Barınakta Kayıtlı Hayvan Bulunmadı</p>
        <p class="text-sm mt-1">Lütfen admin hesabı ile giriş yaparak yeni bir hayvan ekleyin.</p>
      </div>`;
    return;
  }

  grid.innerHTML = animals.map(a => {
    const statusMap = {
      available: { label: 'Sahiplenilebilir', cls: 'status-available' },
      pending:   { label: 'Beklemede',        cls: 'status-pending'   },
      adopted:   { label: 'Sahiplenildi',     cls: 'status-adopted'   }
    };
    const genderLabel = a.gender === 'male' ? '♂ Erkek' : '♀ Dişi';
    const ageLabel    = a.age < 2 ? 'Yavru' : a.age < 7 ? 'Yetişkin' : 'Yaşlı';
    const st          = statusMap[a.status] || statusMap.available;
    const canAdopt    = a.status === 'available';

    return `
      <div class="animal-card bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden fade-in">
        <div class="bg-gradient-to-br from-purple-50 to-blue-50 h-36 flex items-center justify-center text-6xl">
          ${a.emoji}
        </div>
        <div class="p-5">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-lg font-bold text-gray-800">${a.name}</h3>
            <span class="status-badge ${st.cls}">${st.label}</span>
          </div>
          <p class="text-sm text-gray-500 mb-3">${a.breed}</p>
          <div class="flex flex-wrap gap-2 mb-3">
            <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">${genderLabel}</span>
            <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">${a.age} yaş (${ageLabel})</span>
            <span class="bg-${a.vaccinated ? 'green' : 'red'}-100 text-${a.vaccinated ? 'green' : 'red'}-700 text-xs px-2 py-1 rounded-full">
              ${a.vaccinated ? '✅ Aşılı' : '❌ Aşısız'}
            </span>
          </div>
          <p class="text-xs text-gray-400 mb-4 line-clamp-2">${a.description}</p>
          <button
            onclick="openAdoptionModal(${a.id})"
            class="w-full py-2 rounded-xl text-sm font-semibold transition
              ${canAdopt
                ? 'bg-purple-700 text-white hover:bg-purple-800'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}"
            ${canAdopt ? '' : 'disabled'}
          >
            <i class="fas fa-heart mr-1"></i>
            ${canAdopt ? 'Sahiplen' : (a.status === 'pending' ? 'Talep Var' : 'Sahiplenildi')}
          </button>
        </div>
      </div>`;
  }).join('');
}

// ── 3. Filtering (Filtreleme Mekanizmaları) ───────────────────────────────────
function applyFilters() {
  const search     = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const age        = document.getElementById('ageFilter')?.value || 'all';
  const status     = document.getElementById('statusFilter')?.value || 'all';
  const genderEl   = document.querySelector('input[name="gender"]:checked');
  const gender     = genderEl ? genderEl.value : 'all';

  const checkedSpeciesBoxes = document.querySelectorAll('.filter-species:checked');
  const selectedSpecies = Array.from(checkedSpeciesBoxes).map(cb => cb.value);

  filteredAnimals = animalsData.filter(a => {
    if (search && !a.name.toLowerCase().includes(search) && !a.breed.toLowerCase().includes(search)) return false;
    if (status !== 'all' && a.status !== status) return false;
    if (gender !== 'all' && a.gender !== gender) return false;
    if (age === 'young'  && a.age >= 2) return false;
    if (age === 'adult'  && (a.age < 2 || a.age >= 7)) return false;
    if (age === 'senior' && a.age < 7) return false;
    if (!selectedSpecies.includes('all') && !selectedSpecies.includes(a.species)) return false;
    return true;
  });

  renderAnimals(filteredAnimals);
}

// ── 4. Adoption Modal (Sahiplenme Formu & Entegrasyon Bölümü) ───────────────────
function openAdoptionModal(id) {
  const animal = animalsData.find(a => a.id === id);
  if (!animal) return;
  selectedAnimalId = id;

  const info = document.getElementById('modalAnimalInfo');
  if (info) {
    info.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-4xl">${animal.emoji}</span>
        <div>
          <div class="font-bold text-gray-800">${animal.name}</div>
          <div class="text-sm text-gray-500">${animal.breed} · ${animal.age} yaş</div>
        </div>
      </div>`;
  }

  const modal = document.getElementById('adoptionModal');
  if (modal) modal.classList.remove('hidden');
}

document.getElementById('closeModal')?.addEventListener('click', () => {
  document.getElementById('adoptionModal')?.classList.add('hidden');
});

// GÜNCELLENDİ: Form gönderildiğinde talepler havuzuna veri yazar ve hayvanı günceller
document.getElementById('adoptionForm')?.addEventListener('submit', function(e) {
  e.preventDefault();

  const currentUser = window.AuthState ? window.AuthState.getUser() : null;
  const applicantEmail = currentUser ? currentUser.email : 'anonim@pawshelter.com';

  const nameInput = e.target.querySelector('input[type="text"]')?.value || 'İsimsiz Üye';
  const messageInput = e.target.querySelector('textarea')?.value || '';

  const selectedAnimal = animalsData.find(a => a.id === selectedAnimalId);
  if (!selectedAnimal) return;

  // Sahiplenme listesini çek veya oluştur
  let adoptions = JSON.parse(localStorage.getItem('pawshelter_adoptions')) || [];

  const newAdoptionRequest = {
    id: `ADO-${Date.now().toString().slice(-3)}`,
    animalId: selectedAnimal.id,
    animalName: selectedAnimal.name,
    animalEmoji: selectedAnimal.emoji,
    applicantName: nameInput,
    applicantEmail: applicantEmail,
    message: messageInput,
    date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'pending'
  };

  // Veriyi listenin başına kaydet
  adoptions.unshift(newAdoptionRequest);
  localStorage.setItem('pawshelter_adoptions', JSON.stringify(adoptions));

  // Hayvanın durumunu 'Beklemede' konumuna getir ve diske yaz
  selectedAnimal.status = 'pending';
  localStorage.setItem('pawshelter_animals', JSON.stringify(animalsData));

  document.getElementById('adoptionModal')?.classList.add('hidden');
  e.target.reset();
  
  applyFilters(); // Kartları yeniden çiz

  window.Notify.show(`${selectedAnimal.name} için sahiplenme talebi başarıyla admin paneline gönderildi!`, 'success');
});

// ── 5. Yeni Hayvan Ekleme Modalı Kontrolcüleri ─────────────────────────────────
function openAddAnimalModal() {
  const user = window.AuthState ? window.AuthState.getUser() : null;
  if (!user || user.role !== 'admin') {
    window.Notify.show('Bu işlemi yalnızca yöneticiler gerçekleştirebilir.', 'error');
    return;
  }
  document.getElementById('addAnimalModal')?.classList.remove('hidden');
}

function closeAddAnimalModal() {
  document.getElementById('addAnimalModal')?.classList.add('hidden');
  document.getElementById('addAnimalForm')?.reset();
}

document.getElementById('addAnimalForm')?.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('addName').value;
  const species = document.getElementById('addSpecies').value;
  const breed = document.getElementById('addBreed').value;
  const age = parseInt(document.getElementById('addAge').value, 10);
  const gender = document.getElementById('addGender').value;
  const vaccinated = document.getElementById('addVaccinated').checked;
  const description = document.getElementById('addDescription').value;

  const emojiMap = { dog: '🐕', cat: '🐈', bird: '🐦', other: '🐇' };

  const newAnimal = {
    id: Date.now(),
    name: name,
    species: species,
    breed: breed,
    age: age,
    gender: gender,
    status: 'available',
    vaccinated: vaccinated,
    emoji: emojiMap[species] || '🐾',
    description: description
  };

  animalsData.unshift(newAnimal);
  localStorage.setItem('pawshelter_animals', JSON.stringify(animalsData));

  document.getElementById('clearFilters')?.click(); 
  closeAddAnimalModal();

  window.Notify.show(`${name} barınak kayıtlarına başarıyla eklendi ve kaydedildi!`, 'success');
});

// ── 6. Event Listeners ──────────────────────────────────────────────────────────
document.getElementById('searchInput')?.addEventListener('input', applyFilters);
document.getElementById('ageFilter')?.addEventListener('change', applyFilters);
document.getElementById('statusFilter')?.addEventListener('change', applyFilters);
document.querySelectorAll('input[name="gender"]').forEach(r => r.addEventListener('change', applyFilters));

const speciesBoxes = document.querySelectorAll('.filter-species');
speciesBoxes.forEach(box => {
  box.addEventListener('change', function() {
    const allBox = document.querySelector('.filter-species[value="all"]');
    if (this.value === 'all' && this.checked) {
      speciesBoxes.forEach(cb => { if (cb.value !== 'all') cb.checked = false; });
    } else if (this.value !== 'all' && this.checked) {
      if (allBox) allBox.checked = false;
    }
    const anyChecked = Array.from(speciesBoxes).some(cb => cb.checked);
    if (!anyChecked && allBox) allBox.checked = true;
    applyFilters();
  });
});

document.getElementById('clearFilters')?.addEventListener('click', () => {
  document.getElementById('searchInput') && (document.getElementById('searchInput').value = '');
  document.getElementById('ageFilter') && (document.getElementById('ageFilter').value = 'all');
  document.getElementById('statusFilter') && (document.getElementById('statusFilter').value = 'all');
  const allGender = document.querySelector('input[name="gender"][value="all"]');
  if (allGender) allGender.checked = true;
  speciesBoxes.forEach(cb => cb.checked = (cb.value === 'all'));
  applyFilters();
});

// ── 7. İlk Çalıştırma (Init) ───────────────────────────────────────────────────
renderAnimals(animalsData);