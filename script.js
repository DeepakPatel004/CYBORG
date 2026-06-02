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
    el.style.transform = `perspective(900px) rotateX(${-rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
    el.style.transition = 'transform .45s cubic-bezier(.2,.9,.2,.9)';
    setTimeout(() => {
      el.style.transition = '';
    }, 450);
  });
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
    const max = 24;
    const strength = Math.min(1, 140 / (distance || 1));
    const tx = (x / rect.width) * max * strength;
    const ty = (y / rect.height) * max * strength;
    button.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${1 + strength * 0.01})`;
    button.style.boxShadow = `0 18px 68px rgba(176,38,255,0.42), ${tx * 1.4}px ${ty * 1.4}px 54px rgba(138,43,226,0.22)`;
  });
  button.addEventListener('mouseleave', () => {
    button.style.transform = '';
    button.style.boxShadow = '';
    button.style.transition = 'transform .35s ease, box-shadow .35s ease';
    setTimeout(() => {
      button.style.transition = '';
    }, 350);
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
    const lower = command.toLowerCase();
    if (lower === 'help') {
      pushTerminal('commands: help | clear | status | reboot | logs');
    } else if (lower === 'clear') {
      const log = document.getElementById('terminalLog');
      if (log) {
        log.innerHTML = '';
      }
    } else if (lower === 'status') {
      pushTerminal('SYSTEM STATUS: CORE STABLE | NETWORK LOW | INTEGRATION READY');
    } else if (lower === 'reboot') {
      pushTerminal('REBOOT SEQUENCE ENGAGED...');
      setTimeout(() => pushTerminal('RESTART COMPLETE'), 800);
    } else if (lower === 'logs') {
      pushTerminal('log count: ' + commandHistory.length);
    } else {
      pushTerminal(`UNKNOWN COMMAND: ${command}`);
    }
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
document.addEventListener('keydown', e => {
  if ((e.key === ' ' || e.key === 'Enter') && document.activeElement?.classList.contains('card')) {
    document.activeElement.click();
  }
  if (e.key === 'Escape') {
    closeDetail();
  }
  if ((e.ctrlKey && e.key === '`') || (e.altKey && e.key.toLowerCase() === 't')) {
    e.preventDefault();
    terminalCommand?.focus();
    pushTerminal('terminal focus engaged');
  }
});
