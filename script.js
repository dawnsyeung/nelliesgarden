const products = [
  {
    id: 'starter',
    name: 'Kitchen Garden Starter',
    description: '5 lb bag ideal for raised beds, herbs, and container veg.',
    price: 24,
    pounds: 5,
    tag: 'Best for beginners',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'grower',
    name: 'Market Grower Blend',
    description: '20 lb sack with extra calcium for heavy-feeding crops.',
    price: 69,
    pounds: 20,
    tag: 'Market gardens',
    image:
      'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'compost',
    name: 'Compost Catalyst',
    description: '10 lb frass + biochar blend to accelerate thermal compost.',
    price: 52,
    pounds: 10,
    tag: 'Soil biology',
    image:
      'https://images.unsplash.com/photo-1457530378978-8bac673b8062?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'bulk',
    name: 'Landscape Tote (1000 lb)',
    description: 'Delivered in a breathable tote with moisture monitoring.',
    price: 480,
    pounds: 1000,
    tag: 'Wholesale',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
  },
];

const cartState = [];

const productGrid = document.getElementById('productGrid');
const cartList = document.getElementById('cartList');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartPounds = document.getElementById('cartPounds');
const checkoutBtn = document.getElementById('checkoutBtn');
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');
const yearEl = document.getElementById('year');
const tabContainers = document.querySelectorAll('[data-tabs]');

yearEl.textContent = new Date().getFullYear();

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function renderProducts() {
  if (!productGrid) return;
  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <span class="tag">${product.tag}</span>
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p class="price">${formatCurrency(product.price)}</p>
          <p class="muted">${product.pounds} lb bag</p>
          <button class="btn primary" data-product="${product.id}">
            Add to cart
          </button>
        </article>
      `
    )
    .join('');

  productGrid.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-product]');
    if (!button) return;
    addToCart(button.dataset.product);
  });
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  const existing = cartState.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartState.push({ ...product, quantity: 1 });
  }
  renderCart();
}

function removeFromCart(productId) {
  const index = cartState.findIndex((item) => item.id === productId);
  if (index >= 0) {
    cartState.splice(index, 1);
    renderCart();
  }
}

function updateQuantity(productId, delta) {
  const item = cartState.find((p) => p.id === productId);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  renderCart();
}

function renderCart() {
  if (!cartList) return;
  if (!cartState.length) {
    cartList.innerHTML = '<li class="muted">Cart is empty. Add your first bag!</li>';
    cartSubtotal.textContent = '$0.00';
    cartPounds.textContent = '0 lb';
    checkoutBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;

  cartList.innerHTML = cartState
    .map(
      (item) => `
        <li class="cart-item">
          <div>
            <strong>${item.name}</strong>
            <p>${item.pounds} lb bag</p>
            <div class="quantity-controls">
              <button type="button" data-action="decrease" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button type="button" data-action="increase" data-id="${item.id}">+</button>
            </div>
          </div>
          <div>
            <p>${formatCurrency(item.price * item.quantity)}</p>
            <button type="button" class="remove" data-action="remove" data-id="${item.id}">Remove</button>
          </div>
        </li>
      `
    )
    .join('');

  const subtotal = cartState.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const pounds = cartState.reduce((sum, item) => sum + item.pounds * item.quantity, 0);
  cartSubtotal.textContent = formatCurrency(subtotal);
  cartPounds.textContent = `${pounds} lb`;
}

cartList?.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const id = target.dataset.id;
  const action = target.dataset.action;
  if (!id || !action) return;
  if (action === 'remove') removeFromCart(id);
  if (action === 'increase') updateQuantity(id, 1);
  if (action === 'decrease') updateQuantity(id, -1);
});

checkoutBtn?.addEventListener('click', () => {
  const totalItems = cartState.reduce((sum, item) => sum + item.quantity, 0);
  alert(`We'll send a secure invoice for ${totalItems} item(s).`);
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get('name');
  formFeedback.textContent = `Thanks, ${name}! We'll reach out shortly.`;
  contactForm.reset();
});

function initTabs() {
  if (!tabContainers.length) return;
  tabContainers.forEach((container) => {
    const tabs = Array.from(container.querySelectorAll('[data-tab]'));
    const panels = Array.from(container.querySelectorAll('[data-panel]'));
    if (!tabs.length || !panels.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach((btn) => {
          const isActive = btn === tab;
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-selected', String(isActive));
          btn.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        panels.forEach((panel) => {
          const matches = panel.dataset.panel === target;
          panel.classList.toggle('active', matches);
          panel.hidden = !matches;
        });
      });
    });
  });
}

const frassStudyButtons = document.querySelectorAll('[data-protected-link]');
const frassAccessKey = 'frassStudyAccess';
const frassPassword = 'Frass';

function requestFrassAccess() {
  const entry = window.prompt('Enter the Frass Study password to continue.');
  if (entry === null) return false;
  if (entry.trim() === frassPassword) {
    sessionStorage.setItem(frassAccessKey, 'true');
    return true;
  }
  alert('Incorrect password. Please try again.');
  return false;
}

frassStudyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.protectedLink;
    if (!target) return;
    if (sessionStorage.getItem(frassAccessKey) === 'true' || requestFrassAccess()) {
      window.location.href = target;
    }
  });
});

renderProducts();
renderCart();
initTabs();
