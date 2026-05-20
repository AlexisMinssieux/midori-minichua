/* ================================================
   MIDORI MINICHUA — Logique principale
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
  setupNav();
  setupScrollReveal();

  const page = document.body.dataset.page;
  if (page === 'home')     initHomePage();
  if (page === 'products') initProductsPage();
  if (page === 'cart')     initCartPage();
});

/* ── Navigation ───────────────────────────────── */
function setupNav() {
  const header   = document.querySelector('header');
  const toggle   = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
  }

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks?.classList.remove('open'));
  });
}

/* ── Scroll Reveal ────────────────────────────── */
function setupScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ── Product Card ─────────────────────────────── */
function createProductCard(product) {
  const outOfStock = !product.inStock;
  const badgeHtml = outOfStock
    ? `<span class="product-badge badge-stock">Épuisé</span>`
    : product.badge
      ? `<span class="product-badge badge-${product.badge.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s/g, '')}">${product.badge}</span>`
      : '';

  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-image-wrap">
        <div class="product-image-bg" style="background: ${product.color};">
          <span style="filter: drop-shadow(0 4px 8px rgba(0,0,0,0.12))">${product.emoji}</span>
        </div>
        ${badgeHtml}
        <div class="product-actions">
          <button class="btn"
            onclick="event.stopPropagation(); Cart.add(${product.id})"
            ${outOfStock ? 'disabled' : ''}>
            ${outOfStock ? 'Épuisé' : '+ Ajouter au panier'}
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${CATEGORIES.find(c => c.id === product.category)?.label || product.category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">${product.price.toFixed(2).replace('.', ',')} €</div>
      </div>
    </article>`;
}

/* ── Page d'accueil ───────────────────────────── */
function initHomePage() {
  const grid = document.getElementById('featuredProducts');
  if (!grid) return;
  const featured = PRODUCTS.filter(p => p.featured);
  grid.innerHTML = featured.map(createProductCard).join('');
}

/* ── Page Boutique ────────────────────────────── */
let currentCategory = 'all';
let currentSort = 'default';

function initProductsPage() {
  // Lire le filtre depuis l'URL (?category=bijoux)
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('category');
  if (catParam && CATEGORIES.find(c => c.id === catParam)) {
    currentCategory = catParam;
  }

  renderFilters();
  renderProducts();

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', e => {
      currentSort = e.target.value;
      renderProducts();
    });
  }
}

function renderFilters() {
  const el = document.getElementById('categoryFilters');
  if (!el) return;
  el.innerHTML = CATEGORIES.map(cat => `
    <button class="filter-btn ${cat.id === currentCategory ? 'active' : ''}"
      onclick="setCategory('${cat.id}')">${cat.label}
    </button>`).join('');
}

function setCategory(id) {
  currentCategory = id;
  renderFilters();
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const countEl = document.getElementById('productsCount');
  if (!grid) return;

  let list = currentCategory === 'all'
    ? [...PRODUCTS]
    : PRODUCTS.filter(p => p.category === currentCategory);

  if (currentSort === 'price-asc')  list.sort((a, b) => a.price - b.price);
  if (currentSort === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (currentSort === 'name')       list.sort((a, b) => a.name.localeCompare(b.name, 'fr'));

  if (countEl) countEl.textContent = `${list.length} création${list.length > 1 ? 's' : ''}`;

  if (!list.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:80px 0;color:var(--stone)">
      <p>Aucune création dans cette catégorie pour le moment.</p></div>`;
    return;
  }

  grid.innerHTML = list.map(createProductCard).join('');
}

/* ── Page Panier ──────────────────────────────── */
function initCartPage() {
  renderCartPage();

  document.getElementById('clearCart')?.addEventListener('click', () => {
    if (Cart.items.length && confirm('Vider le panier ?')) Cart.clear();
  });

  document.getElementById('checkoutBtn')?.addEventListener('click', openOrderModal);

  const overlay = document.getElementById('orderModal');
  document.getElementById('closeModal')?.addEventListener('click', () => overlay?.classList.remove('open'));
  overlay?.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });

  document.getElementById('orderForm')?.addEventListener('submit', handleOrderSubmit);
}

function renderCartPage() {
  const container = document.getElementById('cartItems');
  if (!container) return;

  const items = Cart.items;

  if (!items.length) {
    container.innerHTML = `
      <div class="cart-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <h3>Votre panier est vide</h3>
        <p>Découvrez nos créations artisanales et ajoutez vos coups de cœur.</p>
        <a href="produits.html" class="btn btn-primary">Voir la boutique</a>
      </div>`;
  } else {
    container.innerHTML = items.map(item => `
      <div class="cart-item" data-item-id="${item.id}">
        <div class="cart-item-image">
          <div class="cart-item-image-bg" style="background: ${item.color};">${item.emoji}</div>
        </div>
        <div class="cart-item-info">
          <div class="item-category">${CATEGORIES.find(c => c.id === item.category)?.label || item.category}</div>
          <div class="item-name">${item.name}</div>
          <div class="qty-control">
            <button class="qty-btn" onclick="Cart.updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="Cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
          </div>
        </div>
        <div class="cart-item-right">
          <span class="item-price">${(item.price * item.quantity).toFixed(2).replace('.', ',')} €</span>
          <button class="item-remove" onclick="Cart.remove(${item.id})">Retirer</button>
        </div>
      </div>`).join('');
  }

  const subtotal = Cart.getTotal();
  const shipping = subtotal > 0 ? (subtotal >= 50 ? 0 : 4.90) : 0;
  const total = subtotal + shipping;
  const fmt = n => n.toFixed(2).replace('.', ',') + ' €';

  const el = id => document.getElementById(id);
  if (el('summarySubtotal')) el('summarySubtotal').textContent = fmt(subtotal);
  if (el('summaryShipping')) el('summaryShipping').textContent = shipping === 0 && subtotal > 0 ? 'Offerts ✓' : subtotal === 0 ? '—' : fmt(shipping);
  if (el('summaryTotal'))    el('summaryTotal').textContent = fmt(total);

  const btn = el('checkoutBtn');
  if (btn) btn.disabled = items.length === 0;
}

function openOrderModal() {
  if (!Cart.items.length) return;

  const summaryEl = document.getElementById('orderSummary');
  if (summaryEl) {
    const lines = Cart.items.map(i => `- ${i.name} × ${i.quantity}  (${(i.price * i.quantity).toFixed(2).replace('.', ',')} €)`);
    const total = Cart.getTotal();
    summaryEl.value = lines.join('\n') + `\n\nTotal : ${total.toFixed(2).replace('.', ',')} €`;
  }

  document.getElementById('orderModal')?.classList.add('open');
}

function handleOrderSubmit(e) {
  e.preventDefault();
  const f = e.target;
  const name    = f.querySelector('#orderName').value;
  const email   = f.querySelector('#orderEmail').value;
  const address = f.querySelector('#orderAddress').value;
  const summary = f.querySelector('#orderSummary').value;
  const message = f.querySelector('#orderMessage').value;

  // Remplacez "votre-email@exemple.com" par votre vrai email
  const to = 'votre-email@exemple.com';
  const subject = encodeURIComponent(`Commande Midori Minichua — ${name}`);
  const body = encodeURIComponent(
    `Nouvelle commande de ${name}\nEmail : ${email}\nAdresse : ${address}\n\n${summary}` +
    (message ? `\n\nMessage : ${message}` : '')
  );

  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

/* ── Newsletter ───────────────────────────────── */
function handleNewsletter(e) {
  e.preventDefault();
  e.target.querySelector('input').value = '';
  const btn = e.target.querySelector('.btn');
  const orig = btn.textContent;
  btn.textContent = '✓ Inscrit !';
  setTimeout(() => btn.textContent = orig, 3000);
}
