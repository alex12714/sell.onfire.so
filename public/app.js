/* ============================================================
   sell.onfire.so — SPA Application
   Vanilla JS classifieds marketplace
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // Config
  // ============================================================

  const API_BASE = 'https://api2.onfire.so';
  const ADMIN_URL = 'https://admin.onfire.so';
  const STORAGE_BASE = 'https://storage1.onfire.so/mediafiles/products/';
  const PAGE_SIZE = 20;

  // ============================================================
  // Categories (hardcoded to match mobile app)
  // ============================================================

  const CATEGORIES = [
    { id: 2, name: 'Electronics & Technology', emoji: '💻', subs: [
      {id:14,name:'Smartphones'},{id:13,name:'Computers & Laptops'},{id:19,name:'Tablets'},{id:15,name:'TVs & Home Theater'},
      {id:16,name:'Gaming'},{id:17,name:'Cameras'},{id:18,name:'Audio'},{id:20,name:'Smart Home'},{id:21,name:'Computer Accessories'},{id:22,name:'Phone Accessories'}
    ]},
    { id: 3, name: 'Vehicles & Transport', emoji: '🚗', subs: [
      {id:23,name:'Cars & Trucks'},{id:24,name:'Motorcycles'},{id:26,name:'Boats & Marine'},{id:25,name:'Auto Parts'},
      {id:28,name:'Tires & Wheels'},{id:27,name:'RVs & Campers'},{id:118,name:'ATVs & Snowmobiles'},{id:119,name:'Vehicle Rental'},{id:120,name:'Transport Services'}
    ]},
    { id: 89, name: 'Real Estate', emoji: '🏠', subs: [
      {id:97,name:'Apartments & Flats'},{id:98,name:'Houses & Cottages'},{id:99,name:'Land & Plots'},{id:100,name:'Offices'},
      {id:101,name:'Commercial Premises'},{id:102,name:'Garages & Parking'},{id:103,name:'Vacation Rentals'},{id:104,name:'Rooms & Shared'}
    ]},
    { id: 4, name: 'Home & Garden', emoji: '🏡', subs: [
      {id:29,name:'Furniture'},{id:37,name:'Appliances'},{id:31,name:'Kitchen & Dining'},{id:30,name:'Home Decor'},
      {id:32,name:'Garden & Outdoor'},{id:36,name:'Tools & Hardware'},{id:34,name:'Lighting'},{id:33,name:'Bedding & Bath'},{id:35,name:'Storage'},{id:38,name:'Building Materials'}
    ]},
    { id: 5, name: 'Fashion & Accessories', emoji: '👗', subs: [
      {id:39,name:"Women's Clothing"},{id:40,name:"Men's Clothing"},{id:45,name:"Kids' Clothing"},{id:41,name:'Shoes'},
      {id:42,name:'Bags & Purses'},{id:43,name:'Jewelry & Watches'},{id:44,name:'Accessories'}
    ]},
    { id: 88, name: 'Jobs & Work', emoji: '💼', subs: [
      {id:92,name:'Job Vacancies'},{id:93,name:'Job Seekers'},{id:94,name:'Gigs & Freelance'},{id:95,name:'Courses & Education'},{id:96,name:'Business Contacts'}
    ]},
    { id: 6, name: 'Baby & Kids', emoji: '👶', subs: [
      {id:47,name:'Toys & Games'},{id:48,name:'Baby Gear'},{id:46,name:'Baby Clothing'},{id:49,name:"Children's Furniture"},{id:50,name:'Baby Feeding & Care'},{id:51,name:'Maternity'}
    ]},
    { id: 9, name: 'Pet Supplies', emoji: '🐾', subs: [
      {id:121,name:'Dogs'},{id:122,name:'Cats'},{id:123,name:'Birds & Parrots'},{id:124,name:'Fish & Aquariums'},
      {id:125,name:'Rodents'},{id:126,name:'Exotic Animals'},{id:127,name:'Vet Services'},{id:128,name:'Lost & Found Pets'}
    ]},
    { id: 7, name: 'Sports & Recreation', emoji: '⚽', subs: [
      {id:52,name:'Exercise Equipment'},{id:54,name:'Bikes'},{id:53,name:'Outdoor Sports'},{id:55,name:'Team Sports'},
      {id:56,name:'Water Sports'},{id:57,name:'Camping & Hiking'},{id:58,name:'Hunting & Fishing'}
    ]},
    { id: 8, name: 'Hobbies & Crafts', emoji: '🎨', subs: [
      {id:60,name:'Musical Instruments'},{id:61,name:'Books & Magazines'},{id:62,name:'Collectibles'},
      {id:63,name:'Board Games & Puzzles'},{id:59,name:'Arts & Crafts'},{id:64,name:'Model Kits & Hobbies'}
    ]},
    { id: 10, name: 'Health & Beauty', emoji: '💄', subs: [
      {id:71,name:'Skincare & Cosmetics'},{id:73,name:'Hair Care'},{id:74,name:'Fragrances'},{id:72,name:'Health & Wellness'},{id:75,name:'Personal Care'}
    ]},
    { id: 11, name: 'Business & Industrial', emoji: '🏭', subs: [
      {id:76,name:'Office Supplies'},{id:77,name:'Industrial Tools'},{id:78,name:'Business Equipment'},{id:79,name:'Restaurant Equipment'},{id:80,name:'Medical Equipment'}
    ]},
    { id: 12, name: 'Services', emoji: '🔧', subs: [
      {id:81,name:'Home Services'},{id:82,name:'Professional Services'},{id:83,name:'Automotive Services'},
      {id:84,name:'Tutoring & Classes'},{id:85,name:'Event Services'},{id:87,name:'Rides'}
    ]},
    { id: 90, name: 'Agriculture & Farming', emoji: '🌾', subs: [
      {id:105,name:'Livestock'},{id:106,name:'Poultry'},{id:107,name:'Agricultural Machinery'},
      {id:108,name:'Seeds & Seedlings'},{id:109,name:'Crops & Produce'},{id:110,name:'Food Products'},{id:111,name:'Farm Equipment'}
    ]},
    { id: 91, name: 'Free & Community', emoji: '🤝', subs: [
      {id:112,name:'Free Stuff'},{id:113,name:'Barter & Exchange'},{id:114,name:'Lost & Found'},{id:115,name:'Volunteers'},{id:116,name:'Rideshare'}
    ]},
  ];

  // ============================================================
  // Transaction Types & Conditions per Category
  // ============================================================

  const TRANSACTION_TYPES = {
    all: { label: 'All', value: null },
    sell: { label: 'Sell', value: 'sell' },
    buy: { label: 'Buy Wanted', value: 'buy' },
    rent: { label: 'Rent', value: 'rent' },
    exchange: { label: 'Exchange', value: 'exchange' },
    give: { label: 'Give Away', value: 'give' },
    repair: { label: 'Repair', value: 'repair' },
  };

  const CATEGORY_TRANSACTION_TYPES = {
    7: ['all', 'sell', 'buy', 'exchange', 'repair'],   // Automotive
    // Real Estate would be id 11+ if added; for now use default
  };
  const DEFAULT_TRANSACTION_TYPES = ['all', 'sell', 'buy', 'give'];

  const CONDITION_OPTIONS = [
    { label: 'All', value: null },
    { label: 'New', value: 'new' },
    { label: 'Like New', value: 'like_new' },
    { label: 'Good', value: 'good' },
    { label: 'Fair', value: 'fair' },
  ];

  function getTransactionTypesForCategory(catId) {
    return CATEGORY_TRANSACTION_TYPES[catId] || DEFAULT_TRANSACTION_TYPES;
  }

  function transactionTypeBadgeHTML(transactionType) {
    if (!transactionType || transactionType === 'sell') return '';
    const map = {
      buy: { cls: 'badge--buying', label: 'Buying' },
      rent: { cls: 'badge--renting', label: 'Renting' },
      exchange: { cls: 'badge--exchanging', label: 'Exchanging' },
      give: { cls: 'badge--giving', label: 'Giving Away' },
      repair: { cls: 'badge--service', label: 'Repair' },
    };
    const info = map[transactionType];
    if (!info) return '';
    return `<span class="badge ${info.cls}">${info.label}</span>`;
  }

  function conditionBadgeHTML(condition) {
    if (!condition) return '';
    const map = {
      new: 'New',
      like_new: 'Like New',
      good: 'Good',
      fair: 'Fair',
      for_parts: 'For Parts',
    };
    const label = map[condition];
    if (!label) return '';
    return `<span class="condition-badge condition-badge--${condition}">${label}</span>`;
  }

  function transactionTypeDetailLabel(transactionType) {
    const map = {
      sell: { cls: 'transaction-type-label--sell', label: 'FOR SALE' },
      buy: { cls: 'transaction-type-label--buy', label: 'WANTED TO BUY' },
      rent: { cls: 'transaction-type-label--rent', label: 'FOR RENT' },
      exchange: { cls: 'transaction-type-label--exchange', label: 'FOR EXCHANGE' },
      give: { cls: 'transaction-type-label--give', label: 'GIVING AWAY' },
      repair: { cls: 'transaction-type-label--repair', label: 'REPAIR SERVICE' },
    };
    const info = map[transactionType || 'sell'];
    if (!info) return '';
    return `<span class="transaction-type-label ${info.cls}">${info.label}</span>`;
  }

  // ============================================================
  // API Client
  // ============================================================

  const api = {
    async get(path, { count = false } = {}) {
      const headers = { 'Accept': 'application/json' };
      if (count) headers['Prefer'] = 'count=exact';

      const res = await fetch(`${API_BASE}${path}`, { headers });
      if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);

      const data = await res.json();
      let total = null;

      if (count) {
        const range = res.headers.get('Content-Range');
        if (range) {
          const match = range.match(/\/(\d+)/);
          if (match) total = parseInt(match[1], 10);
        }
      }

      return count ? { data, total } : data;
    },

    products(params = '') {
      return this.get(`/products?status=eq.active&select=*,product_images(*)${params}`);
    },

    productsWithCount(params = '') {
      return this.get(`/products?status=eq.active&select=*,product_images(*)${params}`, { count: true });
    },

    featured() {
      return this.get('/products?is_featured=eq.true&status=eq.active&select=*,product_images(*)&limit=8');
    },

    latest() {
      return this.get('/products?status=eq.active&select=*,product_images(*)&order=created_at.desc&limit=12');
    },

    services() {
      return this.get('/products?type=eq.service&status=eq.active&select=*,product_images(*)&limit=8');
    },

    product(id) {
      return this.get(`/products?id=eq.${id}&select=*,product_images(*)`);
    },

    reviews(productId) {
      return this.get(`/product_reviews?product_id=eq.${productId}&select=*`);
    },

    search(q, params = '') {
      const encoded = encodeURIComponent(q);
      return this.productsWithCount(`&or=(name.ilike.*${encoded}*,description.ilike.*${encoded}*)${params}`);
    },

    byCategory(catId, params = '') {
      return this.productsWithCount(`&category_id=eq.${catId}${params}`);
    },

    fieldDefinitions(categoryId) {
      return this.get(`/category_field_definitions?category_id=eq.${categoryId}&order=display_order`);
    },
  };

  // ============================================================
  // Utilities
  // ============================================================

  function getProductImage(product) {
    if (product.image_urls && product.image_urls.length > 0) {
      const url = product.image_urls[0];
      if (url.startsWith('http')) return url;
      return STORAGE_BASE + url;
    }
    if (product.product_images && product.product_images.length > 0) {
      const img = product.product_images[0];
      const url = img.url || img.image_url;
      if (url) {
        if (url.startsWith('http')) return url;
        return STORAGE_BASE + url;
      }
    }
    return null;
  }

  function getAllProductImages(product) {
    const images = [];
    if (product.image_urls && product.image_urls.length > 0) {
      product.image_urls.forEach(url => {
        images.push(url.startsWith('http') ? url : STORAGE_BASE + url);
      });
    }
    if (product.product_images && product.product_images.length > 0) {
      product.product_images.forEach(img => {
        const url = img.url || img.image_url;
        if (url) {
          const full = url.startsWith('http') ? url : STORAGE_BASE + url;
          if (!images.includes(full)) images.push(full);
        }
      });
    }
    return images;
  }

  function formatPrice(price, currency) {
    if (price == null) return 'Contact for price';
    const num = parseFloat(price);
    if (isNaN(num)) return 'Contact for price';
    const sym = currencySymbol(currency);
    return `${sym}${num.toFixed(2)}`;
  }

  function currencySymbol(currency) {
    const map = { USD: '$', EUR: '\u20AC', GBP: '\u00A3', GEL: '\u20BE', RUB: '\u20BD' };
    return map[(currency || 'USD').toUpperCase()] || (currency || '$') + ' ';
  }

  function timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  }

  function renderStars(rating, size = '') {
    const r = parseFloat(rating) || 0;
    const cls = size === 'lg' ? 'stars stars--lg' : 'stars';
    let html = `<span class="${cls}">`;
    for (let i = 1; i <= 5; i++) {
      html += i <= Math.round(r) ? '\u2605' : '\u2606';
    }
    html += '</span>';
    return html;
  }

  function getCategoryEmoji(categoryId) {
    const cid = parseInt(categoryId, 10);
    // Check top-level
    const top = CATEGORIES.find(c => c.id === cid);
    if (top) return top.emoji;
    // Check subcategories — return parent emoji
    for (const cat of CATEGORIES) {
      if (cat.subs.some(s => s.id === cid)) return cat.emoji;
    }
    return '\uD83D\uDCE6';
  }

  function getCategoryById(id) {
    const cid = parseInt(id, 10);
    // Check top-level
    const top = CATEGORIES.find(c => c.id === cid);
    if (top) return top;
    // Check subcategories — return a virtual category object
    for (const cat of CATEGORIES) {
      const sub = cat.subs.find(s => s.id === cid);
      if (sub) return { id: sub.id, name: sub.name, emoji: cat.emoji, subs: [], parent: cat };
    }
    return null;
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function debounce(fn, ms) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  // ============================================================
  // Category Field Definitions (cached)
  // ============================================================

  const fieldDefCache = {};
  async function getFieldDefs(categoryId) {
    if (!categoryId) return [];
    if (fieldDefCache[categoryId]) return fieldDefCache[categoryId];
    try {
      const defs = await api.fieldDefinitions(categoryId);
      fieldDefCache[categoryId] = defs;
      return defs;
    } catch (e) { return []; }
  }

  function formatPropertyValue(def, val) {
    switch (def.field_type) {
      case 'boolean': return val ? '&#x2713; Yes' : '&#x2717; No';
      case 'enum': {
        const opt = def.options?.values?.find(v => v.key === val);
        return escapeHtml(opt ? opt.label : String(val));
      }
      case 'multi_enum': {
        if (!Array.isArray(val)) return escapeHtml(String(val));
        return val.map(v => {
          const opt = def.options?.values?.find(o => o.key === v);
          return `<span class="props-chip">${escapeHtml(opt ? opt.label : v)}</span>`;
        }).join(' ');
      }
      case 'number': case 'decimal': {
        const unit = def.options?.unit || '';
        return escapeHtml(`${val}${unit ? ' ' + unit : ''}`);
      }
      default: return escapeHtml(String(val));
    }
  }

  function renderEquipmentHTML(equipment, fieldDefs) {
    const equipDef = fieldDefs.find(d => d.field_key === 'equipment');
    const groups = equipDef?.options?.groups || [];
    let html = '<div class="props-group"><h3 class="props-group__title">Equipment &amp; Features</h3>';
    for (const [groupKey, items] of Object.entries(equipment)) {
      if (!Array.isArray(items) || !items.length) continue;
      const groupDef = groups.find(g => g.key === groupKey);
      const groupLabel = groupDef?.label || groupKey.replace(/_/g, ' ');
      html += `<div class="equipment-group"><h4 class="equipment-group__title">${escapeHtml(groupLabel)}</h4><div class="equipment-group__items">`;
      for (const itemKey of items) {
        const itemDef = groupDef?.items?.find(i => i.key === itemKey);
        const label = itemDef?.label || itemKey.replace(/_/g, ' ');
        html += `<span class="props-chip props-chip--feature">&#x2713; ${escapeHtml(label)}</span>`;
      }
      html += '</div></div>';
    }
    html += '</div>';
    return html;
  }

  function renderPropertiesHTML(product, fieldDefs) {
    if (!fieldDefs.length && !product.properties) return '';

    // Group by display_group
    const groups = {};
    for (const def of fieldDefs) {
      const val = product.properties?.[def.field_key];
      if (val === undefined || val === null || val === '') continue;
      const group = def.display_group || 'details';
      if (!groups[group]) groups[group] = [];
      groups[group].push({ def, val });
    }

    // Render each group as a section
    let html = '';
    for (const [group, fields] of Object.entries(groups)) {
      const groupLabel = { specs: 'Specifications', features: 'Features', vehicle_info: 'Vehicle Details', property_info: 'Property Details' }[group] || 'Details';
      html += `<div class="props-group"><h3 class="props-group__title">${groupLabel}</h3><table class="props-table">`;
      for (const { def, val } of fields) {
        html += `<tr><td class="props-table__label">${escapeHtml(def.field_label)}</td><td class="props-table__value">${formatPropertyValue(def, val)}</td></tr>`;
      }
      html += '</table></div>';
    }

    // Also render any properties NOT covered by definitions (raw fallback)
    if (product.properties) {
      const definedKeys = new Set(fieldDefs.map(d => d.field_key));
      const extraProps = Object.entries(product.properties).filter(([k, v]) => !definedKeys.has(k) && v !== null && v !== '' && k !== 'equipment');
      if (extraProps.length) {
        html += '<div class="props-group"><h3 class="props-group__title">Additional Details</h3><table class="props-table">';
        for (const [key, val] of extraProps) {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          html += `<tr><td class="props-table__label">${escapeHtml(label)}</td><td class="props-table__value">${escapeHtml(String(val))}</td></tr>`;
        }
        html += '</table></div>';
      }
    }

    // Equipment (grouped_multi_enum) — render as grouped chip lists
    if (product.properties?.equipment) {
      html += renderEquipmentHTML(product.properties.equipment, fieldDefs);
    }

    return html;
  }

  // ============================================================
  // QR Code Helper
  // ============================================================

  function qrCodeURL(data, size = 250) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
  }

  function showQRModal(sellerId, productId, productName, isService = false) {
    const deepLink = `https://onf.to/chat/${sellerId || 'seller'}?product=${productId}&msg=Is+this+still+available%3F`;
    const qrSrc = qrCodeURL(deepLink);
    const ctaLabel = isService ? 'Book Now' : 'Contact Seller';

    const overlay = document.createElement('div');
    overlay.className = 'qr-modal-overlay';
    overlay.innerHTML = `
      <div class="qr-modal">
        <button class="qr-modal__close" aria-label="Close">&times;</button>
        <div class="qr-modal__title">Scan with OnFire App</div>
        <div class="qr-modal__subtitle">Chat with the ${isService ? 'provider' : 'seller'} about "${escapeHtml(productName)}"</div>
        <div class="qr-modal__code"><img src="${qrSrc}" alt="QR Code" width="250" height="250"></div>
        <div class="qr-modal__hint">Open OnFire app and scan this code to start a chat with the ${isService ? 'provider' : 'seller'}</div>
        <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:12px;font-weight:500;">Don't have the app?</div>
        <div class="qr-modal__apps">
          <a href="#" class="qr-modal__app-link">App Store</a>
          <a href="#" class="qr-modal__app-link">Google Play</a>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    const close = () => { overlay.remove(); };
    overlay.querySelector('.qr-modal__close').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', handler); }
    });
  }

  // ============================================================
  // Category Filter Helpers
  // ============================================================

  function buildFilterControls(fieldDefs, currentFilters = {}, maxInitial = 6) {
    const searchable = fieldDefs
      .filter(d => d.searchable && d.field_type !== 'grouped_multi_enum')
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    if (searchable.length === 0) return '';

    const initial = searchable.slice(0, maxInitial);
    const extra = searchable.slice(maxInitial);

    let html = `<div class="filters-panel" id="filters-panel">
      <div class="filters-panel__header">
        <span class="filters-panel__title">Filters</span>
        <div class="filters-actions">
          <button class="filters-toggle" id="filters-reset-btn" type="button">Reset filters</button>
        </div>
      </div>
      <div class="filters-grid">`;

    html += initial.map(d => filterControlHTML(d, currentFilters)).join('');

    if (extra.length > 0) {
      html += extra.map(d => `<div class="filter-group filters-hidden filters-extra">${filterControlInnerHTML(d, currentFilters)}</div>`).join('');
    }

    html += `</div>`;

    if (extra.length > 0) {
      html += `<div style="margin-top:12px;"><button class="filters-toggle" id="filters-more-btn" type="button">More filters (${extra.length})</button></div>`;
    }

    html += `</div>`;
    return html;
  }

  function filterControlHTML(def, currentFilters) {
    return `<div class="filter-group">${filterControlInnerHTML(def, currentFilters)}</div>`;
  }

  function filterControlInnerHTML(def, currentFilters) {
    const key = def.field_key;
    switch (def.field_type) {
      case 'enum':
      case 'multi_enum': {
        const values = def.options?.values || [];
        const current = currentFilters[key] || '';
        let html = `<label>${escapeHtml(def.field_label)}</label><select data-filter-key="${key}" data-filter-type="${def.field_type}">`;
        html += `<option value="">All</option>`;
        for (const v of values) {
          html += `<option value="${escapeHtml(v.key)}" ${current === v.key ? 'selected' : ''}>${escapeHtml(v.label)}</option>`;
        }
        html += `</select>`;
        return html;
      }
      case 'number':
      case 'decimal':
      case 'range': {
        const unit = def.options?.unit || '';
        const minVal = currentFilters[key + '_min'] || '';
        const maxVal = currentFilters[key + '_max'] || '';
        return `<label>${escapeHtml(def.field_label)}${unit ? ' (' + escapeHtml(unit) + ')' : ''}</label>
          <div class="filter-range">
            <input type="number" data-filter-key="${key}_min" data-filter-type="number_min" placeholder="Min" value="${escapeHtml(minVal)}">
            <span class="filter-range__sep">&ndash;</span>
            <input type="number" data-filter-key="${key}_max" data-filter-type="number_max" placeholder="Max" value="${escapeHtml(maxVal)}">
          </div>`;
      }
      case 'boolean': {
        const checked = currentFilters[key] === 'true' ? 'checked' : '';
        return `<div class="filter-group--checkbox">
          <input type="checkbox" id="filter-${key}" data-filter-key="${key}" data-filter-type="boolean" ${checked}>
          <label for="filter-${key}">${escapeHtml(def.field_label)}</label>
        </div>`;
      }
      case 'string':
      default: {
        const current = currentFilters[key] || '';
        return `<label>${escapeHtml(def.field_label)}</label>
          <input type="text" data-filter-key="${key}" data-filter-type="string" placeholder="Search..." value="${escapeHtml(current)}">`;
      }
    }
  }

  function parseFiltersFromQuery(query) {
    const filters = {};
    for (const [key, value] of query.entries()) {
      if (['page', 'sort', 'tx', 'condition', 'q'].includes(key)) continue;
      if (value) filters[key] = value;
    }
    return filters;
  }

  function collectFiltersFromDOM() {
    const filters = {};
    document.querySelectorAll('#filters-panel [data-filter-key]').forEach(el => {
      const key = el.dataset.filterKey;
      const type = el.dataset.filterType;
      if (type === 'boolean') {
        if (el.checked) filters[key] = 'true';
      } else {
        const val = el.value.trim();
        if (val) filters[key] = val;
      }
    });
    return filters;
  }

  function buildFilterAPIParams(filters) {
    let params = '';
    // Top-level product columns that should not use properties->> JSONB operator
    const topLevelColumns = ['price'];
    for (const [key, value] of Object.entries(filters)) {
      if (key.endsWith('_min')) {
        const realKey = key.replace(/_min$/, '');
        if (topLevelColumns.includes(realKey)) {
          params += `&${realKey}=gte.${value}`;
        } else {
          params += `&properties->>${realKey}=gte.${value}`;
        }
      } else if (key.endsWith('_max')) {
        const realKey = key.replace(/_max$/, '');
        if (topLevelColumns.includes(realKey)) {
          params += `&${realKey}=lte.${value}`;
        } else {
          params += `&properties->>${realKey}=lte.${value}`;
        }
      } else if (value === 'true') {
        params += `&properties->>${key}=eq.true`;
      } else if (key.match(/^[a-z_]+$/) && !['page', 'sort', 'tx', 'condition'].includes(key)) {
        // Determine if this is a string search or exact match by checking if it's a known enum
        const cachedDefs = Object.values(fieldDefCache).flat();
        const def = cachedDefs.find(d => d.field_key === key);
        if (def && (def.field_type === 'enum' || def.field_type === 'multi_enum')) {
          params += `&properties->>${key}=eq.${value}`;
        } else if (def && def.field_type === 'string') {
          params += `&properties->>${key}=ilike.*${encodeURIComponent(value)}*`;
        } else {
          params += `&properties->>${key}=eq.${value}`;
        }
      }
    }
    return params;
  }

  function filtersToQueryString(filters) {
    return Object.entries(filters).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  }

  // ============================================================
  // SEO: Dynamic Meta Tags & Structured Data
  // ============================================================

  const SITE_NAME = 'OnFire Marketplace';
  const SITE_URL = 'https://sell.onfire.so';
  const DEFAULT_OG_IMAGE = SITE_URL + '/og-image.png';

  function updateMeta(opts) {
    document.title = opts.title || SITE_NAME;

    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', opts.description || '');
    setMeta('property', 'og:title', opts.title || SITE_NAME);
    setMeta('property', 'og:description', opts.description || '');
    setMeta('property', 'og:type', opts.ogType || 'website');
    setMeta('property', 'og:url', opts.url || SITE_URL);
    setMeta('property', 'og:image', opts.image || DEFAULT_OG_IMAGE);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('name', 'twitter:card', 'summary_large_image');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', opts.url || SITE_URL);
  }

  function updateJsonLd(data) {
    let el = document.getElementById('json-ld');
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = 'json-ld';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  }

  // ============================================================
  // Components (reusable HTML generators)
  // ============================================================

  function productCardHTML(product) {
    const img = getProductImage(product);
    const emoji = getCategoryEmoji(product.category_id);
    const title = escapeHtml(product.name || product.title || 'Untitled');
    const price = formatPrice(product.price, product.currency);
    const time = timeAgo(product.created_at);

    let badges = '';
    if (product.is_featured) badges += '<span class="badge badge--featured">Featured</span>';
    if (product.is_on_sale && product.discount_percentage) badges += `<span class="badge badge--sale">-${product.discount_percentage}%</span>`;
    if (product.type === 'service') badges += '<span class="badge badge--service">Service</span>';
    if (product.is_luxury) badges += '<span class="badge badge--luxury">Luxury</span>';
    badges += transactionTypeBadgeHTML(product.transaction_type);

    let priceHTML = `<span class="product-card__price">${price}</span>`;
    if (product.compare_at_price && product.compare_at_price > product.price) {
      priceHTML += `<span class="product-card__price-compare">${formatPrice(product.compare_at_price, product.currency)}</span>`;
    }

    const ratingHTML = product.rating
      ? `<span class="product-card__rating">${renderStars(product.rating)}<span class="product-card__rating-text">(${product.review_count || 0})</span></span>`
      : '';

    return `
      <a href="#/product/${product.id}" class="product-card">
        <div class="product-card__image">
          ${img
            ? `<img src="${img}" alt="${title}" loading="lazy" onerror="this.parentElement.innerHTML='<span class=\\'product-card__placeholder\\'>${emoji}</span>'">`
            : `<span class="product-card__placeholder">${emoji}</span>`
          }
          ${badges ? `<div class="product-card__badges">${badges}</div>` : ''}
        </div>
        <div class="product-card__body">
          <div class="product-card__title">${title}</div>
          <div>${priceHTML}</div>
          <div class="product-card__meta">
            ${ratingHTML}
            <span>${conditionBadgeHTML(product.condition) || time}</span>
            ${product.condition ? `<span>${time}</span>` : ''}
          </div>
        </div>
      </a>`;
  }

  function skeletonCardHTML() {
    return `
      <div class="skeleton--card">
        <div class="skeleton skeleton--image"></div>
        <div class="skeleton-card__body">
          <div class="skeleton skeleton--title"></div>
          <div class="skeleton skeleton--price"></div>
          <div class="skeleton skeleton--text skeleton--text-short"></div>
        </div>
      </div>`;
  }

  function skeletonGridHTML(count = 4) {
    return `<div class="products-grid">${Array(count).fill(skeletonCardHTML()).join('')}</div>`;
  }

  function emptyStateHTML(icon, title, text, actionHTML = '') {
    return `
      <div class="empty-state">
        <div class="empty-state__icon">${icon}</div>
        <h2 class="empty-state__title">${title}</h2>
        <p class="empty-state__text">${text}</p>
        ${actionHTML}
      </div>`;
  }

  function paginationHTML(currentPage, totalPages) {
    if (totalPages <= 1) return '';
    let html = '<div class="pagination">';
    html += `<button class="pagination__btn" data-page="${currentPage - 1}" ${currentPage <= 1 ? 'disabled' : ''}>Previous</button>`;

    const range = [];
    const delta = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    let last = 0;
    for (const page of range) {
      if (page - last > 1) {
        html += '<span class="pagination__btn" style="border:none;cursor:default;">&hellip;</span>';
      }
      html += `<button class="pagination__btn ${page === currentPage ? 'is-active' : ''}" data-page="${page}">${page}</button>`;
      last = page;
    }

    html += `<button class="pagination__btn" data-page="${currentPage + 1}" ${currentPage >= totalPages ? 'disabled' : ''}>Next</button>`;
    html += '</div>';
    return html;
  }

  // ============================================================
  // Router
  // ============================================================

  const router = {
    routes: {},

    register(pattern, handler) {
      this.routes[pattern] = handler;
    },

    resolve() {
      const hash = location.hash.slice(1) || '/';
      const [path, queryStr] = hash.split('?');
      const query = new URLSearchParams(queryStr || '');

      // Product detail
      const productMatch = path.match(/^\/product\/(\d+)$/);
      if (productMatch) {
        return this.routes['/product/:id']({ id: productMatch[1] }, query);
      }

      // Category
      const catMatch = path.match(/^\/category\/(\d+)$/);
      if (catMatch) {
        return this.routes['/category/:id']({ id: catMatch[1] }, query);
      }

      // Search
      if (path === '/search') {
        return this.routes['/search']({}, query);
      }

      // Home
      return this.routes['/']({}, query);
    },

    navigate(hash) {
      location.hash = hash;
    },

    init() {
      window.addEventListener('hashchange', () => this.resolve());
      this.resolve();
    },
  };

  // ============================================================
  // Page: Homepage
  // ============================================================

  async function renderHomepage() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page-enter">
        <!-- Search Hero -->
        <div class="search-hero">
          <div class="container">
            <div class="search-bar">
              <input class="search-bar__input" id="home-search" type="text" placeholder="Search products and services..." autocomplete="off">
              <button class="search-bar__btn" id="home-search-btn">Search</button>
            </div>
          </div>
        </div>

        <!-- Categories -->
        <section class="section">
          <div class="container">
            <div class="section__header">
              <h2 class="section__title">Browse Categories</h2>
            </div>
            <div class="categories-grid" id="home-categories"></div>
            <div class="categories-mobile" id="home-categories-mobile"></div>
          </div>
        </section>

        <!-- Featured -->
        <section class="section section--alt">
          <div class="container">
            <div class="section__header">
              <h2 class="section__title">Featured Products</h2>
            </div>
            <div id="home-featured">${skeletonGridHTML(4)}</div>
          </div>
        </section>

        <!-- Latest -->
        <section class="section">
          <div class="container">
            <div class="section__header">
              <h2 class="section__title">Latest Listings</h2>
            </div>
            <div id="home-latest">${skeletonGridHTML(4)}</div>
          </div>
        </section>

        <!-- Services -->
        <section class="section section--alt">
          <div class="container">
            <div class="section__header">
              <h2 class="section__title">Popular Services</h2>
            </div>
            <div id="home-services">${skeletonGridHTML(4)}</div>
          </div>
        </section>
      </div>`;

    // Search handlers
    const searchInput = document.getElementById('home-search');
    const searchBtn = document.getElementById('home-search-btn');
    searchBtn.addEventListener('click', () => {
      const q = searchInput.value.trim();
      if (q) router.navigate(`#/search?q=${encodeURIComponent(q)}`);
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = searchInput.value.trim();
        if (q) router.navigate(`#/search?q=${encodeURIComponent(q)}`);
      }
    });

    // Categories grid (desktop)
    const catGrid = document.getElementById('home-categories');
    catGrid.innerHTML = CATEGORIES.map(cat => `
      <a href="#/category/${cat.id}" class="category-card">
        <div class="category-card__icon">${cat.emoji}</div>
        <div class="category-card__name">${cat.name}</div>
        <div class="category-card__subs">
          ${cat.subs.map(s => `<a href="#/category/${s.id}" class="category-card__sub">${s.name}</a>`).join('')}
        </div>
      </a>`).join('');

    // Categories mobile (SS.COM style accordion)
    const catMobile = document.getElementById('home-categories-mobile');
    if (catMobile) {
      catMobile.innerHTML = CATEGORIES.map(cat => `
        <div class="categories-mobile__item" data-cat-id="${cat.id}">
          <span class="categories-mobile__icon">${cat.emoji}</span>
          <span class="categories-mobile__name">${cat.name}</span>
          <span class="categories-mobile__count">${cat.subs.length}</span>
          <svg class="categories-mobile__chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="categories-mobile__subs" data-cat-subs="${cat.id}">
          <a href="#/category/${cat.id}" class="categories-mobile__sub" style="font-weight:600;">All ${cat.name}</a>
          ${cat.subs.map(s => `<a href="#/category/${s.id}" class="categories-mobile__sub">${s.name}</a>`).join('')}
        </div>`).join('');

      catMobile.addEventListener('click', (e) => {
        const item = e.target.closest('.categories-mobile__item');
        if (!item) return;
        const wasOpen = item.classList.contains('categories-mobile__item--open');
        // Close all
        catMobile.querySelectorAll('.categories-mobile__item--open').forEach(el => el.classList.remove('categories-mobile__item--open'));
        // Toggle current
        if (!wasOpen) item.classList.add('categories-mobile__item--open');
      });
    }

    // Fetch data
    const [featured, latest, services] = await Promise.allSettled([
      api.featured(),
      api.latest(),
      api.services(),
    ]);

    renderProductSection('home-featured', featured, 'No featured products yet', true);
    renderProductSection('home-latest', latest, 'No products yet');
    renderProductSection('home-services', services, 'No services yet', true);

    updateMeta({
      title: 'OnFire Marketplace - Buy & Sell Products and Services',
      description: 'Browse electronics, fashion, home goods, services and more on OnFire Marketplace.',
      url: SITE_URL + '/#/',
    });
    updateJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: SITE_URL + '/#/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    });
  }

  function renderProductSection(containerId, result, emptyMsg, scroll = false) {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (result.status === 'rejected') {
      el.innerHTML = emptyStateHTML('&#x26A0;&#xFE0F;', 'Failed to load', 'Could not fetch products. Please try again later.');
      return;
    }

    const products = result.value;
    if (!products || products.length === 0) {
      el.innerHTML = emptyStateHTML('&#x1F4E6;', emptyMsg, 'Check back soon for new listings.');
      return;
    }

    if (scroll) {
      el.innerHTML = `<div class="products-scroll">${products.map(productCardHTML).join('')}</div>`;
    } else {
      el.innerHTML = `<div class="products-grid">${products.map(productCardHTML).join('')}</div>`;
    }
  }

  // ============================================================
  // Page: Category
  // ============================================================

  async function renderCategoryPage(params, query) {
    const catId = parseInt(params.id, 10);
    const cat = getCategoryById(catId);
    const catName = cat ? cat.name : `Category ${catId}`;
    const catEmoji = cat ? cat.emoji : '\uD83D\uDCE6';
    const page = parseInt(query.get('page')) || 1;
    const sort = query.get('sort') || 'created_at.desc';
    const txType = query.get('tx') || '';
    const condition = query.get('condition') || '';
    const offset = (page - 1) * PAGE_SIZE;
    const currentFilters = parseFiltersFromQuery(query);

    const availableTxTypes = getTransactionTypesForCategory(catId);
    const txTabsHTML = availableTxTypes.map(key => {
      const t = TRANSACTION_TYPES[key];
      const isActive = (key === 'all' && !txType) || (t.value === txType);
      return `<button class="transaction-tab${isActive ? ' transaction-tab--active' : ''}" data-tx="${t.value || ''}">${t.label}</button>`;
    }).join('');

    const conditionChipsHTML = CONDITION_OPTIONS.map(c => {
      const isActive = (c.value === null && !condition) || (c.value === condition);
      return `<button class="condition-chip${isActive ? ' condition-chip--active' : ''}" data-condition="${c.value || ''}">${c.label}</button>`;
    }).join('');

    // Fetch field definitions for filters
    const fieldDefs = await getFieldDefs(catId);
    const filtersHTML = buildFilterControls(fieldDefs, currentFilters);

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page-enter">
        <div class="page-header">
          <div class="container">
            <div class="breadcrumb">
              <a href="#/">Home</a>
              <span class="breadcrumb__sep">/</span>
              <span>${catName}</span>
            </div>
            <h1 class="page-header__title">${catEmoji} ${catName} <span class="page-header__count" id="cat-count"></span></h1>
            ${cat ? `<div class="subcategory-pills">${cat.subs.map(s => `<a href="#/category/${s.id}" class="pill">${s.name}</a>`).join('')}</div>` : ''}
          </div>
        </div>

        <div class="container">
          <div class="transaction-tabs" id="cat-tx-tabs">${txTabsHTML}</div>
          <div class="condition-filters" id="cat-condition-filters">${conditionChipsHTML}</div>

          ${filtersHTML}

          <div class="filter-bar">
            <div class="filter-bar__sort">
              <span class="filter-bar__label">Sort by:</span>
              <select class="filter-select" id="cat-sort">
                <option value="created_at.desc" ${sort === 'created_at.desc' ? 'selected' : ''}>Newest</option>
                <option value="price.asc" ${sort === 'price.asc' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price.desc" ${sort === 'price.desc' ? 'selected' : ''}>Price: High to Low</option>
                <option value="rating.desc" ${sort === 'rating.desc' ? 'selected' : ''}>Popular</option>
              </select>
            </div>
          </div>

          <div id="cat-products">${skeletonGridHTML(8)}</div>
          <div id="cat-pagination"></div>
        </div>
      </div>`;

    // Build query string helper (includes property filters)
    function catQueryString(overrides = {}) {
      const s = overrides.sort !== undefined ? overrides.sort : sort;
      const t = overrides.tx !== undefined ? overrides.tx : txType;
      const c = overrides.condition !== undefined ? overrides.condition : condition;
      const p = overrides.page !== undefined ? overrides.page : 1;
      const f = overrides.filters !== undefined ? overrides.filters : currentFilters;
      let qs = `sort=${s}&page=${p}`;
      if (t) qs += `&tx=${t}`;
      if (c) qs += `&condition=${c}`;
      const fqs = filtersToQueryString(f);
      if (fqs) qs += `&${fqs}`;
      return qs;
    }

    // Filter panel event handlers
    const filtersPanel = document.getElementById('filters-panel');
    if (filtersPanel) {
      // "More filters" toggle
      const moreBtn = document.getElementById('filters-more-btn');
      if (moreBtn) {
        moreBtn.addEventListener('click', () => {
          const extras = filtersPanel.querySelectorAll('.filters-extra');
          const hidden = extras[0]?.classList.contains('filters-hidden');
          extras.forEach(el => el.classList.toggle('filters-hidden'));
          moreBtn.textContent = hidden ? 'Fewer filters' : `More filters (${extras.length})`;
        });
      }

      // Reset filters
      const resetBtn = document.getElementById('filters-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          router.navigate(`#/category/${catId}?${catQueryString({ filters: {}, page: 1 })}`);
        });
      }

      // Filter change handler (debounced)
      const applyFilters = debounce(() => {
        const newFilters = collectFiltersFromDOM();
        router.navigate(`#/category/${catId}?${catQueryString({ filters: newFilters, page: 1 })}`);
      }, 400);

      filtersPanel.querySelectorAll('select[data-filter-key]').forEach(el => {
        el.addEventListener('change', applyFilters);
      });
      filtersPanel.querySelectorAll('input[data-filter-key]').forEach(el => {
        if (el.type === 'checkbox') {
          el.addEventListener('change', applyFilters);
        } else {
          el.addEventListener('input', applyFilters);
        }
      });
    }

    // Sort handler
    document.getElementById('cat-sort').addEventListener('change', (e) => {
      router.navigate(`#/category/${catId}?${catQueryString({ sort: e.target.value, page: 1 })}`);
    });

    // Transaction type tab handler
    document.getElementById('cat-tx-tabs').addEventListener('click', (e) => {
      const tab = e.target.closest('.transaction-tab');
      if (!tab) return;
      const newTx = tab.dataset.tx || '';
      router.navigate(`#/category/${catId}?${catQueryString({ tx: newTx, page: 1 })}`);
    });

    // Condition chip handler
    document.getElementById('cat-condition-filters').addEventListener('click', (e) => {
      const chip = e.target.closest('.condition-chip');
      if (!chip) return;
      const newCondition = chip.dataset.condition || '';
      router.navigate(`#/category/${catId}?${catQueryString({ condition: newCondition, page: 1 })}`);
    });

    updateMeta({
      title: catName + ' - OnFire Marketplace',
      description: 'Browse ' + catName + ' listings on OnFire Marketplace.',
      url: SITE_URL + '/#/category/' + catId,
    });
    updateJsonLd({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: catName, item: SITE_URL + '/#/category/' + catId },
      ],
    });

    try {
      let apiParams = `&order=${sort}&limit=${PAGE_SIZE}&offset=${offset}`;
      if (txType) apiParams += `&transaction_type=eq.${txType}`;
      if (condition) apiParams += `&condition=eq.${condition}`;
      apiParams += buildFilterAPIParams(currentFilters);

      const { data, total } = await api.byCategory(catId, apiParams);
      const totalPages = total != null ? Math.ceil(total / PAGE_SIZE) : 1;

      const countEl = document.getElementById('cat-count');
      if (countEl && total != null) countEl.textContent = `(${total} listing${total !== 1 ? 's' : ''})`;

      const container = document.getElementById('cat-products');
      if (!data || data.length === 0) {
        container.innerHTML = emptyStateHTML('\uD83D\uDCE6', 'No products found', `No active listings in ${catName} yet.`,
          `<a href="#/" class="btn btn--primary">Browse All</a>`);
      } else {
        container.innerHTML = `<div class="products-grid">${data.map(productCardHTML).join('')}</div>`;
      }

      const pagEl = document.getElementById('cat-pagination');
      pagEl.innerHTML = paginationHTML(page, totalPages);
      pagEl.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-page]');
        if (btn && !btn.disabled) {
          router.navigate(`#/category/${catId}?${catQueryString({ page: btn.dataset.page })}`);
        }
      });
    } catch (err) {
      document.getElementById('cat-products').innerHTML = emptyStateHTML('&#x26A0;&#xFE0F;', 'Failed to load', err.message);
    }
  }

  // ============================================================
  // Page: Search
  // ============================================================

  async function renderSearchPage(params, query) {
    const q = query.get('q') || '';
    const page = parseInt(query.get('page')) || 1;
    const sort = query.get('sort') || 'created_at.desc';
    const offset = (page - 1) * PAGE_SIZE;

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="page-enter">
        <div class="search-hero">
          <div class="container">
            <div class="search-bar">
              <input class="search-bar__input" id="search-input" type="text" placeholder="Search products and services..." value="${escapeHtml(q)}" autocomplete="off">
              <button class="search-bar__btn" id="search-btn">Search</button>
            </div>
          </div>
        </div>

        <div class="container">
          <div class="search-results__header">
            ${q ? `<h1 class="search-results__query">Results for "${escapeHtml(q)}"</h1>` : '<h1 class="search-results__query">Search</h1>'}
            <p class="search-results__count" id="search-count"></p>
          </div>

          ${q ? `
          <div class="filter-bar">
            <div class="filter-bar__sort">
              <span class="filter-bar__label">Sort by:</span>
              <select class="filter-select" id="search-sort">
                <option value="created_at.desc" ${sort === 'created_at.desc' ? 'selected' : ''}>Newest</option>
                <option value="price.asc" ${sort === 'price.asc' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price.desc" ${sort === 'price.desc' ? 'selected' : ''}>Price: High to Low</option>
                <option value="rating.desc" ${sort === 'rating.desc' ? 'selected' : ''}>Popular</option>
              </select>
            </div>
          </div>` : ''}

          <div id="search-products">${q ? skeletonGridHTML(8) : ''}</div>
          <div id="search-pagination"></div>
        </div>
      </div>`;

    // Search handlers
    const input = document.getElementById('search-input');
    const btn = document.getElementById('search-btn');
    const doSearch = () => {
      const val = input.value.trim();
      if (val) router.navigate(`#/search?q=${encodeURIComponent(val)}`);
    };
    btn.addEventListener('click', doSearch);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });

    // Debounced auto-search
    input.addEventListener('input', debounce(() => {
      const val = input.value.trim();
      if (val.length >= 3) router.navigate(`#/search?q=${encodeURIComponent(val)}`);
    }, 300));

    // Sort handler
    const sortEl = document.getElementById('search-sort');
    if (sortEl) {
      sortEl.addEventListener('change', (e) => {
        router.navigate(`#/search?q=${encodeURIComponent(q)}&sort=${e.target.value}&page=1`);
      });
    }

    updateMeta({
      title: q ? 'Search: ' + q + ' - OnFire Marketplace' : 'Search - OnFire Marketplace',
      description: q ? 'Search results for ' + q + ' on OnFire Marketplace.' : 'Search products and services on OnFire Marketplace.',
      url: SITE_URL + '/#/search' + (q ? '?q=' + encodeURIComponent(q) : ''),
    });

    if (!q) return;

    try {
      const searchFilters = parseFiltersFromQuery(query);
      let searchApiParams = `&order=${sort}&limit=${PAGE_SIZE}&offset=${offset}`;
      searchApiParams += buildFilterAPIParams(searchFilters);

      const { data, total } = await api.search(q, searchApiParams);
      const totalPages = total != null ? Math.ceil(total / PAGE_SIZE) : 1;

      const countEl = document.getElementById('search-count');
      if (countEl && total != null) countEl.textContent = `${total} result${total !== 1 ? 's' : ''} found`;

      const container = document.getElementById('search-products');
      if (!data || data.length === 0) {
        container.innerHTML = emptyStateHTML('\uD83D\uDD0D', 'No results found', `We couldn't find anything matching "${escapeHtml(q)}". Try different keywords.`,
          `<a href="#/" class="btn btn--primary">Browse Categories</a>`);
      } else {
        // Determine if results are in a single category
        const categoryIds = [...new Set(data.map(p => p.category_id).filter(Boolean))];
        let searchFiltersHTML = '';

        if (categoryIds.length === 1) {
          // Single category - show category-specific filters
          const searchFieldDefs = await getFieldDefs(categoryIds[0]);
          searchFiltersHTML = buildFilterControls(searchFieldDefs, searchFilters);
        } else if (categoryIds.length > 1) {
          // Multiple categories - show universal price filter
          const priceMin = searchFilters.price_min || '';
          const priceMax = searchFilters.price_max || '';
          searchFiltersHTML = `<div class="filters-panel" id="filters-panel">
            <div class="filters-panel__header">
              <span class="filters-panel__title">Filters</span>
              <div class="filters-actions">
                <button class="filters-toggle" id="filters-reset-btn" type="button">Reset filters</button>
              </div>
            </div>
            <div class="filters-grid">
              <div class="filter-group">
                <label>Price</label>
                <div class="filter-range">
                  <input type="number" data-filter-key="price_min" data-filter-type="number_min" placeholder="Min" value="${escapeHtml(priceMin)}">
                  <span class="filter-range__sep">&ndash;</span>
                  <input type="number" data-filter-key="price_max" data-filter-type="number_max" placeholder="Max" value="${escapeHtml(priceMax)}">
                </div>
              </div>
            </div>
          </div>`;
        }

        // Insert filters before the products grid
        container.innerHTML = searchFiltersHTML + `<div class="products-grid">${data.map(productCardHTML).join('')}</div>`;

        // Wire up search filter events
        const searchFiltersPanel = container.querySelector('#filters-panel');
        if (searchFiltersPanel) {
          const resetBtn = searchFiltersPanel.querySelector('#filters-reset-btn');
          if (resetBtn) {
            resetBtn.addEventListener('click', () => {
              router.navigate(`#/search?q=${encodeURIComponent(q)}&sort=${sort}&page=1`);
            });
          }

          const moreBtn = searchFiltersPanel.querySelector('#filters-more-btn');
          if (moreBtn) {
            moreBtn.addEventListener('click', () => {
              const extras = searchFiltersPanel.querySelectorAll('.filters-extra');
              const hidden = extras[0]?.classList.contains('filters-hidden');
              extras.forEach(el => el.classList.toggle('filters-hidden'));
              moreBtn.textContent = hidden ? 'Fewer filters' : `More filters (${extras.length})`;
            });
          }

          const applySearchFilters = debounce(() => {
            const newFilters = collectFiltersFromDOM();
            const fqs = filtersToQueryString(newFilters);
            let navUrl = `#/search?q=${encodeURIComponent(q)}&sort=${sort}&page=1`;
            if (fqs) navUrl += `&${fqs}`;
            router.navigate(navUrl);
          }, 400);

          searchFiltersPanel.querySelectorAll('select[data-filter-key]').forEach(el => el.addEventListener('change', applySearchFilters));
          searchFiltersPanel.querySelectorAll('input[data-filter-key]').forEach(el => {
            if (el.type === 'checkbox') el.addEventListener('change', applySearchFilters);
            else el.addEventListener('input', applySearchFilters);
          });
        }
      }

      const pagEl = document.getElementById('search-pagination');
      pagEl.innerHTML = paginationHTML(page, totalPages);
      pagEl.addEventListener('click', (e) => {
        const b = e.target.closest('[data-page]');
        if (b && !b.disabled) {
          const fqs = filtersToQueryString(searchFilters);
          let navUrl = `#/search?q=${encodeURIComponent(q)}&sort=${sort}&page=${b.dataset.page}`;
          if (fqs) navUrl += `&${fqs}`;
          router.navigate(navUrl);
        }
      });
    } catch (err) {
      document.getElementById('search-products').innerHTML = emptyStateHTML('&#x26A0;&#xFE0F;', 'Search failed', err.message);
    }
  }

  // ============================================================
  // Page: Product Detail
  // ============================================================

  async function renderProductDetail(params) {
    const id = params.id;
    const app = document.getElementById('app');

    // Loading state
    app.innerHTML = `
      <div class="page-enter">
        <div class="page-header">
          <div class="container">
            <div class="breadcrumb">
              <a href="#/">Home</a>
              <span class="breadcrumb__sep">/</span>
              <span class="skeleton skeleton--text" style="width:120px;display:inline-block;height:14px;"></span>
            </div>
          </div>
        </div>
        <div class="container product-detail">
          <div class="product-detail__layout">
            <div class="skeleton" style="aspect-ratio:4/3;border-radius:var(--radius-lg);"></div>
            <div>
              <div class="skeleton skeleton--title" style="width:80%;height:28px;margin-bottom:16px;"></div>
              <div class="skeleton skeleton--price" style="width:40%;height:36px;margin-bottom:24px;"></div>
              <div class="skeleton skeleton--text" style="margin-bottom:8px;"></div>
              <div class="skeleton skeleton--text" style="margin-bottom:8px;"></div>
              <div class="skeleton skeleton--text skeleton--text-short"></div>
            </div>
          </div>
        </div>
      </div>`;

    try {
      const products = await api.product(id);
      if (!products || products.length === 0) {
        app.innerHTML = emptyStateHTML('\uD83D\uDCE6', 'Product not found', 'This listing may have been removed.',
          `<a href="#/" class="btn btn--primary">Browse Products</a>`);
        return;
      }

      const product = products[0];
      const fieldDefs = await getFieldDefs(product.category_id);
      const propertiesHTML = renderPropertiesHTML(product, fieldDefs);
      const images = getAllProductImages(product);
      const cat = getCategoryById(product.category_id);
      const catName = cat ? cat.name : 'Products';
      const catEmoji = cat ? cat.emoji : '\uD83D\uDCE6';
      const title = escapeHtml(product.name || product.title || 'Untitled');
      const price = formatPrice(product.price, product.currency);
      const desc = escapeHtml(product.description || product.detailed_description || '');

      // Gallery HTML
      let galleryMain = '';
      let galleryThumbs = '';
      if (images.length > 0) {
        galleryMain = `<img src="${images[0]}" alt="${title}" id="gallery-main-img" onerror="this.parentElement.innerHTML='<span class=\\'gallery__main-placeholder\\'>${catEmoji}</span>'">`;
        if (images.length > 1) {
          galleryThumbs = `<div class="gallery__thumbs">${images.map((img, i) =>
            `<div class="gallery__thumb ${i === 0 ? 'is-active' : ''}" data-idx="${i}"><img src="${img}" alt="" loading="lazy"></div>`
          ).join('')}</div>`;
        }
      } else {
        galleryMain = `<span class="gallery__main-placeholder">${catEmoji}</span>`;
      }

      // Price row
      let priceRow = `<span class="product-info__price">${price}</span>`;
      if (product.compare_at_price && product.compare_at_price > product.price) {
        priceRow += `<span class="product-info__compare">${formatPrice(product.compare_at_price, product.currency)}</span>`;
      }
      if (product.discount_percentage) {
        priceRow += `<span class="product-info__discount">-${product.discount_percentage}%</span>`;
      }

      // Meta rows
      let metaHTML = '';
      if (product.condition) metaHTML += `<div class="product-info__meta-row"><span class="product-info__meta-label">Condition</span><span class="product-info__meta-value">${conditionBadgeHTML(product.condition)}</span></div>`;
      if (product.brand) metaHTML += `<div class="product-info__meta-row"><span class="product-info__meta-label">Brand</span><span class="product-info__meta-value">${escapeHtml(product.brand)}</span></div>`;
      if (product.sku) metaHTML += `<div class="product-info__meta-row"><span class="product-info__meta-label">SKU</span><span class="product-info__meta-value">${escapeHtml(product.sku)}</span></div>`;
      if (product.type) metaHTML += `<div class="product-info__meta-row"><span class="product-info__meta-label">Type</span><span class="product-info__meta-value" style="text-transform:capitalize">${product.type}</span></div>`;
      metaHTML += `<div class="product-info__meta-row"><span class="product-info__meta-label">Category</span><span class="product-info__meta-value"><a href="#/category/${product.category_id}">${catEmoji} ${catName}</a></span></div>`;
      metaHTML += `<div class="product-info__meta-row"><span class="product-info__meta-label">Listed</span><span class="product-info__meta-value">${timeAgo(product.created_at)}</span></div>`;

      // Tags
      let tagsHTML = '';
      if (product.tags && product.tags.length > 0) {
        const tags = Array.isArray(product.tags) ? product.tags : (typeof product.tags === 'string' ? product.tags.split(',') : []);
        tagsHTML = `<div class="product-info__tags">${tags.map(t => `<span class="tag">${escapeHtml(t.trim())}</span>`).join('')}</div>`;
      }

      // Rating
      let ratingHTML = '';
      if (product.rating) {
        ratingHTML = `<div style="margin-bottom:var(--space-md);display:flex;align-items:center;gap:var(--space-sm);">
          ${renderStars(product.rating, 'lg')}
          <span style="font-size:var(--font-size-sm);color:var(--color-text-secondary);">${parseFloat(product.rating).toFixed(1)} (${product.review_count || 0} review${(product.review_count || 0) !== 1 ? 's' : ''})</span>
        </div>`;
      }

      const isService = product.type === 'service';
      const ctaLabel = isService ? 'Book Now' : 'Contact Seller';
      const sellerId = product.seller_id || product.user_id || '';

      // Service-specific badges
      let serviceBadgesHTML = '';
      if (isService) {
        const props = product.properties || {};
        const deliveryMode = props.delivery_mode || props.service_mode || '';
        if (deliveryMode) {
          const modeMap = {
            online: { cls: 'service-badge--online', label: 'Online' },
            in_person: { cls: 'service-badge--in-person', label: 'In Person' },
            both: { cls: 'service-badge--both', label: 'Online & In Person' },
          };
          const mode = modeMap[deliveryMode] || { cls: 'service-badge--both', label: deliveryMode };
          serviceBadgesHTML += `<span class="service-badge ${mode.cls}">${mode.label}</span>`;
        }
        if (props.duration) {
          serviceBadgesHTML += `<span class="service-badge service-badge--duration">${escapeHtml(String(props.duration))}</span>`;
        }
        if (props.availability) {
          const avail = Array.isArray(props.availability) ? props.availability.join(', ') : String(props.availability);
          serviceBadgesHTML += `<span class="service-badge service-badge--availability">${escapeHtml(avail)}</span>`;
        }
      }

      // Build service layout vs product layout
      let detailHTML;
      if (isService) {
        // Service booking-style layout
        const heroImage = images.length > 0
          ? `<img class="service-hero__image" src="${images[0]}" alt="${title}" onerror="this.outerHTML='<div class=\\'service-hero__placeholder\\'>${catEmoji}</div>'">`
          : `<div class="service-hero__placeholder">${catEmoji}</div>`;

        detailHTML = `
        <div class="page-enter">
          <div class="page-header">
            <div class="container">
              <div class="breadcrumb">
                <a href="#/">Home</a>
                <span class="breadcrumb__sep">/</span>
                <a href="#/category/${product.category_id}">${catName}</a>
                <span class="breadcrumb__sep">/</span>
                <span>${title}</span>
              </div>
            </div>
          </div>

          <div class="container product-detail">
            <div class="service-hero">${heroImage}</div>

            <div class="product-detail__layout">
              <div class="product-info">
                ${transactionTypeDetailLabel(product.transaction_type)}
                <h1 class="product-info__title">${title}</h1>
                ${product.brand ? `<div class="service-provider">by ${escapeHtml(product.brand)}</div>` : ''}
                ${ratingHTML}
                <div class="product-info__price-row">${priceRow}</div>

                ${serviceBadgesHTML ? `<div class="service-badges">${serviceBadgesHTML}</div>` : ''}

                <div class="product-info__meta">${metaHTML}</div>
                ${tagsHTML}

                ${desc ? `
                <div class="product-info__description">
                  <h3>About this Service</h3>
                  <div class="product-info__description-text">${desc}</div>
                </div>` : ''}

                ${propertiesHTML ? `<div class="product-info__properties">${propertiesHTML}</div>` : ''}
              </div>

              <div>
                <div class="seller-card">
                  <div class="seller-card__title">Ready to book?</div>
                  <button class="btn--cta" id="contact-seller-btn">${ctaLabel}</button>
                  <div style="text-align:center;margin-top:var(--space-md);">
                    <button class="btn btn--ghost" id="post-ad-btn">Post Your Own Ad</button>
                  </div>
                </div>
              </div>
            </div>

            <div id="product-reviews"></div>
          </div>
        </div>`;
      } else {
        // Standard product layout
        detailHTML = `
        <div class="page-enter">
          <div class="page-header">
            <div class="container">
              <div class="breadcrumb">
                <a href="#/">Home</a>
                <span class="breadcrumb__sep">/</span>
                <a href="#/category/${product.category_id}">${catName}</a>
                <span class="breadcrumb__sep">/</span>
                <span>${title}</span>
              </div>
            </div>
          </div>

          <div class="container product-detail">
            <div class="product-detail__layout">
              <div class="gallery">
                <div class="gallery__main">${galleryMain}</div>
                ${galleryThumbs}
              </div>

              <div class="product-info">
                ${transactionTypeDetailLabel(product.transaction_type)}
                <h1 class="product-info__title">${title}</h1>
                ${ratingHTML}
                <div class="product-info__price-row">${priceRow}</div>

                <div class="product-info__meta">${metaHTML}</div>
                ${tagsHTML}

                ${desc ? `
                <div class="product-info__description">
                  <h3>Description</h3>
                  <div class="product-info__description-text">${desc}</div>
                </div>` : ''}

                ${propertiesHTML ? `<div class="product-info__properties">${propertiesHTML}</div>` : ''}

                <div class="seller-card">
                  <div class="seller-card__title">Interested?</div>
                  <button class="btn--cta" id="contact-seller-btn">${ctaLabel}</button>
                  <div style="text-align:center;margin-top:var(--space-sm);">
                    <button class="btn btn--ghost" id="post-ad-btn">Post Your Own Ad</button>
                  </div>
                </div>
              </div>
            </div>

            <div id="product-reviews"></div>
          </div>
        </div>`;
      }

      app.innerHTML = detailHTML;

      // Gallery interactivity
      if (images.length > 1) {
        const thumbsContainer = document.querySelector('.gallery__thumbs');
        if (thumbsContainer) {
          thumbsContainer.addEventListener('click', (e) => {
            const thumb = e.target.closest('.gallery__thumb');
            if (!thumb) return;
            const idx = parseInt(thumb.dataset.idx, 10);
            const mainImg = document.getElementById('gallery-main-img');
            if (mainImg) mainImg.src = images[idx];
            thumbsContainer.querySelectorAll('.gallery__thumb').forEach(t => t.classList.remove('is-active'));
            thumb.classList.add('is-active');
          });
        }
      }

      // QR modal for Contact Seller / Book Now
      const contactBtn = document.getElementById('contact-seller-btn');
      if (contactBtn) {
        contactBtn.addEventListener('click', () => {
          showQRModal(sellerId, product.id, product.name || product.title || 'Untitled', isService);
        });
      }
      const postAdBtn = document.getElementById('post-ad-btn');
      if (postAdBtn) {
        postAdBtn.addEventListener('click', () => {
          showQRModal(sellerId, product.id, product.name || product.title || 'Untitled', isService);
        });
      }

      // Fetch reviews
      loadReviews(id);

      // SEO: dynamic meta + structured data
      const metaDesc = (product.description || product.detailed_description || '').substring(0, 160);
      const coverImage = getProductImage(product);
      updateMeta({
        title: title + ' - ' + price + ' - OnFire Marketplace',
        description: metaDesc,
        ogType: 'product',
        url: SITE_URL + '/#/product/' + product.id,
        image: coverImage || DEFAULT_OG_IMAGE,
      });

      const productLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name || product.title || 'Untitled',
        description: product.description || product.detailed_description || '',
        url: SITE_URL + '/#/product/' + product.id,
        offers: {
          '@type': 'Offer',
          price: product.price != null ? parseFloat(product.price) : undefined,
          priceCurrency: (product.currency || 'USD').toUpperCase(),
          availability: 'https://schema.org/InStock',
        },
      };
      if (coverImage) productLd.image = coverImage;
      if (product.brand) productLd.brand = { '@type': 'Brand', name: product.brand };
      if (product.rating && product.review_count) {
        productLd.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: parseFloat(product.rating),
          reviewCount: product.review_count,
        };
      }
      updateJsonLd(productLd);

    } catch (err) {
      app.innerHTML = emptyStateHTML('&#x26A0;&#xFE0F;', 'Failed to load product', err.message,
        `<a href="#/" class="btn btn--primary">Browse Products</a>`);
    }
  }

  async function loadReviews(productId) {
    const container = document.getElementById('product-reviews');
    if (!container) return;

    try {
      const reviews = await api.reviews(productId);
      if (!reviews || reviews.length === 0) return;

      const avgRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

      container.innerHTML = `
        <div class="reviews">
          <div class="reviews__header">
            <h2 class="reviews__title">Reviews</h2>
            <div class="reviews__summary">
              ${renderStars(avgRating, 'lg')}
              <span>${avgRating.toFixed(1)} out of 5 (${reviews.length} review${reviews.length !== 1 ? 's' : ''})</span>
            </div>
          </div>
          ${reviews.map(r => `
            <div class="review">
              <div class="review__header">
                ${renderStars(r.rating)}
                <span class="review__author">${escapeHtml(r.reviewer_name || 'Anonymous')}</span>
                <span class="review__date">${timeAgo(r.created_at)}</span>
              </div>
              ${r.comment ? `<p class="review__text">${escapeHtml(r.comment)}</p>` : ''}
            </div>`).join('')}
        </div>`;
    } catch {
      // Reviews are optional, fail silently
    }
  }

  // ============================================================
  // Navigation: Dropdown, Mobile Menu, Footer
  // ============================================================

  function initNavigation() {
    // Categories dropdown
    const dropdownBtn = document.querySelector('#categories-dropdown button');
    const dropdownMenu = document.getElementById('categories-dropdown-menu');
    const dropdownContainer = document.getElementById('categories-dropdown');

    if (dropdownBtn && dropdownMenu) {
      dropdownMenu.innerHTML = `<div class="dropdown-menu__grid">${CATEGORIES.map(cat =>
        `<a href="#/category/${cat.id}" class="dropdown-menu__item">
          <span class="dropdown-menu__item-emoji">${cat.emoji}</span>
          <span class="dropdown-menu__item-name">${cat.name}</span>
        </a>`).join('')}</div>`;

      dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdownMenu.classList.contains('is-open');
        dropdownMenu.classList.toggle('is-open');
        dropdownContainer.setAttribute('aria-expanded', !isOpen);
      });

      document.addEventListener('click', (e) => {
        if (!dropdownContainer.contains(e.target)) {
          dropdownMenu.classList.remove('is-open');
          dropdownContainer.setAttribute('aria-expanded', 'false');
        }
      });

      // Close dropdown on navigation
      dropdownMenu.addEventListener('click', () => {
        dropdownMenu.classList.remove('is-open');
        dropdownContainer.setAttribute('aria-expanded', 'false');
      });
    }

    // Mobile menu
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileClose = document.getElementById('mobile-close');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileCats = document.getElementById('mobile-categories');

    if (mobileCats) {
      mobileCats.innerHTML = CATEGORIES.map(cat =>
        `<a href="#/category/${cat.id}" class="mobile-menu__cat-link">${cat.emoji} ${cat.name}</a>`
      ).join('');
    }

    function openMobile() { mobileMenu.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
    function closeMobile() { mobileMenu.classList.remove('is-open'); document.body.style.overflow = ''; }

    if (mobileToggle) mobileToggle.addEventListener('click', openMobile);
    if (mobileClose) mobileClose.addEventListener('click', closeMobile);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobile);

    // Close mobile menu on nav
    mobileMenu.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeMobile();
    });

    // Footer categories
    const footerCats = document.getElementById('footer-categories');
    if (footerCats) {
      footerCats.innerHTML = CATEGORIES.map(cat =>
        `<li><a href="#/category/${cat.id}">${cat.emoji} ${cat.name}</a></li>`
      ).join('');
    }
  }

  // ============================================================
  // Scroll to top on navigation
  // ============================================================

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // ============================================================
  // Initialize
  // ============================================================

  function init() {
    initNavigation();

    router.register('/', () => { scrollToTop(); renderHomepage(); });
    router.register('/category/:id', (params, query) => { scrollToTop(); renderCategoryPage(params, query); });
    router.register('/search', (params, query) => { scrollToTop(); renderSearchPage(params, query); });
    router.register('/product/:id', (params) => { scrollToTop(); renderProductDetail(params); });

    router.init();
  }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
