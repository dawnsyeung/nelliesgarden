const products = [
  {
    id: 'starter',
    name: 'Starter Pack',
    description: '2 lb bag ideal for raised beds, herbs, and container veg.',
    price: 18,
    pounds: 2,
    tag: 'Best for beginners',
    shopifyUrl:
      'https://whiteeaglenutrition.myshopify.com/products/frass-soil-amendment-2lb-bag',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'grower',
    name: 'Heavy Feeder Blend',
    description: '20 lb sack with extra calcium for heavy-feeding crops.',
    price: 69,
    pounds: 20,
    tag: 'Market gardens',
    comingSoon: true,
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
    comingSoon: true,
    image:
      'https://images.unsplash.com/photo-1457530378978-8bac673b8062?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'bulk',
    name: 'Landscape Tote (~750 lb)',
    description: 'Approximately 750 lbs, delivered in a breathable tote with moisture monitoring.',
    price: 480,
    pounds: 750,
    weightLabel: '~750 lb tote',
    tag: 'Wholesale',
    shopifyUrl:
      'https://whiteeaglenutrition.myshopify.com/products/frass-soil-amendment-landscape-tote-750-lbs',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
  },
];

const productGrid = document.getElementById('productGrid');
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');
const yearEl = document.getElementById('year');
const tabContainers = document.querySelectorAll('[data-tabs]');
const mobileMenuBreakpoint = window.matchMedia('(max-width: 1100px)');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function formatProductWeight(product) {
  return product.weightLabel || `${product.pounds} lb bag`;
}

function productAction(product) {
  if (product.comingSoon) {
    return `<button class="btn coming-soon" type="button" disabled>Coming soon</button>`;
  }
  if (product.shopifyUrl) {
    return `<a class="btn primary" href="${product.shopifyUrl}" target="_blank" rel="noopener noreferrer">Buy on Shopify</a>`;
  }
  return '';
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
          <p class="muted">${formatProductWeight(product)}</p>
          ${productAction(product)}
        </article>
      `
    )
    .join('');
}

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!(contactForm instanceof HTMLFormElement) || !(formFeedback instanceof HTMLElement)) return;

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton?.textContent || 'Send message';
  const formData = new FormData(contactForm);
  const name = String(formData.get('name') || 'there').trim();
  const endpoint = contactForm.action;

  if (!endpoint.includes('formspree.io/f/xrejkpqr') || endpoint.endsWith('/your-form-id')) {
    formFeedback.textContent = 'Form is not configured yet. Add your real Formspree form ID in contact.html.';
    formFeedback.style.color = '#f0c850';
    return;
  }

  try {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }
    formFeedback.textContent = 'Sending your message...';
    formFeedback.style.color = '';

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Formspree submission failed with status ${response.status}`);
    }

    formFeedback.textContent = `Thanks, ${name}! We'll reach out shortly.`;
    formFeedback.style.color = '';
    contactForm.reset();
  } catch (error) {
    formFeedback.textContent = "Sorry, we couldn't send that right now. Please email hello@nelliesgarden.com.";
    formFeedback.style.color = '#f07070';
    console.error(error);
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  }
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

function initMobileNavigation() {
  const header = document.querySelector('.site-header');
  const headerInner = document.querySelector('.header-inner');
  const nav = document.querySelector('.site-nav');
  if (!(header instanceof HTMLElement) || !(nav instanceof HTMLElement)) return;
  const container = headerInner instanceof HTMLElement ? headerInner : header;
  header.classList.add('mobile-nav-ready');

  const existingToggle = container.querySelector('.menu-toggle');
  const toggle =
    existingToggle instanceof HTMLButtonElement
      ? existingToggle
      : (() => {
          const button = document.createElement('button');
          button.className = 'menu-toggle';
          button.type = 'button';
          button.setAttribute('aria-label', 'Open navigation menu');
          button.setAttribute('aria-expanded', 'false');
          button.setAttribute('aria-controls', 'primary-navigation');
          button.innerHTML = `
            <span class="menu-toggle-bars" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span class="sr-only">Menu</span>
          `;
          container.append(button);
          return button;
        })();

  if (!nav.id) {
    nav.id = 'primary-navigation';
  }
  toggle.setAttribute('aria-controls', nav.id);

  if (!nav.querySelector('.mobile-nav-shop')) {
    const shopHref = document.querySelector('.cta-chip')?.getAttribute('href') || 'shop.html';
    const shopLink = document.createElement('a');
    shopLink.className = 'mobile-nav-shop';
    shopLink.href = shopHref;
    shopLink.textContent = 'Shop Frass';
    nav.append(shopLink);
  }

  function setExpanded(isOpen) {
    header.classList.toggle('nav-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  }

  function closeMenu() {
    setExpanded(false);
  }

  toggle.addEventListener('click', () => {
    const isOpen = header.classList.contains('nav-open');
    setExpanded(!isOpen);
  });

  nav.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!target.closest('a')) return;
    if (mobileMenuBreakpoint.matches) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  function syncMenuToViewport() {
    if (!mobileMenuBreakpoint.matches) {
      closeMenu();
    }
  }

  if (mobileMenuBreakpoint.addEventListener) {
    mobileMenuBreakpoint.addEventListener('change', syncMenuToViewport);
  } else {
    mobileMenuBreakpoint.addListener(syncMenuToViewport);
  }
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
initTabs();
initMobileNavigation();
