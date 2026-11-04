(function () {
  'use strict';

  // ---- БАЗОВЫЕ УТИЛИТЫ ----
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const API_URL = 'https://uralway-api.de1.netrun.io'; // Твой сервер

  // ---- БУРГЕР-МЕНЮ ----
  const burger = $('#burger');
  const mainNav = $('#mainNav');

  if (burger && mainNav) {
    burger.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      burger.classList.toggle('is-active', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
    });

    // Закрываем меню при клике на ссылку
    $$('.nav-link', mainNav).forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        burger.classList.remove('is-active');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- АНИМАЦИЯ ПОЯВЛЕНИЯ ----
  const revealEls = $$('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('is-visible'), i * 90);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
      revealEls.forEach(el => io.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('is-visible'));
    }
  }

  // ---- СЛОВАРИ ДЛЯ КАЛЬКУЛЯЦИИ ----
  const PRICES = {
    'Магнитогорск-Оренбург': { price: 2500, km: 436 }, 'Оренбург-Магнитогорск': { price: 2500, km: 436 },
    'Магнитогорск-Саракташ': { price: 2000, km: 340 }, 'Саракташ-Магнитогорск': { price: 2000, km: 340 },
    'Магнитогорск-Кугарчи': { price: 1500, km: 320 },  'Кугарчи-Магнитогорск': { price: 1500, km: 320 },
    'Магнитогорск-Исянгулово': { price: 1700, km: 281 }, 'Исянгулово-Магнитогорск': { price: 1700, km: 281 },
    'Магнитогорск-Зилаир': { price: 1300, km: 212 },   'Зилаир-Магнитогорск': { price: 1300, km: 212 },
    'Магнитогорск-Юлдыбаево': { price: 1000, km: 176 }, 'Юлдыбаево-Магнитогорск': { price: 1000, km: 176 },
    'Магнитогорск-Баймак': { price: 700, km: 136 },    'Баймак-Магнитогорск': { price: 700, km: 136 },
    'Магнитогорск-Сибай': { price: 500, km: 98 },      'Сибай-Магнитогорск': { price: 500, km: 98 },
    'Сибай-Оренбург': { price: 2000, km: 338 },        'Оренбург-Сибай': { price: 2000, km: 338 },
    'Сибай-Саракташ': { price: 1500, km: 242 },        'Саракташ-Сибай': { price: 1500, km: 242 },
    'Сибай-Кугарчи': { price: 1100, km: 220 },         'Кугарчи-Сибай': { price: 1100, km: 220 },
    'Сибай-Исянгулово': { price: 1200, km: 183 },      'Исянгулово-Сибай': { price: 1200, km: 183 },
    'Сибай-Зилаир': { price: 800, km: 114 },           'Зилаир-Сибай': { price: 800, km: 114 },
    'Баймак-Оренбург': { price: 1800, km: 300 },       'Оренбург-Баймак': { price: 1800, km: 300 },
    'Баймак-Саракташ': { price: 1300, km: 204 },       'Саракташ-Баймак': { price: 1300, km: 204 },
    'Баймак-Исянгулово': { price: 1000, km: 145 },     'Исянгулово-Баймак': { price: 1000, km: 145 },
    'Баймак-Зилаир': { price: 600, km: 76 },           'Зилаир-Баймак': { price: 600, km: 76 },
    'Юлдыбаево-Оренбург': { price: 1500, km: 260 },    'Оренбург-Юлдыбаево': { price: 1500, km: 260 },
    'Юлдыбаево-Саракташ': { price: 1100, km: 164 },    'Саракташ-Юлдыбаево': { price: 1100, km: 164 },
    'Юлдыбаево-Исянгулово': { price: 900, km: 105 },   'Исянгулово-Юлдыбаево': { price: 900, km: 105 },
    'Юлдыбаево-Зилаир': { price: 400, km: 36 },        'Зилаир-Юлдыбаево': { price: 400, km: 36 },
    'Зилаир-Оренбург': { price: 1300, km: 224 },       'Оренбург-Зилаир': { price: 1300, km: 224 },
    'Зилаир-Саракташ': { price: 900, km: 128 },        'Саракташ-Зилаир': { price: 900, km: 128 },
    'Зилаир-Исянгулово': { price: 500, km: 69 },       'Исянгулово-Зилаир': { price: 500, km: 69 },
    'Кугарчи-Оренбург': { price: 1200, km: 125 },      'Оренбург-Кугарчи': { price: 1200, km: 125 },
    'Аманат-Оренбург': { price: 1000, km: 110 },       'Оренбург-Аманат': { price: 1000, km: 110 },
    'Тазларово-Оренбург': { price: 1000, km: 110 },    'Оренбург-Тазларово': { price: 1000, km: 110 },
    'Исянгулово-Оренбург': { price: 900, km: 155 },    'Оренбург-Исянгулово': { price: 900, km: 155 },
    'Саракташ-Оренбург': { price: 500, km: 96 },       'Оренбург-Саракташ': { price: 500, km: 96 }
  };

  const DRIVERS = {
    '1': { name: 'Кадников Андрей Анатольевич', experience: 'с 1998 г.', car: 'HYUNDAI STARIA (минивэн)', color: 'чёрный', number: 'уточняется' },
    '2': { name: 'Фомин Александр Владимирович', experience: 'с 2004 г.', car: 'HYUNDAI GRAND STAREX (минивэн)', color: 'серебристый металлик', number: 'уточняется' }
  };

  // Телефоны администраторов — единое место для всех сообщений на сайте и в админке
  const ADMIN_PHONES = ['+7 (919) 400-64-14', '+7 (919) 325-15-39'];

  // ---- ТОЧКИ ПОСАДКИ ----
  // Время указано для выезда в прямом направлении (Магнитогорск ➔ Оренбург).
  // Пустое время = пока уточняется. Для обратного рейса можно добавить поле timeBack: "HH:MM".
  const CITY_STOPS = {
    'Магнитогорск': [ { time: '09:00', address: 'Гостиный двор (К.Маркса 153)' } ],
    'Сибай': [
      { time: '10:10', address: 'Семейный Магнит (Индустриальное шоссе 16/2)' },
      { time: '10:15', address: 'Автобусная остановка по Горняков 6' },
      { time: '10:20', address: 'Магазин Магнит (Горняков 12)' },
      { time: '10:25', address: 'Кафе Симург (Ленина 15)' }
    ],
    'Баймак': [ { time: '', address: 'ЗАГС (Ленина 77)' }, { time: '', address: 'Гостиница Южный' } ],
    'Юлдыбаево': [ { time: '', address: 'Кафе Халяль (Молодежная 19/4)' } ],
    'Зилаир': [ { time: '', address: 'Автовокзал (Голубцова 123)' } ],
    'Кугарчи': [ { time: '', address: 'Автобусная остановка' } ],
    'Аманат': [ { time: '', address: 'Кафе Аманат' } ],
    'Тазларово': [ { time: '', address: 'Автобусная остановка' } ],
    'Исянгулово': [ { time: '', address: 'Автовокзал' }, { time: '', address: 'Магазин Пятерочка (Новопавловка, ул Мира 1а)' } ],
    'Саракташ': [ { time: '', address: 'Магазин Магнит, Ватутина 9' } ],
    'Оренбург': [
      { time: '', address: 'Микрохирургия глаза, Салмышская 17' },
      { time: '', address: 'ТК Уют, Салмышская 24' },
      { time: '', address: 'ТЦ Чайка, Гагарина 29/2' }
    ]
  };

  // Населённые пункты, у которых есть маршруты только до перечисленных городов (и обратно) — по прайс-листу.
  // Пары между обычными городами не ограничиваются: если цены нет в PRICES, форма покажет «Маршрут не найден».
  const LIMITED_CITIES = {
    'Кугарчи': ['Магнитогорск', 'Сибай', 'Оренбург'],
    'Аманат': ['Оренбург'],
    'Тазларово': ['Оренбург']
  };

  function isRouteAllowed(a, b) {
    if (LIMITED_CITIES[a]) return LIMITED_CITIES[a].includes(b);
    if (LIMITED_CITIES[b]) return LIMITED_CITIES[b].includes(a);
    return true;
  }

  // ---- СЕГМЕНТНОЕ БРОНИРОВАНИЕ: ПОРЯДОК ГОРОДОВ И ЗАНЯТОСТЬ ----
  // Порядок строго как на бэкенде (CITIES_ORDER в main.py)
  const CITIES_ORDER = ['Магнитогорск', 'Сибай', 'Баймак', 'Юлдыбаево', 'Зилаир', 'Исянгулово', 'Саракташ', 'Оренбург'];
  const SEGMENT_KEYS = CITIES_ORDER.slice(0, -1).map((c, i) => `${c}-${CITIES_ORDER[i + 1]}`);
  const TOTAL_SEATS = 8;

  // Индексы участков между двумя городами (направление не важно).
  // Город вне CITIES_ORDER (Кугарчи, Аманат, Тазларово) = весь маршрут, как на сервере.
  function segmentRange(from, to) {
    const a = CITIES_ORDER.indexOf(from), b = CITIES_ORDER.indexOf(to);
    if (a === -1 || b === -1) return SEGMENT_KEYS.map((_, i) => i);
    if (a === b) return [];
    const lo = Math.min(a, b), hi = Math.max(a, b);
    return Array.from({ length: hi - lo }, (_, k) => lo + k);
  }

  function pluralSeats(n) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return `${n} место`;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return `${n} места`;
    return `${n} мест`;
  }

  // ---- ЦИКЛ ПОЕЗДКИ: НАПРАВЛЕНИЯ, ДАТЫ, ПОСАДКА ----
  const DIR_LABEL = { forward: 'Магнитогорск ➔ Оренбург', return: 'Оренбург ➔ Магнитогорск' };
  const tripDir = (t) => (t && t.direction === 'return') ? 'return' : 'forward';
  const fmtDate = (iso) => /^\d{4}-\d{2}-\d{2}$/.test(iso || '') ? iso.split('-').reverse().join('.') : (iso || '—');
  // Экранирование данных, которые вводят пользователи (имя, email, комментарий) — защита админки от HTML-вставок
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const getTrips = () => JSON.parse(localStorage.getItem('uralway_announcements') || '[]');

  // Рейсы по возрастанию даты/времени; i — индекс в исходном массиве (он же value в #fTrip)
  function sortedTrips() {
    return getTrips().map((a, i) => ({ a, i }))
      .sort((x, y) => `${x.a.date}T${x.a.time}`.localeCompare(`${y.a.date}T${y.a.time}`));
  }
  function getSelectedTrip() {
    const sel = $('#fTrip');
    if (!sel || sel.value === '') return null;
    return getTrips()[sel.value] || null;
  }

  // Прямой рейс идёт по возрастанию CITIES_ORDER, обратный — по убыванию (как validate на сервере)
  function rowMatchesDirection(from, to, dir) {
    const a = CITIES_ORDER.indexOf(from), b = CITIES_ORDER.indexOf(to);
    if (a === -1 || b === -1 || a === b) return true;
    return dir === 'forward' ? a < b : a > b;
  }

  // GET /api/availability -> {"Магнитогорск-Сибай": 8, ...} (занятые места по участкам).
  // У «туда» и «обратно» своя независимая шкала.
  async function getAvailability(date, time, direction = 'forward') {
    const url = `${API_URL}/api/availability?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&direction=${direction}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('availability ' + res.status);
    return await res.json();
  }

  function peakOccupied(occ) {
    return Math.max(0, ...SEGMENT_KEYS.map(k => Number(occ[k]) || 0));
  }

  // Схема мест на карточке рейса (по самому загруженному участку)
  function seatsVisualizationHtml(occupied) {
    occupied = Math.min(Math.max(Number(occupied) || 0, 0), TOTAL_SEATS);
    let seatsHtml = `<div class="seat driver" title="Водитель">В</div>`;
    for (let i = 1; i <= TOTAL_SEATS; i++) {
      seatsHtml += i <= occupied
        ? `<div class="seat occupied" title="Занято"></div>`
        : `<div class="seat free" title="Свободно"></div>`;
    }
    let statusText = 'Есть свободные места', statusClass = 'available';
    if (occupied >= TOTAL_SEATS) { statusText = 'На части маршрута мест нет'; statusClass = 'full'; }
    else if (occupied >= 5) { statusText = 'Осталось мало мест'; statusClass = 'low'; }
    return `
      <div class="minivan-layout">${seatsHtml}</div>
      <div class="seats-info">
        <span class="seats-count">Макс. загрузка: ${occupied} из ${TOTAL_SEATS} мест</span>
        <span class="seats-status ${statusClass}">${statusText}</span>
      </div>`;
  }

  // Шкала загрузки по участкам для админки (для обратного рейса — в порядке движения)
  function segmentLoadHtml(occ, direction) {
    const back = direction === 'return';
    const keys = back ? SEGMENT_KEYS.slice().reverse() : SEGMENT_KEYS;
    return keys.map(key => {
      const n = Math.min(Number(occ[key]) || 0, TOTAL_SEATS);
      const cls = n >= TOTAL_SEATS ? 'is-full' : (n >= 5 ? 'is-high' : '');
      const name = back ? key.split('-').reverse().join(' — ') : key.replace('-', ' — ');
      return `
        <div class="seg-load__row ${cls}">
          <span class="seg-load__name">${name}</span>
          <span class="seg-load__bar"><i style="width:${(n / TOTAL_SEATS) * 100}%"></i></span>
          <b>${n}/${TOTAL_SEATS}</b>
        </div>`;
    }).join('');
  }

  // ---- ЯНДЕКС.МЕТРИКА: ЦЕЛИ И ЭЛЕКТРОННАЯ КОММЕРЦИЯ ----
  const METRIKA_ID = 114068100;
  function reachGoal(goal, params) {
    try {
      if (typeof ym === 'undefined') return; // счётчик заблокирован или не загрузился
      if (params) ym(METRIKA_ID, 'reachGoal', goal, params); else ym(METRIKA_ID, 'reachGoal', goal);
    } catch (e) { /* аналитика не должна ломать сайт */ }
  }

  // Бронирование = покупка: цель, параметры визита и «Покупка» для отчётов электронной коммерции
  function trackBookingSuccess({ orderId, totalPrice, totalPassengers, direction, rows }) {
    try {
      const id = String(orderId);
      if (typeof ym !== 'undefined') {
        ym(METRIKA_ID, 'reachGoal', 'booking_success');
        ym(METRIKA_ID, 'params', {
          order_price: totalPrice,          // итоговая сумма заявки
          currency: 'RUB',
          order_id: id,                     // номер заявки
          passengers_count: totalPassengers // количество пассажиров
        });
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        ecommerce: {
          currencyCode: 'RUB',
          purchase: {
            actionField: { id },
            products: rows.map(p => ({
              id: `${p.from}-${p.to}`,
              name: `${p.from} — ${p.to}`,
              price: PRICES[`${p.from}-${p.to}`].price,
              quantity: p.seats,
              category: direction === 'return' ? 'Обратно' : 'Туда'
            }))
          }
        }
      });
    } catch (e) { /* аналитика не должна ломать сайт */ }
  }

  // Звонки (tel:) и ВКонтакте: помечаем классами (в т.ч. ссылки, добавленные позже) и ловим клики одним обработчиком
  document.querySelectorAll('a[href^="tel:"]').forEach(a => a.classList.add('js-call-click'));
  document.querySelectorAll('a[href*="vk.com"], a[href*="vk.ru"]').forEach(a => a.classList.add('js-social-click'));
  document.addEventListener('click', (e) => {
    const call = e.target.closest('.js-call-click');
    if (call) { reachGoal('call_click', { phone: (call.getAttribute('href') || '').replace('tel:', '') }); return; }
    if (e.target.closest('.js-social-click')) reachGoal('social_click', { network: 'vk' });
  });

  // Кнопка «Оставить отзыв»
  const openReviewBtnEl = document.getElementById('openReviewBtn');
  if (openReviewBtnEl) openReviewBtnEl.addEventListener('click', () => reachGoal('open_review_modal'));

  // ---- УТИЛИТЫ ----
  function formatPhone(value) {
    let d = value.replace(/\D/g, '');
    if (d.startsWith('8')) d = '7' + d.slice(1);
    if (!d.startsWith('7')) d = '7' + d;
    d = d.slice(0, 11);
    const p = d.slice(1);
    let out = '+7';
    if (p.length > 0) out += ' (' + p.slice(0, 3);
    if (p.length >= 3) out += ')';
    if (p.length > 3) out += ' ' + p.slice(3, 6);
    if (p.length > 6) out += '-' + p.slice(6, 8);
    if (p.length > 8) out += '-' + p.slice(8, 10);
    return out;
  }

  function setError(el, msg) {
    const field = el.closest('.field');
    if(!field) return;
    const err = field.querySelector('.field__error');
    if (msg) { field.classList.add('has-error'); if (err) err.textContent = msg; }
    else { field.classList.remove('has-error'); if (err) err.textContent = ''; }
  }

  // ---- ПЛАВАЮЩАЯ ПАНЕЛЬ ----
  const socialSidebar = $('#socialSidebar');
  if (socialSidebar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) socialSidebar.classList.add('is-visible');
      else socialSidebar.classList.remove('is-visible');
    }, { passive: true });
  }

  // ---- СЛАЙДЕР ----
  const heroSlider = $('#heroSlider');
  if (heroSlider) {
    const slides = $$('.hero-slider__slide', heroSlider);
    const dots = $$('.hero-slider__dot', heroSlider);
    let curr = 0;
    function goTo(i) {
      curr = (i + slides.length) % slides.length;
      slides.forEach((s, idx) => s.classList.toggle('is-active', idx === curr));
      dots.forEach((d, idx) => d.classList.toggle('is-active', idx === curr));
    }
    if($('#sliderNext')) $('#sliderNext').addEventListener('click', () => goTo(curr + 1));
    if($('#sliderPrev')) $('#sliderPrev').addEventListener('click', () => goTo(curr - 1));
    dots.forEach(d => d.addEventListener('click', () => goTo(Number(d.dataset.index))));
  }

  // ---- АНОНСЫ НА ГЛАВНОЙ ----
  function renderAnnouncements() {
    const grid = $('#announcementsGrid');
    if (!grid) return;
    const list = sortedTrips();
    if (list.length === 0) {
      grid.innerHTML = '<p class="empty-msg">Пока нет запланированных рейсов. Следите за обновлениями!</p>';
      return;
    }
    grid.innerHTML = list.map(({ a }) => {
      const driver = DRIVERS[a.driverId] || { name: '—', car: '—', color: '—', number: '—' };
      return `
        <div class="announcement-card is-visible">
          <h3><i class="fa-solid fa-calendar-day"></i> ${fmtDate(a.date)} в ${a.time}</h3>
          <p class="trip-dir"><i class="fa-solid fa-route"></i> ${DIR_LABEL[tripDir(a)]}</p>
          <p><i class="fa-solid fa-location-dot"></i> Отправление: ${a.address}</p>
          <p><i class="fa-solid fa-user-tie"></i> Водитель: ${driver.name}</p>
          <p><i class="fa-solid fa-car"></i> ${driver.car} (${driver.color})</p>
          <p><i class="fa-solid fa-hashtag"></i> Гос. номер: ${driver.number}</p>
          <p style="margin-top:15px; font-size:12px; color:var(--muted);"><i class="fa-solid fa-phone"></i> Справки: ${ADMIN_PHONES.join(', ')}</p>
          <div class="seats-visualization" data-seats-for="${a.id}">${seatsVisualizationHtml(0)}</div>
        </div>
      `;
    }).join('');

    // Реальная занятость берётся с сервера (по самому загруженному участку своего направления)
    list.forEach(async ({ a }) => {
      try {
        const occ = await getAvailability(a.date, a.time, tripDir(a));
        const box = grid.querySelector(`[data-seats-for="${a.id}"]`);
        if (box) box.innerHTML = seatsVisualizationHtml(peakOccupied(occ));
      } catch (e) { console.error('Не удалось получить занятость рейса', e); }
    });
  }
  renderAnnouncements();

  // ---- ЗАПОЛНЕНИЕ СПИСКА РЕЙСОВ ----
  function populateTrips() {
    const tripSelect = $('#fTrip');
    if (!tripSelect) return;
    const list = sortedTrips();
    if (list.length === 0) { tripSelect.innerHTML = '<option value="">Нет доступных рейсов</option>'; return; }
    tripSelect.innerHTML = '<option value="">Выберите рейс...</option>' +
      list.map(({ a, i }) => `<option value="${i}">Дата: ${fmtDate(a.date)} в ${a.time}, ${DIR_LABEL[tripDir(a)]}</option>`).join('');
  }
  populateTrips();

  // ---- ФОРМА БРОНИРОВАНИЯ ----
  const form = $('#bookingForm');
  const container = $('#passengersContainer');
  const addBtn = $('#addPassengerBtn');
  const submitBtn = $('#submitBtn');
  const totalPriceDisplay = $('#totalPriceDisplay');
  const totalDistanceDisplay = $('#totalDistanceDisplay');
  const MAX_SEATS = 8;

  // ---- Метрика: шаги воронки бронирования ----
  if (form) {
    // 1. Пользователь докрутил до формы бронирования (один раз за визит)
    if ('IntersectionObserver' in window) {
      const bookingObserver = new IntersectionObserver((entries) => {
        if (entries.some(en => en.isIntersecting)) { reachGoal('open_booking'); bookingObserver.disconnect(); }
      }, { threshold: 0.25 });
      bookingObserver.observe(form);
    }
    // 2. Выбран рейс
    const tripSelectEl = $('#fTrip');
    if (tripSelectEl) tripSelectEl.addEventListener('change', () => {
      if (tripSelectEl.value === '') return;
      const trip = getSelectedTrip();
      reachGoal('select_trip', trip ? { trip_direction: tripDir(trip), trip_date: trip.date } : undefined);
    });
    // 3. Добавлен пассажир (считаем, только если строка реально добавилась)
    if (addBtn) addBtn.addEventListener('click', () => {
      const before = $$('.passenger-row', container).length;
      setTimeout(() => {
        const now = $$('.passenger-row', container).length;
        if (now > before) reachGoal('add_passenger', { passenger_rows: now });
      }, 0);
    }, true);
  }

  // Занятость выбранного рейса и результат проверки (используются в calculateTotal / checkFormValidity)
  let tripOccupancy = null;
  let availabilityOk = true;

  function ensureSeatsHint(row) {
    let hint = row.querySelector('.seats-hint');
    if (!hint) {
      hint = document.createElement('span');
      hint.className = 'seats-hint';
      row.querySelector('.to-select').closest('.field').appendChild(hint);
    }
    return hint;
  }

  // Время точки посадки зависит от направления рейса
  const stopTime = (stop, dir) => dir === 'return' ? (stop.timeBack || '') : (stop.time || '');
  const currentDir = () => { const t = getSelectedTrip(); return t ? tripDir(t) : 'forward'; };

  // Недоступные сочетания «Откуда» / «Куда» отключаются в выпадающих списках
  function syncRouteOptions(row) {
    const fromSel = row.querySelector('.from-select'), toSel = row.querySelector('.to-select');
    const apply = (sel, other) => {
      Array.from(sel.options).forEach(opt => {
        if (!opt.value) return;
        opt.disabled = !!other.value && (opt.value === other.value || !isRouteAllowed(opt.value, other.value));
      });
      if (sel.value && sel.options[sel.selectedIndex].disabled) sel.value = '';
    };
    apply(toSel, fromSel);
    apply(fromSel, toSel);
  }

  // Поле «Точка посадки» (создаётся, если его нет в разметке строки)
  function ensureStopField(row) {
    if (row.querySelector('.stop-select')) return;
    const field = document.createElement('div');
    field.className = 'field stop-field';
    field.innerHTML = '<label>Точка посадки *</label><select class="stop-select" disabled><option value="">Сначала выберите «Откуда»</option></select><span class="field__error"></span>';
    row.appendChild(field);
  }

  // Подгружает адреса из CITY_STOPS для выбранного «Откуда»; единственная точка выбирается автоматически
  function refreshStopSelect(row) {
    const sel = row.querySelector('.stop-select');
    if (!sel) return;
    const city = row.querySelector('.from-select').value;
    const stops = CITY_STOPS[city] || [];
    const dir = currentDir();
    const prev = (sel.dataset.city === city) ? sel.value : '';
    if (!city || stops.length === 0) {
      sel.innerHTML = `<option value="">${city ? 'Нет точек посадки' : 'Сначала выберите «Откуда»'}</option>`;
      sel.disabled = true;
      sel.dataset.city = city;
      return;
    }
    sel.disabled = false;
    sel.innerHTML = (stops.length > 1 ? '<option value="">Выберите точку посадки…</option>' : '') +
      stops.map((st, i) => {
        const t = stopTime(st, dir);
        return `<option value="${i}">${esc(t ? `${t} — ${st.address}` : st.address)}</option>`;
      }).join('');
    sel.dataset.city = city;
    sel.value = stops.length === 1 ? '0' : prev;
  }

  // Выбранная точка посадки строки: { time, address } или null
  function getRowStop(row, dir) {
    const sel = row.querySelector('.stop-select');
    if (!sel || sel.value === '') return null;
    const stop = (CITY_STOPS[row.querySelector('.from-select').value] || [])[Number(sel.value)];
    return stop ? { time: stopTime(stop, dir), address: stop.address } : null;
  }

  // Для каждой строки: проверка направления и «Свободно X мест на этом участке».
  // Строки заявки суммируются между собой, если пересекаются по участкам.
  function applyAvailability() {
    availabilityOk = true;
    if (!container) return;
    const trip = getSelectedTrip();
    const dir = trip ? tripDir(trip) : null;
    const rows = $$('.passenger-row', container).map(row => {
      const from = row.querySelector('.from-select').value;
      const to = row.querySelector('.to-select').value;
      return {
        row, from, to,
        seats: Number(row.querySelector('.seats-select').value) || 0,
        range: (from && to && from !== to) ? segmentRange(from, to) : []
      };
    });
    rows.forEach((r, i) => {
      const hint = ensureSeatsHint(r.row);

      // участок должен идти в направлении выбранного рейса
      if (dir && r.range.length && !rowMatchesDirection(r.from, r.to, dir)) {
        hint.textContent = `Этот рейс идёт ${DIR_LABEL[dir]} — выберите участок в этом направлении`;
        hint.className = 'seats-hint is-over';
        availabilityOk = false;
        return;
      }
      if (!tripOccupancy || r.range.length === 0) { hint.textContent = ''; hint.className = 'seats-hint'; return; }

      let worst = 0;
      r.range.forEach(s => {
        let load = Number(tripOccupancy[SEGMENT_KEYS[s]]) || 0;
        rows.forEach((o, j) => { if (j !== i && o.range.includes(s)) load += o.seats; });
        worst = Math.max(worst, load);
      });
      const free = Math.max(TOTAL_SEATS - worst, 0);
      if (free === 0) {
        hint.textContent = 'Мест на этом участке нет';
        hint.className = 'seats-hint is-full';
        availabilityOk = false;
      } else if (r.seats > free) {
        hint.textContent = `Свободно ${pluralSeats(free)} на этом участке — выберите меньше`;
        hint.className = 'seats-hint is-over';
        availabilityOk = false;
      } else {
        hint.textContent = `Свободно ${pluralSeats(free)} на этом участке`;
        hint.className = 'seats-hint ' + (free <= 3 ? 'is-low' : 'is-ok');
      }
    });
  }

  // Загружает занятость выбранного рейса (с учётом направления) с сервера
  async function loadTripAvailability() {
    tripOccupancy = null;
    const tripSel = $('#fTrip');
    const idx = tripSel ? tripSel.value : '';
    if (container) $$('.passenger-row', container).forEach(refreshStopSelect);
    calculateTotal(); // сбросить старые подсказки
    if (idx === '') return;
    const trip = getTrips()[idx];
    if (!trip) return;
    try {
      const occ = await getAvailability(trip.date, trip.time, tripDir(trip));
      if (tripSel.value !== idx) return; // пользователь уже выбрал другой рейс
      tripOccupancy = occ;
    } catch (e) { console.error('Не удалось получить занятость рейса', e); }
    calculateTotal();
  }

  function updateSeatsCounter() {
    if (!container) return;
    let total = 0;
    $$('.passenger-row', container).forEach(row => { total += Number(row.querySelector('.seats-select').value); });
    const counterDisplay = $('#totalSeatsCounter');
    const counterBar = $('#counterBarFill');
    const counterContainer = $('.total-passengers-counter');
    
    if (counterDisplay) counterDisplay.textContent = total;
    if (counterBar) {
      const percent = Math.min((total / MAX_SEATS) * 100, 100);
      counterBar.style.width = `${percent}%`;
      if (total >= MAX_SEATS) {
        counterBar.style.backgroundColor = 'var(--danger)';
        if(counterContainer) counterContainer.classList.add('is-full');
      } else {
        counterBar.style.backgroundColor = 'var(--accent)';
        if(counterContainer) counterContainer.classList.remove('is-full');
      }
    }
    if (addBtn) {
      if (total >= MAX_SEATS) { addBtn.disabled = true; addBtn.style.opacity = '0.5'; addBtn.style.cursor = 'not-allowed'; }
      else { addBtn.disabled = false; addBtn.style.opacity = '1'; addBtn.style.cursor = 'pointer'; }
    }
  }

  function calculateTotal() {
    if (!container) return;
    let totalSum = 0, maxKm = 0, isValidRoutes = true;
    $$('.passenger-row', container).forEach(row => {
      const from = row.querySelector('.from-select').value;
      const to = row.querySelector('.to-select').value;
      const seats = Number(row.querySelector('.seats-select').value);
      const pricePreview = row.querySelector('.row-price-preview');
      pricePreview.classList.remove('is-notfound');
      
      if (from && to) {
        if (from === to) { setError(row.querySelector('.to-select'), 'Совпадает'); pricePreview.textContent = '0 ₽'; isValidRoutes = false; }
        else {
          setError(row.querySelector('.to-select'), '');
          const data = PRICES[`${from}-${to}`];
          if (data) { 
            const sum = data.price * seats; 
            pricePreview.textContent = `${sum} ₽`; 
            totalSum += sum; 
            if (data.km > maxKm) maxKm = data.km; 
          }
          else { pricePreview.textContent = 'Маршрут не найден'; pricePreview.classList.add('is-notfound'); isValidRoutes = false; }
        }
      } else { pricePreview.textContent = '0 ₽'; isValidRoutes = false; }
    });

    if(totalPriceDisplay) totalPriceDisplay.textContent = `${totalSum} ₽`;
    if(totalDistanceDisplay) totalDistanceDisplay.textContent = `(${maxKm} км)`;
    updateSeatsCounter();
    applyAvailability();
    checkFormValidity();
  }

  function checkFormValidity() {
    if (!form) return;
    const baseFields = [$('#fName'), $('#fPhone'), $('#fEmail'), $('#fTrip')];
    let baseValid = baseFields.every(el => el && el.value.trim() !== '');
    const rows = $$('.passenger-row', container);
    let routesValid = rows.length > 0 && rows.every(row => {
      const f = row.querySelector('.from-select').value;
      const t = row.querySelector('.to-select').value;
      const stopSel = row.querySelector('.stop-select');
      return f !== '' && t !== '' && f !== t && !!PRICES[`${f}-${t}`] && isRouteAllowed(f, t) && !!stopSel && stopSel.value !== '';
    });
    submitBtn.disabled = !(baseValid && routesValid && availabilityOk);
  }

  function setupRowEvents(row) {
    const fromSel = row.querySelector('.from-select');
    const toSel = row.querySelector('.to-select');
    const seatsSel = row.querySelector('.seats-select');
    const removeBtn = row.querySelector('.remove-row');
    const update = () => calculateTotal();

    ensureStopField(row);
    const stopSel = row.querySelector('.stop-select');

    fromSel.addEventListener('change', () => { syncRouteOptions(row); refreshStopSelect(row); update(); });
    toSel.addEventListener('change', () => { syncRouteOptions(row); update(); });
    stopSel.addEventListener('change', update);
    syncRouteOptions(row);
    refreshStopSelect(row);
    seatsSel.dataset.prevValue = seatsSel.value;
    
    seatsSel.addEventListener('change', (e) => {
      let currentTotal = 0;
      $$('.passenger-row', container).forEach(r => { if (r !== row) currentTotal += Number(r.querySelector('.seats-select').value); });
      const newValue = Number(e.target.value);
      if (currentTotal + newValue > MAX_SEATS) {
        alert(`Превышен лимит мест. Максимум ${MAX_SEATS} мест на поездку.`);
        e.target.value = e.target.dataset.prevValue;
        return;
      }
      e.target.dataset.prevValue = newValue;
      update();
    });

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        if ($$('.passenger-row', container).length > 1) { row.remove(); calculateTotal(); }
      });
    }
  }

  if (container && addBtn) {
    const firstRow = container.querySelector('.passenger-row');
    if (firstRow) setupRowEvents(firstRow);

    addBtn.addEventListener('click', () => {
      const newRow = document.createElement('div');
      newRow.className = 'passenger-row';
      newRow.innerHTML = `
        <div class="field"><label>Откуда *</label><select class="from-select"><option value="">Выберите…</option><option>Магнитогорск</option><option>Сибай</option><option>Баймак</option><option>Юлдыбаево</option><option>Зилаир</option><option>Исянгулово</option><option>Саракташ</option><option>Кугарчи</option><option>Аманат</option><option>Тазларово</option><option>Оренбург</option></select><span class="field__error"></span></div>
        <div class="field"><label>Куда *</label><select class="to-select"><option value="">Выберите…</option><option>Магнитогорск</option><option>Сибай</option><option>Баймак</option><option>Юлдыбаево</option><option>Зилаир</option><option>Исянгулово</option><option>Саракташ</option><option>Кугарчи</option><option>Аманат</option><option>Тазларово</option><option>Оренбург</option></select><span class="field__error"></span></div>
        <div class="field" style="max-width:120px;"><label>Мест *</label><select class="seats-select"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option></select><span class="field__error"></span></div>
        <div class="row-price-preview">0 ₽</div>
        <button type="button" class="btn btn--danger btn--icon remove-row"><i class="fa-solid fa-trash"></i></button>
      `;
      container.appendChild(newRow);
      setupRowEvents(newRow);
      calculateTotal();
    });

    $('#fPhone').addEventListener('input', (e) => { e.target.value = formatPhone(e.target.value); checkFormValidity(); });
    ['#fName', '#fEmail', '#fTrip'].forEach(sel => { $(sel).addEventListener('input', checkFormValidity); });
    $('#fTrip').addEventListener('change', loadTripAvailability);
  }

  // ---- ОТПРАВКА ФОРМЫ БРОНИРОВАНИЯ НА СЕРВЕР ----
  if (form) {
    const modal = $('#successModal');
    const okBtn = $('#modalOkBtn');
    let timerInterval;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (submitBtn.disabled) return;

      const phoneValue = $('#fPhone').value;
      const rows = $$('.passenger-row', container);
      const passengersData = [];
      let totalPrice = 0, maxKm = 0;

      rows.forEach(row => {
        const from = row.querySelector('.from-select').value;
        const to = row.querySelector('.to-select').value;
        const seats = Number(row.querySelector('.seats-select').value);
        const data = PRICES[`${from}-${to}`];
        if (data) {
          passengersData.push({ from, to, seats, km: data.km, stop: getRowStop(row, currentDir()) });
          totalPrice += data.price * seats;
          if (data.km > maxKm) maxKm = data.km;
        }
      });

      const tripIndex = $('#fTrip').value;
      const announcements = JSON.parse(localStorage.getItem('uralway_announcements') || '[]');
      const selectedTrip = announcements[tripIndex];

      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Отправка...';
      submitBtn.disabled = true;

      try {
        const mainRoute = passengersData[0];
        
        // Посадка каждого пассажира берётся по его городу «Откуда» и направлению рейса
        const tripDirection = tripDir(selectedTrip);
        const boardingRows = passengersData.map(p => ({ ...p, boarding: p.stop }));
        const firstBoarding = boardingRows[0].boarding;

        const routesString = boardingRows.map(p =>
          `${p.from} — ${p.to} (${p.km} км, ${p.seats} чел.${p.boarding ? `, посадка ${p.boarding.time ? p.boarding.time + ', ' : ''}${p.boarding.address}` : ''})`
        ).join(', ');
        
        const response = await fetch(`${API_URL}/api/booking`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: $('#fName').value,
            phone: phoneValue,
            email: $('#fEmail').value,
            from_city: mainRoute.from,
            to_city: mainRoute.to,
            trip_date: selectedTrip ? selectedTrip.date : new Date().toISOString().split('T')[0],
            trip_time: selectedTrip ? selectedTrip.time : '—',
            trip_address: selectedTrip ? selectedTrip.address : '—',
            trip_direction: tripDirection,
            boarding_time: (firstBoarding && firstBoarding.time) || null,
            boarding_address: firstBoarding ? firstBoarding.address : null,
            passengers: passengersData.reduce((acc, curr) => acc + curr.seats, 0),
            segments: passengersData.map(p => ({ from_city: p.from, to_city: p.to, seats: p.seats })),
            total_price: totalPrice, 
            total_km: maxKm, 
            comment: `Маршруты: ${routesString}` 
          })
        });

        if (!response.ok) {
          if (response.status === 403) throw new Error('BANNED');
          if (response.status === 400) {
            const err = new Error('NO_SEATS');
            try { err.detail = (await response.json()).detail; } catch (_) {}
            throw err;
          }
          throw new Error('Server Error');
        }

        // ---- Метрика: успешное бронирование (до показа окна «Спасибо») ----
        let bookingId = null;
        try { bookingId = (await response.json()).booking_id; } catch (_) { /* ответ без JSON */ }
        trackBookingSuccess({
          orderId: bookingId || Date.now(),
          totalPrice,
          totalPassengers: passengersData.reduce((acc, p) => acc + p.seats, 0),
          direction: tripDirection,
          rows: passengersData
        });

        if(modal) {
          $('#receiptTime').previousElementSibling.textContent = 'Время посадки:';
          $('#receiptAddress').previousElementSibling.textContent = 'Адрес посадки:';
          $('#receiptDate').textContent = selectedTrip ? `${fmtDate(selectedTrip.date)} · ${DIR_LABEL[tripDirection]}` : '—';
          $('#receiptTime').textContent = firstBoarding ? (firstBoarding.time || 'уточняется') : (selectedTrip ? selectedTrip.time : '—');
          $('#receiptAddress').textContent = firstBoarding ? firstBoarding.address : (selectedTrip ? selectedTrip.address : '—');
          $('#receiptRoutes').innerHTML = boardingRows.map(p =>
            `${p.from} — ${p.to} (${p.seats} чел.)` +
            (boardingRows.length > 1 && p.boarding ? `<br><small>Посадка: ${p.boarding.time ? p.boarding.time + ', ' : ''}${p.boarding.address}</small>` : '')
          ).join('<br>');
          $('#receiptTotal').textContent = `${totalPrice} ₽`;

          modal.hidden = false;
          document.body.style.overflow = 'hidden';
          let timeLeft = 20;
          if(okBtn) {
            okBtn.disabled = true;
            okBtn.textContent = `ОК (${timeLeft}с)`;
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
              timeLeft--;
              if (timeLeft <= 0) { clearInterval(timerInterval); okBtn.disabled = false; okBtn.textContent = 'ОК'; }
              else { okBtn.textContent = `ОК (${timeLeft}с)`; }
            }, 1000);
          }
        }

        form.reset();
        while ($$('.passenger-row', container).length > 1) { container.lastElementChild.remove(); }
        const firstRow = container.querySelector('.passenger-row');
        if (firstRow) {
           const seatsSel = firstRow.querySelector('.seats-select');
           if(seatsSel) seatsSel.dataset.prevValue = seatsSel.value;
        }
        tripOccupancy = null;
        $$('.passenger-row', container).forEach(r => { syncRouteOptions(r); refreshStopSelect(r); });
        calculateTotal();
        populateTrips();
        renderAnnouncements();

      } catch (error) {
        if (error.message === 'NO_SEATS') {
          alert(error.detail || 'На выбранном участке маршрута недостаточно свободных мест');
          await loadTripAvailability();
        } else if (error.message === 'BANNED') {
          alert(`Ваш номер телефона находится в черном списке. Бронирование невозможно. Свяжитесь с администратором: ${ADMIN_PHONES.join(' или ')}.`);
        } else {
          alert('Ошибка при отправке заявки. Пожалуйста, попробуйте позже или позвоните нам.');
        }
      } finally {
        submitBtn.textContent = originalBtnText;
        checkFormValidity();
      }
    });

    if(okBtn) {
      okBtn.addEventListener('click', () => {
        if(!okBtn.disabled) { $('#successModal').hidden = true; document.body.style.overflow = ''; }
      });
    }
  }

  // ---- ФОРМА ПОДПИСКИ ----
 /* ВРЕМЕННО СКРЫТО: ФОРМА ПОДПИСКИ
  const subForm = $('#subscribeForm');
  if (subForm) {
    subForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = $('#subEmail');
      const email = emailInput.value.trim();
      const btn = $('#subBtn');
      const msgBox = $('#subMessages');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      if (!emailRegex.test(email)) {
        msgBox.innerHTML = '<div class="sub-msg sub-msg--error">✗ Пожалуйста, введите корректный email.</div>';
        return;
      }

      btn.textContent = 'Отправка...';
      btn.disabled = true;
      msgBox.innerHTML = '';

      try {
        const response = await fetch(`${API_URL}/api/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email })
        });

        if (response.ok) {
          msgBox.innerHTML = '<div class="sub-msg sub-msg--success">✓ Спасибо за подписку! Мы будем отправлять вам анонсы рейсов.</div>';
          subForm.reset();
        } else if (response.status === 400) {
          msgBox.innerHTML = '<div class="sub-msg sub-msg--warning" style="color:#d97706;">Этот email уже подписан на рассылку.</div>';
        } else {
          throw new Error('Server Error');
        }
      } catch (error) {
        msgBox.innerHTML = '<div class="sub-msg sub-msg--error">Ошибка подключения. Попробуйте позже.</div>';
      } finally {
        btn.textContent = 'ПОДПИСАТЬСЯ';
        btn.disabled = false;
        setTimeout(() => { msgBox.innerHTML = ''; }, 5000);
      }
    });
  }
 */
  // ---- ОТЗЫВЫ ----
  const REVIEWS_KEY = 'uralway_reviews';
  let showAllReviews = false; // Флаг: показывать все или только 3

  function getStarsHtml(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) html += `<i class="fa-solid fa-star" style="color:${i <= rating ? 'var(--accent)' : '#d1d5db'}"></i>`;
    return html;
  }
  
  function renderReviews() {
    const list = $('#reviewsList');
    const btn = $('#showMoreReviewsBtn');
    if (!list) return;
    
    let reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
    let totalStars = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = reviews.length ? (totalStars / reviews.length) : 0;

    if($('#avgRatingNum')) $('#avgRatingNum').textContent = avg.toFixed(1);
    if($('#reviewsCount')) $('#reviewsCount').textContent = reviews.length === 0 ? 'Нет отзывов' : `${reviews.length} отзыв(ов)`;
    if($('#avgRatingStars')) $('#avgRatingStars').style.width = `${(avg / 5) * 100}%`;

    if (reviews.length === 0) {
      list.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--muted);">Пока нет отзывов. Станьте первым!</p>';
      if(btn) btn.style.display = 'none';
      return;
    }

    const sortedRevs = [...reviews].reverse();
    const displayRevs = showAllReviews ? sortedRevs : sortedRevs.slice(0, 3);

    list.innerHTML = displayRevs.map(r => `
      <article class="review-card">
        <div class="review-card__stars">${getStarsHtml(r.rating)}</div>
        <p class="review-card__text">${r.text}</p>
        <div class="review-card__meta"><span class="review-card__name">${r.name}</span><span class="review-card__date">${r.date}</span></div>
      </article>
    `).join('');

    if (btn) {
      if (reviews.length > 3) {
        btn.style.display = 'inline-flex';
        btn.textContent = showAllReviews ? 'Скрыть отзывы' : `Показать все отзывы (${reviews.length})`;
      } else {
        btn.style.display = 'none';
      }
    }
  }
  
  const showMoreBtn = $('#showMoreReviewsBtn');
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      showAllReviews = !showAllReviews;
      renderReviews();
    });
  }

  renderReviews();

  const reviewModal = $('#reviewModal');
  if (reviewModal) {
    $('#openReviewBtn').addEventListener('click', () => { reviewModal.hidden = false; document.body.style.overflow = 'hidden'; });
    function closeReviewModal() { reviewModal.hidden = true; document.body.style.overflow = ''; $('#reviewForm').reset(); }
    $('#cancelReviewBtn').addEventListener('click', closeReviewModal);
    reviewModal.addEventListener('click', (e) => { if (e.target.hasAttribute('data-close-review-modal')) closeReviewModal(); });
    
    $('#rPhone').addEventListener('input', (e) => { e.target.value = formatPhone(e.target.value); });
    
    $('#reviewForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = $('#rName'), phone = $('#rPhone'), email = $('#rEmail'), text = $('#rText'), ratingInput = $('input[name="rating"]:checked');
      
      let isValid = true;
      if (!name.value.trim()) { setError(name, 'Укажите имя'); isValid = false; } else setError(name, '');
      if (!phone.value.trim() || phone.value.length < 18) { setError(phone, 'Формат: +7 (XXX) XXX-XX-XX'); isValid = false; } else setError(phone, '');
      if (!email.value.trim() || !email.value.includes('@')) { setError(email, 'Некорректный e-mail'); isValid = false; } else setError(email, '');
      if (!text.value.trim()) { setError(text, 'Напишите отзыв'); isValid = false; } else setError(text, '');
      if (!ratingInput) { alert('Поставьте оценку'); isValid = false; }
      if (!isValid) return;

      try {
        const banRes = await fetch(`${API_URL}/api/check_ban/${encodeURIComponent(phone.value.trim())}`);
        const banData = await banRes.json();
        if (banData.is_banned) {
          alert(`Ваш номер телефона находится в черном списке. Вы не можете оставлять отзывы. Свяжитесь с администратором: ${ADMIN_PHONES.join(' или ')}.`);
          return;
        }
      } catch (err) {
        console.error("Ошибка проверки бана", err);
      }

      const newReview = { id: Date.now(), name: name.value, phone: phone.value, email: email.value, rating: Number(ratingInput.value), text: text.value, date: new Date().toLocaleDateString('ru-RU') };
      const stored = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
      stored.push(newReview);
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(stored));
      closeReviewModal();
      renderReviews();
    });
  }

  // =======================================================
  // АДМИН-ПАНЕЛЬ
  // =======================================================
  const adminLogin = $('#adminLogin');
  const adminApp   = $('#adminApp');

  if (adminLogin && adminApp) {
    const ADMIN_PASSWORD = 'admin123';
    const STORAGE_KEY = 'transfer_admin_auth';

    const STATUS_LABEL = { new: 'Новая', confirmed: 'Подтверждена', cancelled: 'Отменена', completed: 'Завершена' };

    // Блоки каждой вкладки. Отсутствующие в HTML (например, закомментированные подписчики) просто пропускаются —
    // раньше обращение к null.style обрывало обработчик, и бан-лист оставался скрытым.
    const TAB_BLOCKS = {
      bookings: ['tab-bookings', 'tab-trips', 'tab-bookings-table'],
      subscribers: ['tab-subscribers-table'],
      banned: ['tab-banned-table']
    };
    const ALL_TAB_BLOCKS = Object.values(TAB_BLOCKS).flat();

    $$('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.tab-btn').forEach(b => b.classList.remove('active', 'btn--cta'));
        $$('.tab-btn').forEach(b => b.classList.add('btn--outline'));
        btn.classList.remove('btn--outline');
        btn.classList.add('active', 'btn--cta');

        const target = btn.dataset.tab;
        ALL_TAB_BLOCKS.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
        (TAB_BLOCKS[target] || []).forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'block'; });

        // обёртка с формой и списком рейсов нужна только на вкладке заявок
        const split = document.querySelector('.admin-split');
        if (split) split.style.display = target === 'bookings' ? '' : 'none';

        if (target === 'banned') renderBannedUsers();
        else if (target === 'subscribers') renderSubscribers();
      });
    });

    function showApp() { adminLogin.hidden = true; adminApp.hidden = false; renderAdminTable(); renderAdminTrips(); }
    function showLogin() { adminApp.hidden = true; adminLogin.hidden = false; $('#adminPassword').value = ''; $('#loginError').hidden = true; }

    if (sessionStorage.getItem(STORAGE_KEY) === 'ok') showApp();

    $('#loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      if ($('#adminPassword').value === ADMIN_PASSWORD) { sessionStorage.setItem(STORAGE_KEY, 'ok'); showApp(); }
      else { $('#loginError').hidden = false; $('#adminPassword').value = ''; }
    });

    $('#logoutBtn').addEventListener('click', () => { sessionStorage.removeItem(STORAGE_KEY); showLogin(); });

    const addAnnForm = $('#addAnnouncementForm');
    if (addAnnForm) {
      addAnnForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const driverId = $('#aDriverId').value; // один водитель на оба рейса цикла
        const forward = { date: $('#aDate').value, time: $('#aTime').value, address: $('#aAddress').value.trim() };
        const back = { date: $('#aReturnDate').value, time: $('#aReturnTime').value, address: $('#aReturnAddress').value.trim() };

        if (`${back.date}T${back.time}` < `${forward.date}T${forward.time}`) {
          alert('Обратный рейс не может быть раньше рейса «Туда».');
          return;
        }

        // 1. Две связанные записи (общий cycleId): «Туда» и «Обратно» — у каждой своя шкала занятости
        const cycleId = Date.now();
        const base = { cycleId, driverId, occupiedSeats: 0, phone: ADMIN_PHONES.join(', ') };
        const stored = getTrips();
        stored.push({ ...base, id: cycleId, direction: 'forward', ...forward });
        stored.push({ ...base, id: cycleId + 1, direction: 'return', ...back });
        localStorage.setItem('uralway_announcements', JSON.stringify(stored));
        renderAdminTrips();

        // 2. Рассылка подписчикам: один email про весь цикл
        try {
          const response = await fetch(`${API_URL}/api/notify_subscribers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...forward, return_date: back.date, return_time: back.time, return_address: back.address })
          });

          if (response.ok) {
            alert('Цикл поездки добавлен (туда и обратно), рассылка писем запущена!');
          } else {
            alert('Цикл добавлен, но произошла ошибка при запуске рассылки.');
          }
        } catch (error) {
          alert('Цикл добавлен, но сервер рассылки недоступен.');
        }

        addAnnForm.reset();
      });
    }

    async function renderAdminTrips() {
      const list = $('#adminTripsList');
      if (!list) return;
      const items = sortedTrips();
      if (items.length === 0) { list.innerHTML = '<p style="color:var(--muted);">Нет созданных рейсов.</p>'; return; }
      list.innerHTML = items.map(({ a }) => {
        const dir = tripDir(a);
        const driver = DRIVERS[a.driverId];
        return `
        <div class="admin-trip-item" style="flex-direction: column; align-items: flex-start; gap: 10px;">
          <div style="width: 100%; display: flex; align-items: flex-start; gap: 12px;">
            <div>
              <strong>${fmtDate(a.date)} в ${a.time}</strong>
              <span class="dir-badge dir-badge--${dir}">${dir === 'return' ? 'Обратно' : 'Туда'} · ${DIR_LABEL[dir]}</span><br>
              <span style="font-size: 12px; color: var(--muted);">${a.address}${driver ? ' · ' + driver.name : ''}</span>
            </div>
            <button class="row-btn row-btn--delete" onclick="deleteAdminTrip(${a.id})" style="margin-left: auto;">Удалить</button>
          </div>
          <div class="seg-load" id="segLoad-${a.id}"><span class="seg-load__loading">Загрузка занятости…</span></div>
        </div>`;
      }).join('');

      // Реальная загрузка по участкам берётся из заявок на сервере (отдельно для «туда» и «обратно»)
      await Promise.all(items.map(async ({ a }) => {
        const box = document.getElementById(`segLoad-${a.id}`);
        if (!box) return;
        try { box.innerHTML = segmentLoadHtml(await getAvailability(a.date, a.time, tripDir(a)), tripDir(a)); }
        catch (e) { box.innerHTML = '<span class="seg-load__loading">Не удалось получить занятость</span>'; }
      }));
    }

    window.deleteAdminTrip = (id) => {
      const data = getTrips();
      const rec = data.find(a => a.id === id);
      if (!rec) return;
      const partner = rec.cycleId ? data.find(a => a.cycleId === rec.cycleId && a.id !== id) : null;
      let ids = null;
      if (partner) {
        if (confirm('Удалить ОБА рейса цикла (туда и обратно)?')) ids = [rec.id, partner.id];
        else if (confirm('Удалить только этот рейс?')) ids = [rec.id];
      } else if (confirm('Удалить этот рейс?')) {
        ids = [rec.id];
      }
      if (!ids) return;
      localStorage.setItem('uralway_announcements', JSON.stringify(data.filter(a => !ids.includes(a.id))));
      renderAdminTrips();
    };

    let applications = []; 

    async function renderAdminTable() {
      const tbody = $('#appsTableBody');
      if (!tbody) return;
      tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">Загрузка данных с сервера...</td></tr>';
      try {
        const response = await fetch(`${API_URL}/api/bookings`);
        applications = await response.json();
        if (applications.length === 0) { tbody.innerHTML = ''; $('#tableEmpty').hidden = false; updateStats(); return; }
        $('#tableEmpty').hidden = true;
        tbody.innerHTML = applications.map(app => `
          <tr data-id="${app.id}">
            <td>${app.id}</td><td>${esc(app.name)}</td><td>${esc(app.phone)}</td>
            <td>
              <strong>${fmtDate(app.trip_date)} в ${app.boarding_address ? (app.boarding_time || 'время уточняется') : (app.trip_time || '—')}</strong><br>
              <small>${esc(app.boarding_address) || '—'}</small><br>
              <small style="color: var(--muted);">${DIR_LABEL[app.trip_direction === 'return' ? 'return' : 'forward']}</small>
            </td>
            <td style="max-width:200px; font-size:12px;">${esc(app.comment) || '—'}</td>
            <td><strong>${app.passengers || 1} чел.</strong></td>
            <td><strong>${app.total_price || 0} ₽</strong><br><small>${app.total_km || 0} км</small></td>
            <td><span class="badge badge--${app.status}">${STATUS_LABEL[app.status] || app.status}</span></td>
            <td>
              <div class="row-actions">
                <button class="row-btn row-btn--confirm" onclick="updateStatus(${app.id}, 'confirmed')">Подтвердить</button>
                <button class="row-btn row-btn--cancel" onclick="updateStatus(${app.id}, 'cancelled')">Отменить</button>
                <button class="row-btn row-btn--complete" onclick="updateStatus(${app.id}, 'completed')">Завершить</button>
                <button class="row-btn row-btn--delete" onclick="deleteApp(${app.id})">Удалить</button>
                <button class="row-btn row-btn--ban" data-phone="${esc(app.phone)}" onclick="banUser(this.dataset.phone)">Бан</button>
              </div>
            </td>
          </tr>
        `).join('');
        updateStats();
      } catch (error) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; color:red;">Ошибка подключения к серверу</td></tr>';
      }
    }

    function updateStats() {
      $('#statTotal').textContent = applications.length;
      $('#statNew').textContent = applications.filter(a => a.status === 'new').length;
      $('#statConfirmed').textContent = applications.filter(a => a.status === 'confirmed').length;
      $('#statCancelled').textContent = applications.filter(a => a.status === 'cancelled').length;
    }

    window.updateStatus = async (id, status) => {
      try { await fetch(`${API_URL}/api/bookings/${id}?status=${status}`, { method: 'PATCH' }); renderAdminTable(); renderAdminTrips(); } catch (e) { alert('Ошибка'); }
    };

    window.deleteApp = async (id) => {
      if (confirm('Удалить заявку?')) {
        try { await fetch(`${API_URL}/api/bookings/${id}`, { method: 'DELETE' }); renderAdminTable(); renderAdminTrips(); } catch (e) { alert('Ошибка'); }
      }
    };
    
    window.banUser = async (phone) => {
      const reason = prompt(`Укажите причину бана для ${phone}:`);
      if (reason === null) return; 
      try {
        const response = await fetch(`${API_URL}/api/ban_user/${encodeURIComponent(phone)}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason: reason || "Без указания причины" })
        });
        if (response.ok) { alert(`Номер ${phone} заблокирован.`); renderAdminTable(); } else { alert(`Ошибка`); }
      } catch (error) { alert('Ошибка подключения'); }
    };

    async function renderSubscribers() {
      const tbody = $('#subscribersTableBody');
      if (!tbody) return;
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Загрузка...</td></tr>';
      try {
        const response = await fetch(`${API_URL}/api/subscribers`);
        const subs = await response.json();
        if (subs.length === 0) { tbody.innerHTML = ''; $('#subsTableEmpty').hidden = false; return; }
        $('#subsTableEmpty').hidden = true;
        tbody.innerHTML = subs.map(s => `
          <tr><td>${s.id}</td><td><strong>${s.email}</strong></td><td>${new Date(s.created_at).toLocaleString('ru-RU')}</td></tr>
        `).join('');
      } catch (error) { tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:red;">Ошибка загрузки</td></tr>'; }
    }

    async function renderBannedUsers() {
      const tbody = $('#bannedTableBody');
      if (!tbody) return;
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Загрузка...</td></tr>';
      try {
        const response = await fetch(`${API_URL}/api/banned_users`);
        if (!response.ok) throw new Error('banned_users ' + response.status);
        const users = await response.json();
        if (users.length === 0) { tbody.innerHTML = ''; $('#bannedTableEmpty').hidden = false; return; }
        $('#bannedTableEmpty').hidden = true;
        tbody.innerHTML = users.map(u => `
          <tr>
            <td>${esc(u.id)}</td>
            <td><strong>${esc(u.name) || '—'}</strong></td>
            <td>${esc(u.phone)}</td>
            <td>${esc(u.email) || '—'}</td>
            <td class="cell-reason">${esc(u.ban_reason) || '—'}</td>
            <td><button class="row-btn row-btn--confirm" data-phone="${esc(u.phone)}" onclick="unbanUser(this.dataset.phone)">Разбанить</button></td>
          </tr>
        `).join('');
      } catch (error) {
        console.error(error);
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--err);">Ошибка загрузки</td></tr>';
      }
    }

    window.unbanUser = async (phone) => {
      if (confirm(`Разбанить пользователя ${phone}?`)) {
        try {
          const response = await fetch(`${API_URL}/api/unban_user/${encodeURIComponent(phone)}`, { method: 'POST' });
          if (response.ok) { alert('Пользователь разбанен'); renderBannedUsers(); renderAdminTable(); }
          else { alert('Не удалось разбанить пользователя'); }
        } catch (error) { alert('Ошибка подключения'); }
      }
    };
  }
})();
