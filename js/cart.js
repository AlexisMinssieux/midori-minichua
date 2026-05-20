/* ================================================
   MIDORI MINICHUA — Gestion du panier
   ================================================ */

const Cart = {
  items: [],

  init() {
    this.items = JSON.parse(localStorage.getItem('midori_cart') || '[]');
    this.updateBadge();
  },

  save() {
    localStorage.setItem('midori_cart', JSON.stringify(this.items));
  },

  add(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product || !product.inStock) return;

    const existing = this.items.find(item => item.id === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        color: product.color,
        emoji: product.emoji,
        quantity: 1
      });
    }
    this.save();
    this.updateBadge();
    this.showNotification(product.name);
  },

  remove(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.save();
    this.updateBadge();
    if (typeof renderCartPage === 'function') renderCartPage();
  },

  updateQuantity(id, quantity) {
    if (quantity <= 0) { this.remove(id); return; }
    const item = this.items.find(item => item.id === id);
    if (item) {
      item.quantity = quantity;
      this.save();
      if (typeof renderCartPage === 'function') renderCartPage();
    }
  },

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  clear() {
    this.items = [];
    this.save();
    this.updateBadge();
    if (typeof renderCartPage === 'function') renderCartPage();
  },

  updateBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = this.getCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  showNotification(productName) {
    const toast = document.getElementById('cartToast');
    if (!toast) return;
    const nameEl = toast.querySelector('.toast-product-name');
    if (nameEl) nameEl.textContent = productName;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 3500);
  }
};
