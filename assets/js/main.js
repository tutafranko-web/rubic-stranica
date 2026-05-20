/* =========================================================
   TRANSFER SPLIT — Premium interactivity
   ========================================================= */

(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- YEAR ----- */
  $$('#year').forEach(el => el.textContent = new Date().getFullYear());

  /* ----- PAGE LOADER ----- */
  const loader = $('.loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 500);
    });
  }

  /* ----- SCROLL PROGRESS ----- */
  const sp = $('.scroll-progress__fill');
  if (sp) {
    const updateProgress = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      sp.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ----- STICKY HEADER SHADOW ----- */
  const header = $('.header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----- MOBILE NAV ----- */
  const burger = $('.burger');
  const nav = $('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('nav--open');
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('nav--open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }));
  }

  /* ----- DATE INPUT MIN = TODAY ----- */
  const today = new Date().toISOString().split('T')[0];
  $$('input[type="date"]').forEach(i => i.min = today);

  /* ----- REVEAL ON SCROLL (Intersection Observer) ----- */
  if (!rm) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    // Default reveals
    $$('.service-card, .destination-card, .why-card, .testimonial, .step, .trust__item, .faq-item, .pricing-row, .fleet__visual, .fleet__text, .booking-full__wrap').forEach(el => {
      el.classList.add('fade-in');
      revealObserver.observe(el);
    });

    // Stagger grids
    $$('.services-grid, .destinations-grid, .why-grid, .trust__inner, .testimonials-grid, .steps').forEach(grid => {
      grid.classList.add('stagger');
      revealObserver.observe(grid);
    });
  }

  /* ----- ANIMATED COUNTERS ----- */
  const counters = $$('[data-counter]');
  if (counters.length && !rm) {
    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.counter);
      const decimals = parseInt(el.dataset.decimals || '0');
      const duration = parseInt(el.dataset.duration || '1800');
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        const value = target * eased;
        el.textContent = prefix + value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target.toFixed(decimals) + suffix;
      };
      requestAnimationFrame(step);
    };

    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(c => counterObs.observe(c));
  }

  /* ----- HERO PARALLAX + ROUTE FLOAT ----- */
  if (!rm) {
    const hero = $('.hero');
    if (hero) {
      let ticking = false;
      const updateHero = () => {
        const rect = hero.getBoundingClientRect();
        const max = window.innerHeight;
        if (rect.bottom > 0 && rect.top < max) {
          const scrolled = Math.max(0, -rect.top);
          hero.style.setProperty('--hero-y', (scrolled * 0.3) + 'px');
          hero.style.setProperty('--hero-zoom', (1.05 + scrolled * 0.0003).toFixed(3));
        }
        ticking = false;
      };
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(updateHero);
          ticking = true;
        }
      }, { passive: true });
    }
  }

  /* ----- HERO TITLE CHARACTER REVEAL ----- */
  if (!rm) {
    const title = $('.hero__title');
    if (title && !title.dataset.split) {
      title.dataset.split = '1';
      // Split into words and chars but preserve <em> tags
      const split = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          const words = node.textContent.split(/(\s+)/);
          words.forEach(w => {
            if (/^\s+$/.test(w)) {
              frag.appendChild(document.createTextNode(w));
            } else if (w.length) {
              const wordSpan = document.createElement('span');
              wordSpan.className = 'word';
              [...w].forEach((ch, i) => {
                const c = document.createElement('span');
                c.className = 'char';
                c.style.animationDelay = (i * 30) + 'ms';
                c.textContent = ch;
                wordSpan.appendChild(c);
              });
              frag.appendChild(wordSpan);
            }
          });
          node.parentNode.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes.length) {
          [...node.childNodes].forEach(split);
        }
      };
      split(title);
    }
  }

  /* ----- MAGNETIC BUTTONS ----- */
  if (!rm && !window.matchMedia('(hover: none)').matches) {
    $$('[data-magnetic]').forEach(btn => {
      const strength = parseFloat(btn.dataset.magnetic) || 0.25;
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ----- 3D TILT CARDS ----- */
  if (!rm && !window.matchMedia('(hover: none)').matches) {
    $$('.tilt').forEach(card => {
      let raf;
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotY = (x - 0.5) * 10;
        const rotX = -(y - 0.5) * 10;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
        });
        // Track mouse for the glow
        card.style.setProperty('--mx', (x * 100) + '%');
        card.style.setProperty('--my', (y * 100) + '%');
      });
      card.addEventListener('mouseleave', () => {
        cancelAnimationFrame(raf);
        card.style.transform = '';
      });
    });
  }

  /* ----- LIVE BOOKING NOTIFICATIONS ----- */
  const notifyEl = $('#notify');
  if (notifyEl) {
    const lang = document.documentElement.lang || 'hr';
    const bookings = {
      hr: [
        { name: 'Marko', route: 'Aerodrom Split → Makarska', time: 'prije 3 minute' },
        { name: 'Sarah K.', route: 'Split → Dubrovnik', time: 'prije 7 minuta' },
        { name: 'Thomas', route: 'Aerodrom → Trogir', time: 'prije 12 minuta' },
        { name: 'Ana', route: 'Split → Hvar (trajekt)', time: 'prije 18 minuta' },
        { name: 'Lukas M.', route: 'Aerodrom → Omiš', time: 'prije 24 minute' },
        { name: 'Elena', route: 'Split → Plitvice', time: 'prije 31 minutu' },
        { name: 'Ivan', route: 'Split → Mostar', time: 'prije 38 minuta' },
      ],
      en: [
        { name: 'Marko', route: 'Split Airport → Makarska', time: '3 min ago' },
        { name: 'Sarah K.', route: 'Split → Dubrovnik', time: '7 min ago' },
        { name: 'Thomas', route: 'Airport → Trogir', time: '12 min ago' },
        { name: 'Anna', route: 'Split → Hvar (ferry)', time: '18 min ago' },
        { name: 'Lukas M.', route: 'Airport → Omiš', time: '24 min ago' },
        { name: 'Elena', route: 'Split → Plitvice', time: '31 min ago' },
        { name: 'Ivan', route: 'Split → Mostar', time: '38 min ago' },
      ],
      de: [
        { name: 'Markus', route: 'Flughafen Split → Makarska', time: 'vor 3 Min.' },
        { name: 'Sarah K.', route: 'Split → Dubrovnik', time: 'vor 7 Min.' },
        { name: 'Thomas', route: 'Flughafen → Trogir', time: 'vor 12 Min.' },
        { name: 'Anna', route: 'Split → Hvar (Fähre)', time: 'vor 18 Min.' },
        { name: 'Lukas M.', route: 'Flughafen → Omiš', time: 'vor 24 Min.' },
        { name: 'Elena', route: 'Split → Plitvice', time: 'vor 31 Min.' },
        { name: 'Ivan', route: 'Split → Mostar', time: 'vor 38 Min.' },
      ]
    };
    const list = bookings[lang] || bookings.hr;
    const label = { hr: 'Nova rezervacija', en: 'New booking', de: 'Neue Buchung' }[lang] || 'Nova rezervacija';
    let idx = 0;
    let timer;
    const textEl = $('.notify__text', notifyEl);

    const showOne = () => {
      const b = list[idx % list.length];
      textEl.innerHTML = `<strong>${label}</strong>${b.name} · ${b.route}<span>${b.time}</span>`;
      notifyEl.classList.add('show');
      idx++;
      timer = setTimeout(() => {
        notifyEl.classList.remove('show');
        timer = setTimeout(showOne, 6500);
      }, 5500);
    };

    // Start after a delay so it doesn't compete with loader/hero
    setTimeout(showOne, 6000);

    $('.notify__close', notifyEl)?.addEventListener('click', () => {
      notifyEl.classList.remove('show');
      clearTimeout(timer);
    });
  }

  /* ----- COOKIE BANNER ----- */
  const cookie = $('#cookie');
  if (cookie) {
    const KEY = 'ts-cookie-v1';
    if (!localStorage.getItem(KEY)) {
      setTimeout(() => cookie.classList.add('show'), 2500);
    }
    $$('[data-cookie]', cookie).forEach(btn => {
      btn.addEventListener('click', () => {
        localStorage.setItem(KEY, btn.dataset.cookie);
        cookie.classList.remove('show');
      });
    });
  }

  /* ----- BACK TO TOP ----- */
  const backTop = $('.back-top');
  if (backTop) {
    const updateBack = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      backTop.classList.toggle('visible', window.scrollY > 600);
      backTop.style.setProperty('--progress', pct + '%');
    };
    window.addEventListener('scroll', updateBack, { passive: true });
    backTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: rm ? 'auto' : 'smooth' });
    });
    updateBack();
  }

  /* ----- STICKY CTA BAR (appears after hero) ----- */
  const sticky = $('.sticky-cta');
  const heroSection = $('.hero');
  if (sticky && heroSection) {
    const stickyObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        sticky.classList.toggle('show', !entry.isIntersecting && window.scrollY > 500);
      });
    }, { threshold: 0 });
    stickyObs.observe(heroSection);
  }

  /* ----- LIGHTBOX ----- */
  const lightbox = $('#lightbox');
  if (lightbox) {
    const img = $('.lightbox__img', lightbox);
    const close = () => lightbox.classList.remove('open');
    $$('[data-lightbox]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const src = trigger.dataset.lightbox || trigger.src || trigger.querySelector('img')?.src;
        if (src) {
          img.src = src;
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });
    $('.lightbox__close', lightbox)?.addEventListener('click', () => {
      close();
      document.body.style.overflow = '';
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        close();
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        close();
        document.body.style.overflow = '';
      }
    });
  }

  /* ----- SMOOTH ANCHOR SCROLL with HEADER OFFSET ----- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length <= 1) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerH = (header?.offsetHeight || 80) + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: rm ? 'auto' : 'smooth' });
    });
  });

  /* ----- HERO BOOKING -> MAIN BOOKING (sync values) ----- */
  const heroForm = $('.booking-card');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = ['pickup', 'dropoff', 'date', 'passengers'];
      fields.forEach(f => {
        const src = heroForm.querySelector(`[name="${f}"]`);
        const dst = document.getElementById('hf-' + f);
        if (src && dst) dst.value = src.value;
      });
      // Scroll to main form
      const target = $('#rezervacija, #booking, #buchung');
      if (target) {
        const headerH = (header?.offsetHeight || 80) + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: rm ? 'auto' : 'smooth' });
        // Highlight form briefly
        const wrap = $('.booking-full__wrap');
        if (wrap) {
          wrap.style.boxShadow = '0 0 0 4px rgba(201,169,97,.4), 0 20px 40px -12px rgba(11,30,63,.18)';
          setTimeout(() => wrap.style.boxShadow = '', 1800);
        }
      }
    });
  }

  /* ----- LAZY LOAD INTERSECTION FOR IFRAMES ----- */
  $$('iframe[loading="lazy"]').forEach(iframe => {
    // Already native-lazy; just observe to add fade-in
    iframe.style.opacity = '0';
    iframe.style.transition = 'opacity 600ms ease';
    iframe.addEventListener('load', () => iframe.style.opacity = '1');
  });

  /* ----- FORM SUBMIT FEEDBACK ----- */
  $$('form[action*="formsubmit"]').forEach(form => {
    form.addEventListener('submit', (e) => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.dataset.original = btn.innerHTML;
        btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:10px"><span style="width:16px;height:16px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin 700ms linear infinite"></span>Šalje se...</span>';
        btn.disabled = true;
      }
    });
  });
  // Spinner keyframes (injected once)
  if (!document.getElementById('spin-keys')) {
    const style = document.createElement('style');
    style.id = 'spin-keys';
    style.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
    document.head.appendChild(style);
  }

  /* ----- PRICING ROW CLICK -> PREFILL BOOKING ----- */
  $$('.pricing-row:not(.pricing-row--head)').forEach(row => {
    row.addEventListener('click', () => {
      const route = row.querySelector('.pricing-row__route')?.textContent.trim();
      if (!route) return;
      const arrow = route.includes('→') ? '→' : '-';
      const parts = route.split(arrow).map(p => p.trim());
      if (parts.length !== 2) return;

      const pickup = document.getElementById('hf-pickup');
      const dropoff = document.getElementById('hf-dropoff');
      if (pickup) {
        // Strip icon text artifacts
        pickup.value = parts[0].replace(/^\s*[​-‍﻿]?\s*/, '').replace(/\s+/g, ' ').trim();
        pickup.parentElement?.classList.add('field--pulse');
      }
      if (dropoff) {
        dropoff.value = parts[1].replace(/\s+/g, ' ').trim();
        dropoff.parentElement?.classList.add('field--pulse');
      }
      setTimeout(() => {
        document.querySelectorAll('.field--pulse').forEach(f => f.classList.remove('field--pulse'));
      }, 1600);

      // Scroll to booking section
      const target = $('#rezervacija, #booking, #buchung');
      if (target) {
        const headerH = (header?.offsetHeight || 80) + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: rm ? 'auto' : 'smooth' });
      }
    });
  });

  /* ----- DESTINATION CARD CLICK -> PREFILL BOOKING ----- */
  $$('.destination-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const dest = card.querySelector('.destination-info h3')?.textContent.trim();
      if (!dest) return;
      const dropoff = document.getElementById('hf-dropoff');
      const pickup = document.getElementById('hf-pickup');
      const lang = document.documentElement.lang || 'hr';
      const defaults = {
        hr: 'Aerodrom Split',
        en: 'Split Airport',
        de: 'Flughafen Split'
      };
      if (dropoff) {
        dropoff.value = dest;
        dropoff.parentElement?.classList.add('field--pulse');
      }
      if (pickup && !pickup.value) {
        pickup.value = defaults[lang] || defaults.hr;
        pickup.parentElement?.classList.add('field--pulse');
      }
      setTimeout(() => {
        document.querySelectorAll('.field--pulse').forEach(f => f.classList.remove('field--pulse'));
      }, 1600);

      const target = $('#rezervacija, #booking, #buchung');
      if (target) {
        const headerH = (header?.offsetHeight || 80) + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: rm ? 'auto' : 'smooth' });
      }
    });
  });

  /* ----- CUSTOM CURSOR (desktop with mouse only) ----- */
  if (!rm && window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth > 1024) {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.classList.add('has-cursor');

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf;

    const move = (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    };
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      raf = requestAnimationFrame(loop);
    };
    document.addEventListener('mousemove', move);
    loop();

    // Hover state on interactive elements
    const hoverables = 'a,button,[data-magnetic],input,select,textarea,.destination-card,.service-card,.pricing-row:not(.pricing-row--head),.faq-item summary,.gallery-item,.fleet__visual,.testimonial';
    document.querySelectorAll(hoverables).forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('hover');
        dot.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('hover');
        dot.classList.remove('hover');
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      dot.classList.add('hide');
      ring.classList.add('hide');
    });
    document.addEventListener('mouseenter', () => {
      dot.classList.remove('hide');
      ring.classList.remove('hide');
    });
  }

  /* ----- ESCAPE: close mobile nav ----- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      nav?.classList.remove('nav--open');
      burger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

})();
