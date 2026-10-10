/**
 * LOCO ENGINE // eLoco Productions
 * Motor JavaScript Modular Vanilla (IIFE)
 * Arquitectura: Psych-Brutalism Rave & Tech Gear Portal
 * Módulos: Countdown, Audio Synthesizer, Lineup, Tickets, Quoter, Cinema FX
 */

(() => {
  'use strict';

  // Configuración de Pasarela y Moneda
  const CONFIG = {
    exchangeRate: 7.75, // GTQ a USD
    targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000), // Próximo evento
    payMode: 'demo', // 'demo' o 'live'
    payEndpoint: '/api/pago'
  };

  // Artistas del Line-Up con Frecuencias Raíz para Síntesis de Audio
  const ARTISTS = [
    { id: 'volt', name: 'VOLTAGE_KR', genre: 'hard-techno', genreLabel: 'Hard Techno // 150 BPM', stage: 'REACTOR 01', set: '01:30 - 03:00', root: 43.65, bpm: 150 },
    { id: 'neur', name: 'NEURON PULSE', genre: 'psytrance', genreLabel: 'Psytrance & Forest // 145 BPM', stage: 'PSY-DOME', set: '23:30 - 01:00', root: 55.00, bpm: 145 },
    { id: 'hell', name: 'HELLGRID', genre: 'cyber-goth', genreLabel: 'Cyber-Goth & EBM // 132 BPM', stage: 'CORTEX WAREHOUSE', set: '03:00 - 04:30', root: 48.99, bpm: 132 },
    { id: 'masc', name: 'MASCHINE 99', genre: 'hard-techno', genreLabel: 'Industrial Techno // 155 BPM', stage: 'REACTOR 01', set: '04:30 - 06:00', root: 41.20, bpm: 155 },
    { id: 'aeth', name: 'AETHER WAVE', genre: 'post-trance', genreLabel: 'Post-Trance // 140 BPM', stage: 'SUNSET DECK', set: '21:00 - 22:30', root: 65.41, bpm: 140 },
    { id: 'dead', name: 'DEAD CIRCUIT', genre: 'cyber-goth', genreLabel: 'Dark Electro // 128 BPM', stage: 'CORTEX WAREHOUSE', set: '22:30 - 00:00', root: 51.91, bpm: 128 },
    { id: 'psyg', name: 'PSYCHOGLIDE', genre: 'psytrance', genreLabel: 'Dark Psy // 152 BPM', stage: 'PSY-DOME', set: '01:00 - 02:45', root: 58.27, bpm: 152 },
    { id: 'rhy0', name: 'RHYTHM_Ø', genre: 'hard-techno', genreLabel: 'Raw Techno // 142 BPM', stage: 'REACTOR 01', set: '00:00 - 01:30', root: 46.25, bpm: 142 },
    { id: 'null', name: 'NULL POINTER', genre: 'post-trance', genreLabel: 'Neo-Rave // 138 BPM', stage: 'SUNSET DECK', set: '19:30 - 21:00', root: 61.74, bpm: 138 },
    { id: 'luci', name: 'LUCID DRIFT', genre: 'psytrance', genreLabel: 'Full-On Psy // 148 BPM', stage: 'PSY-DOME', set: '04:00 - 06:00', root: 55.00, bpm: 148 }
  ];

  // ==========================================================================
  // MÓDULO 1: COUNTDOWN EN VIVO (#liveTicker)
  // ==========================================================================
  const initCountdown = () => {
    const el = document.getElementById('liveCountdown');
    if (!el) return;

    const update = () => {
      const now = new Date().getTime();
      const diff = CONFIG.targetDate.getTime() - now;

      if (diff <= 0) {
        el.textContent = '00D:00H:00M:00S // EN VIVO';
        return;
      }

      const days = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
      const hours = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
      const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

      el.textContent = `${days}D:${hours}H:${minutes}M:${seconds}S`;
    };

    update();
    setInterval(update, 1000);
  };

  // ==========================================================================
  // MÓDULO 2: HEADER & NAVEGACIÓN BRUTALISTA
  // ==========================================================================
  const initHeaderNav = () => {
    const header = document.getElementById('siteHeader');
    const toggle = document.getElementById('mobileNavToggle');
    const mainNav = document.getElementById('mainNav');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header?.classList.add('is-scrolled');
      } else {
        header?.classList.remove('is-scrolled');
      }
    }, { passive: true });

    if (toggle && mainNav) {
      toggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mainNav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Scrollspy para resaltar enlaces activos
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-link-brutal');

    window.addEventListener('scroll', () => {
      let currentId = '';
      const scrollPos = window.scrollY + 160;

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentId = sec.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentId}`) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });
    }, { passive: true });
  };

  // ==========================================================================
  // MÓDULO 3 & 4: WEB AUDIO API SYNTHESIZER // SÍNTESIS NATIVA PURA
  // (Kick Drum, Acid Sawtooth Bass, White Noise Hi-Hat y AnalyserNode Waveform)
  // ==========================================================================
  class LocoAudioSynthesizer {
    constructor() {
      this.ctx = null;
      this.analyser = null;
      this.isPlaying = false;
      this.bpm = 142;
      this.currentStep = 0;
      this.timerId = null;
      this.noiseBuffer = null;
      this.rootFreq = 55.0; // A1
      this.canvas = document.getElementById('waveform');
      this.canvasCtx = this.canvas ? this.canvas.getContext('2d') : null;
      this.animationFrameId = null;
    }

    init() {
      if (this.ctx) return;
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtxClass();

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.connect(this.ctx.destination);

      // Crear búfer de ruido blanco procedural de 50ms para el Hi-Hat
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }

    triggerKick(time = this.ctx.currentTime) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Pitch Envelope rápido (transitorio de impacto)
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.08);

      // Amplitude Envelope (VCA)
      gain.gain.setValueAtTime(1.0, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.32);

      osc.connect(gain);
      gain.connect(this.analyser);

      osc.start(time);
      osc.stop(time + 0.35);
    }

    triggerBass(freq = this.rootFreq, time = this.ctx.currentTime, duration = 0.22) {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      // Lowpass resonante con acento ácido
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(7.5, time);
      filter.frequency.setValueAtTime(freq * 1.5, time);
      filter.frequency.exponentialRampToValueAtTime(freq * 12, time + 0.04);
      filter.frequency.exponentialRampToValueAtTime(freq * 2, time + duration);

      // Envolvente de volumen
      gain.gain.setValueAtTime(0.65, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.analyser);

      osc.start(time);
      osc.stop(time + duration + 0.05);
    }

    triggerHat(time = this.ctx.currentTime) {
      if (!this.noiseBuffer) return;
      const source = this.ctx.createBufferSource();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      source.buffer = this.noiseBuffer;
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7000, time);

      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.analyser);

      source.start(time);
      source.stop(time + 0.07);
    }

    drawWaveform() {
      if (!this.canvasCtx || !this.analyser) return;

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const render = () => {
        this.animationFrameId = requestAnimationFrame(render);
        this.analyser.getByteFrequencyData(dataArray);

        const width = this.canvas.width;
        const height = this.canvas.height;
        this.canvasCtx.fillStyle = '#000000';
        this.canvasCtx.fillRect(0, 0, width, height);

        const barWidth = (width / bufferLength) * 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height;
          this.canvasCtx.fillStyle = '#39FF14';
          this.canvasCtx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
          x += barWidth + 1;
        }
      };

      render();
    }

    start(rootFreq = 55.0, bpm = 142) {
      this.init();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.rootFreq = rootFreq;
      this.bpm = bpm;
      this.isPlaying = true;
      this.drawWaveform();

      const stepTime = (60 / this.bpm) / 4; // semicorcheas

      const schedule = () => {
        if (!this.isPlaying) return;
        const t = this.ctx.currentTime;

        // Patrón rítmico de 16 pasos
        // Kick en 0, 4, 8, 12
        if (this.currentStep % 4 === 0) {
          this.triggerKick(t);
        }
        // Hi-Hat en 2, 6, 10, 14
        if (this.currentStep % 4 === 2) {
          this.triggerHat(t);
        }
        // Bass sincopado en pasos impares
        if (this.currentStep % 2 === 1) {
          const octaveFreq = (this.currentStep === 7 || this.currentStep === 15) ? this.rootFreq * 1.5 : this.rootFreq;
          this.triggerBass(octaveFreq, t, stepTime * 1.4);
        }

        this.currentStep = (this.currentStep + 1) % 16;
        this.timerId = setTimeout(schedule, stepTime * 1000);
      };

      schedule();
    }

    stop() {
      this.isPlaying = false;
      if (this.timerId) clearTimeout(this.timerId);
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

      // Limpiar canvas
      if (this.canvasCtx && this.canvas) {
        this.canvasCtx.fillStyle = '#000000';
        this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  const synthEngine = new LocoAudioSynthesizer();

  const initHeroRadio = () => {
    const btn = document.getElementById('radioToggle');
    const label = document.getElementById('radioStateLabel');

    if (!btn) return;

    btn.addEventListener('click', () => {
      if (synthEngine.isPlaying) {
        synthEngine.stop();
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
        if (label) label.textContent = '[ EN PAUSA // CLICK PARA INICIAR SÍNTESIS ]';
      } else {
        synthEngine.start(55.0, 142);
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
        if (label) label.textContent = '[ TRANSMITIENDO EN VIVO // 142 BPM ACID LOOP ]';
      }
    });
  };

  // ==========================================================================
  // MÓDULO 5: LINE-UP DINÁMICO & PREVIEW SINTETIZADO (#lineup)
  // ==========================================================================
  const initLineup = () => {
    const grid = document.getElementById('lineupGrid');
    const filterBtns = document.querySelectorAll('.lineup-filters .filter-btn');

    if (!grid) return;

    // Renderizar tarjetas de artistas
    grid.innerHTML = ARTISTS.map(art => `
      <div class="artist-card tilt-card" data-genre="${art.genre}" data-root="${art.root}" data-bpm="${art.bpm}">
        <div class="artist-header">
          <div class="artist-name">${art.name}</div>
          <span class="badge-brutal badge-acid">${art.stage}</span>
        </div>
        <div class="artist-meta-list">
          <div>// GÉNERO: <span class="text-white">${art.genreLabel}</span></div>
          <div>// HORARIO: <span class="text-acid">${art.set}</span></div>
          <div>// FREQ RAÍZ: <span class="text-cyan">${art.root.toFixed(2)} Hz</span></div>
        </div>
        <button type="button" class="artist-preview-btn" data-artist="${art.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span>PREVIEW SINTETIZADOR</span>
        </button>
      </div>
    `).join('');

    // Filtrado por subgénero
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const filter = btn.getAttribute('data-filter');
        const cards = grid.querySelectorAll('.artist-card');

        cards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-genre') === filter) {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });

    // Preview de audio por artista
    let currentActiveBtn = null;
    grid.querySelectorAll('.artist-preview-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.artist-card');
        const root = parseFloat(card.getAttribute('data-root'));
        const bpm = parseInt(card.getAttribute('data-bpm'), 10);

        if (synthEngine.isPlaying && currentActiveBtn === btn) {
          synthEngine.stop();
          btn.classList.remove('is-playing');
          btn.querySelector('span').textContent = 'PREVIEW SINTETIZADOR';
          currentActiveBtn = null;
        } else {
          if (currentActiveBtn) {
            currentActiveBtn.classList.remove('is-playing');
            currentActiveBtn.querySelector('span').textContent = 'PREVIEW SINTETIZADOR';
          }
          synthEngine.stop();
          synthEngine.start(root, bpm);
          btn.classList.add('is-playing');
          btn.querySelector('span').textContent = 'DETENER AUDIO';
          currentActiveBtn = btn;
        }
      });
    });
  };

  // ==========================================================================
  // MÓDULO 6: TICKETS, TIERS & MODAL DE PAGO (#tickets)
  // ==========================================================================
  const TIERS = {
    early: { name: 'EARLY BIRD PASS', price: 290, soldout: true },
    tier1: { name: 'TIER 1 GENERAL', price: 450, soldout: false },
    vip: { name: 'VIP / BACKSTAGE ACCESS', price: 950, soldout: false },
    after: { name: 'AFTER-HOURS PASS', price: 300, soldout: false }
  };

  let ticketState = {
    selectedTier: 'tier1',
    qty: 1
  };

  const updateCheckoutUI = () => {
    const tier = TIERS[ticketState.selectedTier];
    if (!tier) return;

    const totalGtq = tier.price * ticketState.qty;
    const totalUsd = (totalGtq / CONFIG.exchangeRate).toFixed(2);

    const nameEl = document.getElementById('coTierName');
    const unitEl = document.getElementById('coUnitPrice');
    const qtyEl = document.getElementById('coQtyDisplay');
    const totalGtqEl = document.getElementById('coTotalGtq');
    const totalUsdEl = document.getElementById('coTotalUsd');

    if (nameEl) nameEl.textContent = tier.name;
    if (unitEl) unitEl.textContent = `Q. ${tier.price.toFixed(2)}`;
    if (qtyEl) qtyEl.textContent = String(ticketState.qty);
    if (totalGtqEl) totalGtqEl.textContent = `Q. ${totalGtq.toFixed(2)}`;
    if (totalUsdEl) totalUsdEl.textContent = `~$${totalUsd} USD`;
  };

  const initTickets = () => {
    const tierCards = document.querySelectorAll('.tier-card');
    const btnPlus = document.getElementById('btnQtyPlus');
    const btnMinus = document.getElementById('btnQtyMinus');
    const btnCheckout = document.getElementById('btnStartCheckout');

    tierCards.forEach(card => {
      card.addEventListener('click', () => {
        const tierId = card.getAttribute('data-tier');
        if (TIERS[tierId]?.soldout) return;

        tierCards.forEach(c => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        ticketState.selectedTier = tierId;
        updateCheckoutUI();
      });
    });

    btnPlus?.addEventListener('click', () => {
      if (ticketState.qty < 10) {
        ticketState.qty++;
        updateCheckoutUI();
      }
    });

    btnMinus?.addEventListener('click', () => {
      if (ticketState.qty > 1) {
        ticketState.qty--;
        updateCheckoutUI();
      }
    });

    updateCheckoutUI();

    // Modal de Pago
    const payModal = document.getElementById('pagoSeguroModal');
    const closePayBtns = document.querySelectorAll('[data-pay-close]');
    const payForm = document.getElementById('checkoutPayForm');

    btnCheckout?.addEventListener('click', () => {
      const tier = TIERS[ticketState.selectedTier];
      const totalGtq = tier.price * ticketState.qty;
      const totalUsd = (totalGtq / CONFIG.exchangeRate).toFixed(2);

      const modalSummary = document.getElementById('payModalSummary');
      if (modalSummary) {
        modalSummary.innerHTML = `
          <div class="mb-2"><strong>PASE:</strong> ${tier.name} × ${ticketState.qty}</div>
          <div class="mb-2"><strong>TOTAL:</strong> <span class="text-acid font-mono font-bold">Q. ${totalGtq.toFixed(2)} GTQ</span> (~$${totalUsd} USD)</div>
          <div class="text-muted font-mono" style="font-size: 0.75rem;">// TASA SAT REFERENCIAL: ${CONFIG.exchangeRate} GTQ/USD</div>
        `;
      }

      payModal?.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });

    closePayBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        payModal?.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    });

    payForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = payForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="badge-brutal badge-acid">PROCESANDO TRANSACCIÓN...</span>`;

      setTimeout(() => {
        const folio = `LOC-GT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
        payModal?.classList.remove('is-active');
        document.body.style.overflow = '';
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        openGenericModal(
          `ORDEN CONFIRMADA // ${folio}`,
          `
            <div class="font-mono text-center py-3">
              <div class="text-acid mb-3" style="font-size: 2.5rem;">✔</div>
              <h4 class="text-white font-display mb-2">TRANSACCIÓN APROBADA [DEMO SAT]</h4>
              <p class="text-secondary mb-3">Se ha emitido tu comprobante electrónico con folio <strong>${folio}</strong>.</p>
              <div class="bg-card border-brutal p-3 text-start mb-3" style="font-size: 0.8rem;">
                <div>// PASE: ${TIERS[ticketState.selectedTier].name} (×${ticketState.qty})</div>
                <div>// TOTAL PAGADO: Q. ${(TIERS[ticketState.selectedTier].price * ticketState.qty).toFixed(2)} GTQ</div>
                <div>// ACCESO DIGITAL: Enviado al correo registrado</div>
                <div>// SEGURIDAD: Código QR dinámico activado 24h antes del evento</div>
              </div>
              <p class="text-muted" style="font-size: 0.7rem;">Presenta tu DPI o Pasaporte junto con el código QR en el acceso principal.</p>
            </div>
          `
        );
      }, 1200);
    });
  };

  // ==========================================================================
  // MÓDULO 7: COTIZADOR INTERACTIVO DE TECH RIDER (#cotizador)
  // ==========================================================================
  const GEAR_KITS = {
    boutique: { name: 'KIT BOUTIQUE / PRIVATE (50–150 PAX)', price: 3500 },
    warehouse: { name: 'KIT UNDERGROUND WAREHOUSE (150–500 PAX)', price: 8000 },
    camp: { name: 'KIT OUTDOOR PSY-CAMP BASE (500–1,000 PAX)', price: 18000 },
    festival: { name: 'KIT FESTIVAL MAIN STAGE (1,000–2,500+ PAX)', price: 40000 }
  };

  const initQuoter = () => {
    const quoterForm = document.getElementById('techRiderForm');
    if (!quoterForm) return;

    const calculateQuoterTotal = () => {
      let subtotal = 0;
      const breakdown = [];

      // 1. Kit de sonido base
      const selectedKitInput = quoterForm.querySelector('input[name="sound_kit"]:checked');
      if (selectedKitInput && GEAR_KITS[selectedKitInput.value]) {
        const kit = GEAR_KITS[selectedKitInput.value];
        subtotal += kit.price;
        breakdown.push({ name: kit.name, price: kit.price });
      }

      // 2. Generador Eléctrico
      const powerGenInput = quoterForm.querySelector('#quoterPowerGen');
      if (powerGenInput && powerGenInput.checked) {
        subtotal += 4500;
        breakdown.push({ name: 'Planta Eléctrica Diésel Insonorizada', price: 4500 });
      }

      // 3. Módulos de iluminación y FX
      quoterForm.querySelectorAll('.fx-checkbox-item:checked').forEach(cb => {
        const price = parseFloat(cb.getAttribute('data-price') || 0);
        const name = cb.getAttribute('data-name');
        const qtySelect = cb.closest('.checkbox-item-brutal')?.querySelector('.fx-qty-select');
        let multiplier = 1;

        if (qtySelect) {
          multiplier = parseInt(qtySelect.value, 10) || 1;
        }

        const itemTotal = price * multiplier;
        subtotal += itemTotal;
        breakdown.push({ name: `${name}${multiplier > 1 ? ` (×${multiplier})` : ''}`, price: itemTotal });
      });

      // 4. Soporte técnico y normativa
      quoterForm.querySelectorAll('.tech-support-checkbox:checked').forEach(cb => {
        const price = parseFloat(cb.getAttribute('data-price') || 0);
        const name = cb.getAttribute('data-name');
        subtotal += price;
        breakdown.push({ name, price });
      });

      // Cálculos impositivos
      const iva = subtotal * 0.12;
      const totalGtq = subtotal + iva;
      const totalUsd = (totalGtq / CONFIG.exchangeRate).toFixed(2);

      // Renderizar resumen en sidebar
      const listEl = document.getElementById('quoterBreakdownList');
      const subtotalEl = document.getElementById('quoterSubtotalGtq');
      const ivaEl = document.getElementById('quoterIvaGtq');
      const totalGtqEl = document.getElementById('quoterTotalGtq');
      const totalUsdEl = document.getElementById('quoterTotalUsd');

      if (listEl) {
        listEl.innerHTML = breakdown.map(item => `
          <li class="quoter-item-row">
            <span>${item.name}</span>
            <span class="text-white">Q. ${item.price.toFixed(2)}</span>
          </li>
        `).join('');
      }

      if (subtotalEl) subtotalEl.textContent = `Q. ${subtotal.toFixed(2)}`;
      if (ivaEl) ivaEl.textContent = `Q. ${iva.toFixed(2)}`;
      if (totalGtqEl) totalGtqEl.textContent = `Q. ${totalGtq.toFixed(2)}`;
      if (totalUsdEl) totalUsdEl.textContent = `~$${totalUsd} USD`;

      return { subtotal, iva, totalGtq, totalUsd, breakdown };
    };

    quoterForm.addEventListener('change', calculateQuoterTotal);
    calculateQuoterTotal();

    // Botón Enviar a Revisión
    const btnSubmit = document.getElementById('btnSubmitRider');
    btnSubmit?.addEventListener('click', (e) => {
      e.preventDefault();
      const state = calculateQuoterTotal();
      const clientName = document.getElementById('riderClientName')?.value || 'Productor Independiente';
      const nit = document.getElementById('riderClientNit')?.value || 'CF';
      const email = document.getElementById('riderClientEmail')?.value || 'sin-correo@locoproductions.gt';
      const phone = document.getElementById('riderClientPhone')?.value || 'No especificado';
      const eventType = document.getElementById('riderEventType')?.value || 'Rave Subterráneo';
      const location = document.getElementById('riderLocation')?.value || 'Ciudad de Guatemala';

      const folio = `RIDER-LOC-${Math.floor(10000 + Math.random() * 90000)}`;

      openGenericModal(
        `TECH RIDER GENERADO // ${folio}`,
        `
          <div class="font-mono py-2">
            <div class="badge-brutal badge-acid mb-3">FOLIO DE COTIZACIÓN TÉCNICA: ${folio}</div>
            <p class="text-secondary mb-3">La solicitud ha sido registrada en el sistema de asignación de riders de eLoco Productions.</p>
            <div class="bg-card border-brutal p-3 mb-3" style="font-size: 0.78rem;">
              <div>// CLIENTE / NIT: <strong>${clientName}</strong> (NIT: ${nit})</div>
              <div>// LOCACIÓN / TIPO: ${location} // ${eventType}</div>
              <div>// CONTACTO: ${email} // Tel: ${phone}</div>
              <div class="border-top border-secondary my-2"></div>
              <div>// TOTAL ESTIMADO (INC. IVA 12%): <strong class="text-acid">Q. ${state.totalGtq.toFixed(2)} GTQ</strong> (~$${state.totalUsd} USD)</div>
            </div>
            <p class="text-muted" style="font-size: 0.7rem;">Un ingeniero acústico se comunicará vía WhatsApp en un plazo menor a 2 horas para coordinar la visita técnica y el contrato.</p>
          </div>
        `
      );
    });

    // Botón Exportar en WhatsApp
    const btnWhatsapp = document.getElementById('btnWhatsappRider');
    btnWhatsapp?.addEventListener('click', (e) => {
      e.preventDefault();
      const state = calculateQuoterTotal();
      const clientName = document.getElementById('riderClientName')?.value || 'Productor';
      const eventType = document.getElementById('riderEventType')?.value || 'Evento';
      const location = document.getElementById('riderLocation')?.value || 'Guatemala';

      let msg = `*SOLICITUD DE TECH RIDER // eLoco Productions*\n`;
      msg += `Productor/Razón Social: ${clientName}\n`;
      msg += `Tipo de Evento: ${eventType}\n`;
      msg += `Locación: ${location}\n\n`;
      msg += `*DESGLOSE DE EQUIPO:*\n`;
      state.breakdown.forEach(item => {
        msg += `• ${item.name}: Q. ${item.price.toFixed(2)}\n`;
      });
      msg += `\n*TOTAL (INC. IVA): Q. ${state.totalGtq.toFixed(2)} GTQ* (~$${state.totalUsd} USD)\n`;
      msg += `Solicito confirmación de disponibilidad técnica de fechas.`;

      const waUrl = `https://wa.me/50255550000?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
    });
  };

  // ==========================================================================
  // MÓDULO 8: ACORDEÓN BRUTALISTA (#protocolo)
  // ==========================================================================
  const initAccordion = () => {
    const items = document.querySelectorAll('.accordion-item-brutal');
    items.forEach(item => {
      const btn = item.querySelector('.accordion-header-btn');
      const panel = item.querySelector('.accordion-collapse-panel');

      btn?.addEventListener('click', () => {
        const isOpen = panel?.classList.contains('is-open');

        // Cerrar los demás
        items.forEach(other => {
          other.querySelector('.accordion-collapse-panel')?.classList.remove('is-open');
          other.querySelector('.accordion-header-btn')?.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          panel?.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  };

  // ==========================================================================
  // MÓDULO 9: CONTADORES ANIMADOS
  // ==========================================================================
  const initCounters = () => {
    const counters = document.querySelectorAll('.stat-value[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target'), 10);
          const suffix = entry.target.getAttribute('data-suffix') || '';
          let count = 0;
          const step = Math.ceil(target / 40);

          const timer = setInterval(() => {
            count += step;
            if (count >= target) {
              entry.target.innerHTML = `${target}<span>${suffix}</span>`;
              clearInterval(timer);
            } else {
              entry.target.innerHTML = `${count}<span>${suffix}</span>`;
            }
          }, 30);

          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  };

  // ==========================================================================
  // MÓDULO 10: GUESTLIST FORM
  // ==========================================================================
  const initGuestlist = () => {
    const form = document.getElementById('guestlistForm');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('guestEmail')?.value;
      const phone = document.getElementById('guestPhone')?.value;

      openGenericModal(
        'GUESTLIST CONFIRMADA',
        `
          <div class="font-mono text-center py-2">
            <div class="text-acid mb-2 font-display" style="font-size: 2rem;">[ ACCESO SECRETO REGISTRADO ]</div>
            <p class="text-secondary mb-3">Has sido añadido a la lista prioritaria de alertas y drops VIP con el correo <strong>${email}</strong> y teléfono <strong>${phone}</strong>.</p>
            <div class="bg-card border-brutal p-3 text-start" style="font-size: 0.75rem;">
              <div>// TRANSMISIÓN: Coordenadas secretas 24 horas antes del rave</div>
              <div>// PRIORIDAD: Acceso asegurado a Early Bird drops del próximo festival</div>
            </div>
          </div>
        `
      );
      form.reset();
    });
  };

  // ==========================================================================
  // MÓDULO 11: MODAL GENÉRICO ACCESIBLE
  // ==========================================================================
  const openGenericModal = (title, bodyHtml) => {
    const backdrop = document.getElementById('modalBackdrop');
    const titleEl = document.getElementById('modalBackdropTitle');
    const bodyEl = document.getElementById('modalBackdropBody');

    if (!backdrop || !titleEl || !bodyEl) return;

    titleEl.textContent = title;
    bodyEl.innerHTML = bodyHtml;
    backdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    const closeBtn = document.getElementById('modalBackdropClose');
    const closeHandler = () => {
      backdrop.classList.remove('is-active');
      document.body.style.overflow = '';
      closeBtn?.removeEventListener('click', closeHandler);
    };
    closeBtn?.addEventListener('click', closeHandler);
  };

  // ==========================================================================
  // MÓDULO 12: AFTERMOVIE TEASER
  // ==========================================================================
  const initAftermovie = () => {
    const btn = document.getElementById('playAftermovieBtn');
    btn?.addEventListener('click', () => {
      openGenericModal(
        'AFTERMOVIE TEASER // EXPERIENCIA PSICODÉLICA',
        `
          <div class="ratio ratio-16x9 bg-black border-brutal">
            <div class="d-flex flex-column align-items-center justify-content-center text-center p-4">
              <div class="badge-brutal badge-pink mb-3">[ TRANSMISIÓN 4K ARCHIVADA ]</div>
              <h4 class="text-white font-display">NEON CIRCUIT // OFFICIAL RECAP 2025</h4>
              <p class="text-secondary font-mono" style="font-size: 0.8rem;">Filmado en locación secreta con audio multicanal masterizado y tecnología láser volumétrica.</p>
              <div class="mt-3">
                <button type="button" class="btn-brutal btn-acid" onclick="document.getElementById('modalBackdropClose').click();">
                  [ VOLVER AL SITIO ]
                </button>
              </div>
            </div>
          </div>
        `
      );
    });
  };

  // ==========================================================================
  // MÓDULO 13: CINEMA FX // CANVAS AURORA, CURSOR, TILT, SCROLL PROGRESS
  // ==========================================================================
  const initCinemaFX = () => {
    // Si el usuario prefiere movimiento reducido, abortar FX pesados
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // 1. Barra de Scroll Progress
    const progressBar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      if (progressBar) progressBar.style.width = `${progress}%`;
    }, { passive: true });

    // 2. Cursor Psicodélico con Interpolación Lerp
    const cursorRing = document.getElementById('locoCursor');
    const cursorDot = document.getElementById('locoCursorDot');

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Variables CSS globales para parallax y aberración
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
      document.documentElement.style.setProperty('--mxn', nx.toFixed(3));
      document.documentElement.style.setProperty('--myn', ny.toFixed(3));

      if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
      }
    });

    const updateCursor = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (cursorRing) {
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
      }
      requestAnimationFrame(updateCursor);
    };
    requestAnimationFrame(updateCursor);

    // Detección de elementos interactivos (.is-hot)
    const hotElements = document.querySelectorAll('button, a, input, select, .tier-card, .artist-card, .gear-card');
    hotElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing?.classList.add('is-hot'));
      el.addEventListener('mouseleave', () => cursorRing?.classList.remove('is-hot'));
    });

    // 3. Canvas Aurora Reactivo con Blobs Orbitales y Partículas
    const canvas = document.getElementById('fxCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let width = canvas.width = window.innerWidth;
      let height = canvas.height = window.innerHeight;

      window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      });

      // 3 Blobs orbitales
      const blobs = [
        { x: width * 0.3, y: height * 0.4, r: 180, color: 'rgba(57, 255, 20, 0.08)', angle: 0, speed: 0.008 },
        { x: width * 0.7, y: height * 0.6, r: 220, color: 'rgba(138, 43, 226, 0.07)', angle: 2, speed: 0.006 },
        { x: width * 0.5, y: height * 0.3, r: 160, color: 'rgba(255, 0, 127, 0.06)', angle: 4, speed: 0.007 }
      ];

      // Partículas luminosas
      const particleCount = 45;
      const particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.2
        });
      }

      const renderAurora = () => {
        ctx.clearRect(0, 0, width, height);

        // Render blobs
        blobs.forEach(b => {
          b.angle += b.speed;
          const bx = b.x + Math.cos(b.angle) * 80 + (mouseX * 0.05);
          const by = b.y + Math.sin(b.angle) * 80 + (mouseY * 0.05);

          const grad = ctx.createRadialGradient(bx, by, 0, bx, by, b.r);
          grad.addColorStop(0, b.color);
          grad.addColorStop(1, 'transparent');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(bx, by, b.r, 0, Math.PI * 2);
          ctx.fill();
        });

        // Render partículas
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Atracción sutil al mouse
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 10) {
            p.x += (dx / dist) * 0.8;
            p.y += (dy / dist) * 0.8;
          }

          ctx.fillStyle = `rgba(57, 255, 20, ${p.alpha})`;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        });

        requestAnimationFrame(renderAurora);
      };

      requestAnimationFrame(renderAurora);
    }

    // 4. Microinteracción 3D Tilt en Tarjetas
    const tiltCards = document.querySelectorAll('.tilt-card, .event-card, .gear-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        const rotateX = ((y - cy) / cy) * -6;
        const rotateY = ((x - cx) / cx) * 6;

        card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  };

  // ==========================================================================
  // MÓDULO 14: CICLO DE VIDA (Pausar audio si se cambia de pestaña)
  // ==========================================================================
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && synthEngine.isPlaying) {
      synthEngine.stop();
      const radioToggle = document.getElementById('radioToggle');
      if (radioToggle) {
        radioToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
      }
      const radioLabel = document.getElementById('radioStateLabel');
      if (radioLabel) radioLabel.textContent = '[ EN PAUSA // CLICK PARA INICIAR SÍNTESIS ]';
    }
  });

  // ==========================================================================
  // INICIALIZACIÓN GLOBAL EN DOMContentLoaded
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initHeaderNav();
    initHeroRadio();
    initLineup();
    initTickets();
    initQuoter();
    initAccordion();
    initCounters();
    initGuestlist();
    initAftermovie();
    initCinemaFX();

    // Exportar API para consola o tests
    window.LOCO = {
      synth: synthEngine,
      state: ticketState,
      artists: ARTISTS,
      config: CONFIG
    };
  });
})();
