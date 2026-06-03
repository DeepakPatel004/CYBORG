const preloader = document.getElementById('preloader');
const bootLines = document.getElementById('bootLines');
const bootTexts = ['Initializing neural mesh...', 'Activating core array...', 'Linking photonic lattices...', 'Secure handshake established...'];
let bootIndex = 0;
function typeBootLine() {
  if (bootIndex >= bootTexts.length) {
    return;
  }
  const line = document.createElement('div');
  line.className = 'boot-line';
  bootLines.appendChild(line);
  const text = bootTexts[bootIndex];
  let charIndex = 0;
  const interval = setInterval(() => {
    if (charIndex < text.length) {
      line.textContent = text.slice(0, charIndex + 1);
    } else {
      clearInterval(interval);
      bootIndex++;
      setTimeout(typeBootLine, 180);
    }
    charIndex++;
  }, 28);
}
typeBootLine();
window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.classList.add('loaded');
    preloader.classList.add('hidden');
  }, 2500);
});
const typer = document.querySelector('.typing');
if (typer) {
  const txt = typer.getAttribute('data-text') || '';
  let idx = 0;
  function typeChar() {
    if (idx <= txt.length) {
      typer.textContent = txt.slice(0, idx);
      idx++;
      setTimeout(typeChar, 40 + Math.random() * 40);
    }
  }
  setTimeout(typeChar, 600);
}
const heroInner = document.querySelector('.hero-inner');
const detailModal = document.getElementById('detailModal');
const detailTitle = document.getElementById('detailTitle');
const detailCopy = document.getElementById('detailCopy');
const detailClose = document.getElementById('detailClose');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let lastParticleTime = 0;
const particlePool = [];
const maxParticles = 12;

// Optimized mouse tracking with efficient particles
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  document.body.classList.add('cursor-active');
  
  // Update cursor position directly with CSS variables - no easing needed for snappy feel
  document.body.style.setProperty('--cursor-x', `${mouseX}px`);
  document.body.style.setProperty('--cursor-y', `${mouseY}px`);
  
  // Particle generation - less frequent
  const now = Date.now();
  if (now - lastParticleTime > 40 && particlePool.length < maxParticles) {
    createParticle(mouseX, mouseY);
    lastParticleTime = now;
  }
});

function createParticle(x, y) {
  let particle = particlePool.pop();
  
  if (!particle) {
    particle = document.createElement('div');
    particle.className = 'cursor-particle';
    document.body.appendChild(particle);
  }
  
  const angle = Math.random() * Math.PI * 2;
  const velocity = 1.5 + Math.random() * 2.5;
  let vx = Math.cos(angle) * velocity;
  let vy = Math.sin(angle) * velocity;
  const size = 2 + Math.random() * 3;
  
  particle.style.left = x + 'px';
  particle.style.top = y + 'px';
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';
  particle.style.opacity = '1';
  
  let lifetime = 0;
  let px = x, py = y;
  let animFrameId;
  
  const animate = () => {
    lifetime += 0.08;
    px += vx;
    py += vy;
    vy += 0.1; // gravity
    
    const progress = Math.min(lifetime / 0.8, 1);
    particle.style.left = px + 'px';
    particle.style.top = py + 'px';
    particle.style.opacity = (1 - progress * 1.2).toFixed(2);
    particle.style.transform = `scale(${1 - progress * 0.6})`;
    
    if (progress < 1) {
      animFrameId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animFrameId);
      particlePool.push(particle);
    }
  };
  
  animate();
}

document.addEventListener('mouseleave', () => {
  document.body.classList.remove('cursor-active');
});
const commandHistory = [];
let historyIndex = -1;
function openDetail(title, copy) {
  if (!detailModal || !detailTitle || !detailCopy) {
    return;
  }
  detailTitle.textContent = title;
  detailCopy.textContent = copy;
  detailModal.classList.remove('hidden');
  pushTerminal(`detail opened: ${title}`);
}
function closeDetail() {
  if (!detailModal) {
    return;
  }
  detailModal.classList.add('hidden');
}
function pulseHero() {
  if (!heroInner) {
    return;
  }
  heroInner.classList.add('active');
  setTimeout(() => heroInner.classList.remove('active'), 1400);
}
const toReveal = document.querySelectorAll('.reveal, .card, .section-title, .hero-inner, .footer-inner');
toReveal.forEach(el => el.classList.add('reveal'));
const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});
toReveal.forEach(el => obs.observe(el));
const tiltables = document.querySelectorAll('.card, .media-shape');
tiltables.forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = (y - cy) / cy;
    const ry = (x - cx) / cx;
    const rotX = rx * 6;
    const rotY = ry * 6;
    el.style.transform = `perspective(1000px) rotateX(${-rotX}deg) rotateY(${rotY}deg)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
    el.style.boxShadow = '';
  });
});
const heroRing = document.querySelector('.hero-ring');
const heroFloat = document.querySelector('.hero-float');
const heroParticles = document.querySelector('.hero-particles');
const aboutMedia = document.querySelector('.about-media');
const resourceCards = document.querySelectorAll('.resource-card');
let scrollTicking = false;
let idleFrame = 0;
function updateScrollMotion() {
  const scrollY = window.scrollY;
  if (heroVideo) {
    heroVideo.style.transform = `translateY(${scrollY * 0.12}px) scale(1.08)`;
  }
  if (heroInner) {
    heroInner.style.transform = `translateY(${Math.min(scrollY * 0.02, 24)}px)`;
  }
  if (heroRing) {
    heroRing.style.transform = `translate(-50%, -50%) rotate(${scrollY * 0.03}deg)`;
  }
  if (heroFloat) {
    heroFloat.style.transform = `translateY(${Math.sin(scrollY * 0.006) * 16}px)`;
  }
  if (heroParticles) {
    heroParticles.style.transform = `translateY(${scrollY * 0.04}px)`;
  }
  if (aboutMedia) {
    aboutMedia.style.transform = `translate3d(0, ${scrollY * 0.04}px, 0) rotate(${scrollY * 0.008}deg)`;
  }
  document.querySelectorAll('.card').forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!visible) {
      return;
    }
    const offset = (window.innerHeight - rect.top) / window.innerHeight;
    const drift = (offset - 0.5) * 18;
    card.style.transform = `perspective(900px) translateY(${drift}px)`;
  });
  resourceCards.forEach((card, index) => {
    card.style.transform = `translate3d(0, ${Math.sin((scrollY + index * 120) * 0.009) * 10}px, 0)`;
    card.style.filter = `drop-shadow(0 0 ${8 + Math.sin((scrollY + index * 120) * 0.015) * 4}px rgba(142,0,255,0.28))`;
  });
}
function animateIdleMotion() {
  idleFrame += 0.016;
  if (heroRing) {
    heroRing.style.opacity = `${0.42 + Math.sin(idleFrame * 0.45) * 0.08}`;
  }
  if (heroFloat) {
    heroFloat.style.opacity = `${0.82 + Math.sin(idleFrame * 0.72) * 0.08}`;
  }
  if (heroParticles) {
    heroParticles.style.opacity = `${0.7 + Math.sin(idleFrame * 0.28) * 0.05}`;
  }
  requestAnimationFrame(animateIdleMotion);
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      updateScrollMotion();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
});
window.addEventListener('load', () => {
  updateScrollMotion();
  requestAnimationFrame(animateIdleMotion);
});
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  card.addEventListener('click', () => {
    const title = card.querySelector('h3')?.textContent || 'SYSTEM CAPABILITY';
    const copy = card.getAttribute('data-detail') || 'No additional details available.';
    openDetail(title, copy);
  });
});
if (detailClose) {
  detailClose.addEventListener('click', closeDetail);
}
const buttons = document.querySelectorAll('.mech-btn');
buttons.forEach(button => {
  button.addEventListener('mousemove', e => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const distance = Math.hypot(x, y);
    const strength = Math.min(1, 120 / (distance || 1));
    const tx = (x / rect.width) * 20 * strength;
    const ty = (y / rect.height) * 20 * strength;
    const scale = 1 + strength * 0.015;
    button.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    button.style.boxShadow = `0 18px 64px rgba(176,38,255,0.45), ${tx * 1.2}px ${ty * 1.2}px 48px rgba(138,43,226,0.25)`;
  });
  button.addEventListener('mouseleave', () => {
    button.style.transform = '';
    button.style.boxShadow = '';
  });
  button.addEventListener('click', () => {
    pushTerminal('control sequence engaged');
    pulseHero();
  });
});
const diagnostics = {
  temp: {
    elVal: document.getElementById('tempValue'),
    elBar: document.getElementById('tempBar'),
    status: document.querySelector('[data-key="temp"]')
  },
  sync: {
    elVal: document.getElementById('syncValue'),
    elBar: document.getElementById('syncBar'),
    status: document.querySelector('[data-key="sync"]')
  },
  latency: {
    elVal: document.getElementById('latencyValue'),
    elBar: document.getElementById('latencyBar'),
    status: document.querySelector('[data-key="latency"]')
  }
};
function setMeter(elBar, val) {
  if (elBar) {
    elBar.style.setProperty('--w', `${val}%`);
  }
}
function pushTerminal(text) {
  const log = document.getElementById('terminalLog');
  if (!log) {
    return;
  }
  const line = document.createElement('div');
  line.className = 'terminal-line';
  line.textContent = text;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}
function simulateDiagnostics() {
  const temp = Math.max(64, Math.min(98, Math.round(72 + (Math.random() - 0.5) * 18)));
  setMeter(diagnostics.temp.elBar, temp);
  diagnostics.temp.elVal.textContent = `${temp}°C`;
  diagnostics.temp.status.textContent = temp > 92 ? 'CRITICAL' : 'STABLE';
  diagnostics.temp.status.classList.toggle('online', temp <= 92);
  diagnostics.temp.status.classList.toggle('offline', temp > 92);
  const sync = Math.max(82, Math.min(100, Math.round(92 + (Math.random() - 0.5) * 12)));
  setMeter(diagnostics.sync.elBar, sync);
  diagnostics.sync.elVal.textContent = `${sync}%`;
  diagnostics.sync.status.textContent = sync > 88 ? 'ONLINE' : 'DEGRADED';
  diagnostics.sync.status.classList.toggle('online', sync > 88);
  diagnostics.sync.status.classList.toggle('offline', sync <= 88);
  const latency = Math.max(10, Math.min(42, Math.round(26 + (Math.random() - 0.5) * 16)));
  const latencyWidth = Math.max(24, Math.min(100, 120 - latency * 1.8));
  setMeter(diagnostics.latency.elBar, latencyWidth);
  diagnostics.latency.elVal.textContent = `${latency} ms`;
  diagnostics.latency.status.textContent = latency < 28 ? 'LOW' : 'HIGH';
  diagnostics.latency.status.classList.toggle('online', latency < 28);
  diagnostics.latency.status.classList.toggle('offline', latency >= 28);
  pushTerminal(`diag update: temp=${temp}°C sync=${sync}% latency=${latency}ms`);
}
setInterval(simulateDiagnostics, 1500);
simulateDiagnostics();
const terminalForm = document.getElementById('terminalForm');
const terminalCommand = document.getElementById('terminalCommand');
const heroVideo = document.getElementById('heroVideo');
const sections = {
  home: document.querySelector('.hero'),
  diagnostics: document.getElementById('diagnostics'),
  about: document.querySelector('.about'),
  capabilities: document.querySelector('.features'),
  integrate: document.querySelector('.integrate')
};
function scrollToSection(name) {
  const target = sections[name];
  if (!target) {
    return false;
  }
  target.scrollIntoView({behavior: 'smooth', block: 'start'});
  pushTerminal(`scrolling to ${name}`);
  return true;
}
function showMenu() {
  pushTerminal('cmd menu:');
  pushTerminal('home · diagnostics · about · capabilities · integrate');
  pushTerminal('video · cta · detail [1-3] · help · clear · status · reboot · logs · shortcuts · stats · neural');
}
function openCardDetail(arg) {
  const index = Number(arg) - 1;
  if (!Number.isNaN(index) && cards[index]) {
    const title = cards[index].querySelector('h3')?.textContent || 'SYSTEM CAPABILITY';
    const copy = cards[index].getAttribute('data-detail') || 'No additional details available.';
    openDetail(title, copy);
    return true;
  }
  const match = Array.from(cards).find(card => card.querySelector('h3')?.textContent.toLowerCase().includes(arg.toLowerCase()));
  if (match) {
    const title = match.querySelector('h3')?.textContent || 'SYSTEM CAPABILITY';
    const copy = match.getAttribute('data-detail') || 'No additional details available.';
    openDetail(title, copy);
    return true;
  }
  return false;
}
function processCommand(command) {
  const parts = command.trim().split(' ').filter(Boolean);
  const action = parts[0]?.toLowerCase();
  const target = parts.slice(1).join(' ').trim();
  if (!action) {
    return;
  }
  if (action === 'help' || action === 'menu') {
    showMenu();
  } else if (action === 'clear') {
    const log = document.getElementById('terminalLog');
    if (log) {
      log.innerHTML = '';
    }
  } else if (action === 'status') {
    pushTerminal('SYSTEM STATUS: CORE STABLE | NETWORK LOW | INTEGRATION READY');
  } else if (action === 'reboot') {
    pushTerminal('REBOOT SEQUENCE ENGAGED...');
    setTimeout(() => pushTerminal('RESTART COMPLETE'), 800);
  } else if (action === 'logs') {
    pushTerminal('log count: ' + commandHistory.length);
  } else if (action === 'home' || action === 'diagnostics' || action === 'about' || action === 'capabilities' || action === 'integrate') {
    if (!scrollToSection(action)) {
      pushTerminal(`unknown section: ${action}`);
    }
  } else if (action === 'video') {
    if (!heroVideo) {
      pushTerminal('video control unavailable');
    } else {
      heroVideo.muted = !heroVideo.muted;
      pushTerminal(`video ${heroVideo.muted ? 'muted' : 'unmuted'}`);
    }
  } else if (action === 'cta') {
    const cta = document.getElementById('cta');
    if (cta) {
      cta.click();
      pushTerminal('cta triggered');
    }
  } else if (action === 'detail') {
    if (!target || !openCardDetail(target)) {
      pushTerminal('detail command usage: detail 1 | detail optical | detail neural');
    }
  } else if (action === 'shortcuts') {
    toggleShortcuts();
  } else if (action === 'stats') {
    pushTerminal('neural_pathways: 2840 | efficiency: 94.7% | cycles: 1284 | uptime: 99.2%');
  } else if (action === 'neural') {
    const neuralSection = document.querySelector('.neural-viz');
    if (neuralSection) {
      neuralSection.scrollIntoView({behavior: 'smooth', block: 'start'});
      pushTerminal('neural network interface loaded');
    }
  } else {
    pushTerminal(`UNKNOWN COMMAND: ${command}`);
  }
}
if (terminalForm) {
  terminalForm.addEventListener('submit', e => {
    e.preventDefault();
    const command = terminalCommand.value.trim();
    if (!command) {
      return;
    }
    pushTerminal(`> ${command}`);
    commandHistory.push(command);
    historyIndex = commandHistory.length;
    processCommand(command);
    terminalCommand.value = '';
  });
  terminalCommand.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') {
      if (commandHistory.length && historyIndex > 0) {
        historyIndex -= 1;
        terminalCommand.value = commandHistory[historyIndex] || '';
      }
      e.preventDefault();
    }
    if (e.key === 'ArrowDown') {
      if (commandHistory.length && historyIndex < commandHistory.length - 1) {
        historyIndex += 1;
        terminalCommand.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        terminalCommand.value = '';
      }
      e.preventDefault();
    }
  });
}
const cmdItems = document.querySelectorAll('.cmd-item');
cmdItems.forEach(item => {
  item.addEventListener('click', () => {
    if (!terminalCommand) {
      return;
    }
    terminalCommand.value = item.textContent || '';
    terminalCommand.focus();
  });
});
const integrateForm = document.getElementById('integrateForm');
const formStatus = document.getElementById('formStatus');
const formButton = document.querySelector('.form-submit');
if (integrateForm) {
  integrateForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(integrateForm);
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const unit = formData.get('unit')?.toString().trim();
    if (!name || !email || !unit) {
      if (formStatus) {
        formStatus.textContent = 'ALL FIELDS MUST BE FILLED';
        formStatus.style.color = '#ff5370';
      }
      return;
    }
    if (formStatus) {
      formStatus.textContent = 'ENCRYPTING DATA...';
      formStatus.style.color = 'var(--text)';
    }
    if (formButton) {
      formButton.disabled = true;
      formButton.classList.add('loading');
      const label = formButton.querySelector('.btn-label');
      if (label) {
        label.textContent = 'ENCRYPTING DATA...';
      }
    }
    setTimeout(() => {
      if (formStatus) {
        formStatus.textContent = 'INTEGRATION APPROVED';
        formStatus.style.color = '#7fff8f';
      }
      if (formButton) {
        formButton.disabled = false;
        formButton.classList.remove('loading');
        const label = formButton.querySelector('.btn-label');
        if (label) {
          label.textContent = 'REQUEST INTEGRATION';
        }
      }
      pushTerminal(`integration approved for ${name}`);
    }, 2000);
  });
}
const shortcutsModal = document.getElementById('shortcutsModal');
const shortcutsClose = document.getElementById('shortcutsClose');
function toggleShortcuts() {
  if (shortcutsModal?.classList.contains('hidden')) {
    shortcutsModal.classList.remove('hidden');
    pushTerminal('help: keyboard shortcuts displayed');
  } else {
    closeShortcuts();
  }
}
function closeShortcuts() {
  if (shortcutsModal) {
    shortcutsModal.classList.add('hidden');
  }
}
if (shortcutsClose) {
  shortcutsClose.addEventListener('click', closeShortcuts);
}
const statCards = document.querySelectorAll('.stat-value');
function animateCounters() {
  statCards.forEach(card => {
    const target = Number(card.getAttribute('data-target'));
    let current = 0;
    const increment = target / 60;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        card.textContent = target;
        clearInterval(interval);
      } else {
        card.textContent = Math.floor(current);
      }
    }, 30);
  });
}
const statsPanel = document.querySelector('.stats-panel');
if (statsPanel) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounters();
      }
    });
  }, {threshold: 0.3});
  observer.observe(statsPanel);
}
const canvas = document.getElementById('networkCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth * window.devicePixelRatio;
  canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  const nodes = [];
  const nodeCount = 18;
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 1.4,
      vy: (Math.random() - 0.5) * 1.4,
      size: Math.random() * 3 + 2,
      glow: 0
    });
  }
  let time = 0;
  function drawNetwork() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    time += 0.01;
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0) node.x = canvas.offsetWidth;
      if (node.x > canvas.offsetWidth) node.x = 0;
      if (node.y < 0) node.y = canvas.offsetHeight;
      if (node.y > canvas.offsetHeight) node.y = 0;
      node.glow = Math.sin(time * 2 + Math.random()) * 0.5 + 0.5;
    });
    nodes.forEach((node, i) => {
      nodes.slice(i + 1).forEach(other => {
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(176, 38, 255, ${0.3 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      });
    });
    nodes.forEach(node => {
      ctx.fillStyle = `rgba(176, 38, 255, ${0.7 + node.glow * 0.3})`;
      ctx.shadowColor = `rgba(176, 38, 255, ${0.4 + node.glow * 0.3})`;
      ctx.shadowBlur = 8 + node.glow * 4;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowColor = 'transparent';
    requestAnimationFrame(drawNetwork);
  }
  drawNetwork();
}
document.addEventListener('keydown', e => {
  if ((e.key === ' ' || e.key === 'Enter') && document.activeElement?.classList.contains('card')) {
    document.activeElement.click();
  }
  if (e.key === 'Escape') {
    closeDetail();
    closeShortcuts();
  }
  if ((e.ctrlKey && e.key === '`') || (e.altKey && e.key.toLowerCase() === 't')) {
    e.preventDefault();
    terminalCommand?.focus();
    pushTerminal('terminal focus engaged');
  }
  if (e.key === '?') {
    e.preventDefault();
    toggleShortcuts();
  }
});
