


(function checkDashboardAccess() {
  const user = window.AuthState ? window.AuthState.getUser() : null;

  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const avatarLetter = document.getElementById('userAvatarLetter');
  const profileName  = document.getElementById('userProfileName');
  const profileEmail = document.getElementById('userProfileEmail');

  if (profileEmail) profileEmail.textContent = user.email;
  if (profileName) {
    profileName.textContent = user.role === 'admin' ? 'Sistem Yöneticisi' : 'Barınak Üyesi';
  }
  if (avatarLetter) {
    avatarLetter.textContent = user.email.charAt(0).toUpperCase();
  }

  
  if (user.role !== 'admin') {
    document.body.classList.add('is-user'); 
    
    const headerTitle = document.querySelector('header h1');
    if (headerTitle) {
      headerTitle.innerHTML = 'Dashboard <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-normal ml-2">Sınırlı Erişim (User)</span>';
    }
  }
})();


function animateCountUp(el, target, duration = 1200) {
  const start     = performance.now();
  const startVal  = 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(startVal + (target - startVal) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

document.querySelectorAll('.stat-number').forEach(el => {
  const target = parseInt(el.dataset.target, 10);
  animateCountUp(el, target);
});


(function drawStatusChart() {
  const canvas = document.getElementById('statusChart');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  const W      = canvas.width;
  const H      = canvas.height;

  const data = [
    { label: 'Sahiplenilebilir', value: 135, color: '#22c55e' },
    { label: 'Beklemede',        value: 23,  color: '#eab308' },
    { label: 'Sahiplenildi',     value: 89,  color: '#3b82f6' }
  ];

  const maxVal    = Math.max(...data.map(d => d.value));
  const barWidth  = 60;
  const gap       = (W - data.length * barWidth) / (data.length + 1);
  const chartH    = H - 50;
  const topPad    = 20;

  ctx.clearRect(0, 0, W, H);

  let frame = 0;
  const totalFrames = 60;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth   = 1;
    for (let i = 0; i <= 4; i++) {
      const y = topPad + (chartH - topPad) * (1 - i / 4);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    const progress = Math.min(frame / totalFrames, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);

    data.forEach((d, i) => {
      const x       = gap + i * (barWidth + gap);
      const barH    = ((d.value / maxVal) * (chartH - topPad)) * eased;
      const y       = chartH - barH;

      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [6, 6, 0, 0]);
      ctx.fill();

      ctx.fillStyle   = '#374151';
      ctx.font        = 'bold 13px sans-serif';
      ctx.textAlign   = 'center';
      ctx.fillText(Math.round(d.value * eased), x + barWidth / 2, y - 6);

      ctx.fillStyle = '#9ca3af';
      ctx.font      = '11px sans-serif';
      const words   = d.label.split(' ');
      words.forEach((w, wi) => {
        ctx.fillText(w, x + barWidth / 2, chartH + 16 + wi * 13);
      });
    });

    if (frame < totalFrames) {
      frame++;
      requestAnimationFrame(draw);
    }
  }

  draw();
})();


const activities = [
  { icon: 'fa-heart',       color: 'text-red-500',    bg: 'bg-red-50',    text: 'Ayşe Kaya, Karamel için sahiplenme başvurusu yaptı.',   time: '5 dk önce'  },
  { icon: 'fa-check-circle',color: 'text-green-500',  bg: 'bg-green-50',  text: 'Mehmet Demir\'in Pamuk için başvurusu onaylandı.',       time: '23 dk önce' },
  { icon: 'fa-plus-circle', color: 'text-blue-500',   bg: 'bg-blue-50',   text: 'Yeni hayvan eklendi: Aslan (Alman Çoban, 6 yaş).',      time: '1 sa önce'  },
  { icon: 'fa-user-plus',   color: 'text-purple-500', bg: 'bg-purple-50', text: 'Yeni kullanıcı kaydı: zeynep@example.com',              time: '2 sa önce'  },
  { icon: 'fa-times-circle',color: 'text-orange-500', bg: 'bg-orange-50', text: 'Ali Yıldız\'ın Cici için başvurusu reddedildi.',         time: '3 sa önce'  }
];

const feed = document.getElementById('activityFeed');
if (feed) {
  feed.innerHTML = activities.map(a => `
    <div class="flex items-start gap-3">
      <div class="w-8 h-8 ${a.bg} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <i class="fas ${a.icon} ${a.color} text-sm"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm text-gray-700 leading-snug">${a.text}</p>
        <p class="text-xs text-gray-400 mt-1">${a.time}</p>
      </div>
    </div>`).join('');
}