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
    { id: 1, name: 'Electronics', emoji: '💻', subs: ['Smartphones', 'Computers & Tablets', 'TVs', 'Audio', 'Cameras', 'Video Games', 'Smart Home', 'Other'] },
    { id: 2, name: 'Fashion & Apparel', emoji: '👗', subs: ["Women's", "Men's", "Children's", 'Shoes', 'Bags', 'Jewelry', 'Activewear', 'Vintage'] },
    { id: 3, name: 'Home & Garden', emoji: '🏠', subs: ['Furniture'] },
    { id: 4, name: 'Beauty & Personal Care', emoji: '💄', subs: ['Skincare'] },
    { id: 5, name: 'Sports & Outdoors', emoji: '⚽', subs: ['Fitness Equipment'] },
    { id: 6, name: 'Toys & Hobbies', emoji: '🧸', subs: ['Toys & Games'] },
    { id: 7, name: 'Automotive', emoji: '🚗', subs: ['Car Parts & Accessories'] },
    { id: 8, name: 'Baby & Kids', emoji: '👶', subs: ['Baby Clothing'] },
    { id: 9, name: 'Pet Supplies', emoji: '🐾', subs: ['Dog Supplies'] },
    { id: 10, name: 'Services', emoji: '🔧', subs: ['Home Services'] },
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
    const cat = CATEGORIES.find(c => c.id === categoryId);
    return cat ? cat.emoji : '\uD83D\uDCE6';
  }

  function getCategoryById(id) {
    return CATEGORIES.find(c => c.id === parseInt(id, 10)) || null;
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

    // Categories grid
    const catGrid = document.getElementById('home-categories');
    catGrid.innerHTML = CATEGORIES.map(cat => `
      <a href="#/category/${cat.id}" class="category-card">
        <div class="category-card__icon">${cat.emoji}</div>
        <div class="category-card__name">${cat.name}</div>
        <div class="category-card__subs">
          ${cat.subs.map(s => `<span class="category-card__sub">${s}</span>`).join('')}
        </div>
      </a>`).join('');

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
            ${cat ? `<div class="subcategory-pills">${cat.subs.map(s => `<span class="pill">${s}</span>`).join('')}</div>` : ''}
          </div>
        </div>

        <div class="container">
          <div class="transaction-tabs" id="cat-tx-tabs">${txTabsHTML}</div>
          <div class="condition-filters" id="cat-condition-filters">${conditionChipsHTML}</div>

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

    // Build query string helper
    function catQueryString(overrides = {}) {
      const s = overrides.sort !== undefined ? overrides.sort : sort;
      const t = overrides.tx !== undefined ? overrides.tx : txType;
      const c = overrides.condition !== undefined ? overrides.condition : condition;
      const p = overrides.page !== undefined ? overrides.page : 1;
      let qs = `sort=${s}&page=${p}`;
      if (t) qs += `&tx=${t}`;
      if (c) qs += `&condition=${c}`;
      return qs;
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
      const { data, total } = await api.search(q, `&order=${sort}&limit=${PAGE_SIZE}&offset=${offset}`);
      const totalPages = total != null ? Math.ceil(total / PAGE_SIZE) : 1;

      const countEl = document.getElementById('search-count');
      if (countEl && total != null) countEl.textContent = `${total} result${total !== 1 ? 's' : ''} found`;

      const container = document.getElementById('search-products');
      if (!data || data.length === 0) {
        container.innerHTML = emptyStateHTML('\uD83D\uDD0D', 'No results found', `We couldn't find anything matching "${escapeHtml(q)}". Try different keywords.`,
          `<a href="#/" class="btn btn--primary">Browse Categories</a>`);
      } else {
        container.innerHTML = `<div class="products-grid">${data.map(productCardHTML).join('')}</div>`;
      }

      const pagEl = document.getElementById('search-pagination');
      pagEl.innerHTML = paginationHTML(page, totalPages);
      pagEl.addEventListener('click', (e) => {
        const b = e.target.closest('[data-page]');
        if (b && !b.disabled) {
          router.navigate(`#/search?q=${encodeURIComponent(q)}&sort=${sort}&page=${b.dataset.page}`);
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

      app.innerHTML = `
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
                  <a href="${ADMIN_URL}" class="btn btn--primary btn--block" target="_blank" rel="noopener">Contact Seller</a>
                  <div style="text-align:center;margin-top:var(--space-sm);">
                    <a href="${ADMIN_URL}" class="btn btn--ghost" target="_blank" rel="noopener">Post Your Own Ad</a>
                  </div>
                </div>
              </div>
            </div>

            <div id="product-reviews"></div>
          </div>
        </div>`;

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
