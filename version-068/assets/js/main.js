const menuButton = document.querySelector('[data-menu-toggle]');
const mobilePanel = document.querySelector('[data-mobile-panel]');

if (menuButton && mobilePanel) {
  menuButton.addEventListener('click', () => {
    mobilePanel.classList.toggle('is-open');
  });
}

const carousel = document.querySelector('[data-hero-carousel]');

if (carousel) {
  const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(carousel.querySelectorAll('[data-hero-dot]'));
  const prev = carousel.querySelector('[data-hero-prev]');
  const next = carousel.querySelector('[data-hero-next]');
  let current = 0;
  let timer = null;

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  };

  const start = () => {
    timer = window.setInterval(() => show(current + 1), 5200);
  };

  const restart = () => {
    if (timer) {
      window.clearInterval(timer);
    }
    start();
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      show(index);
      restart();
    });
  });

  if (prev) {
    prev.addEventListener('click', () => {
      show(current - 1);
      restart();
    });
  }

  if (next) {
    next.addEventListener('click', () => {
      show(current + 1);
      restart();
    });
  }

  start();
}

const filterInput = document.querySelector('[data-filter-input]');
const filterType = document.querySelector('[data-filter-type]');
const filterExtra = document.querySelector('[data-filter-extra]');
const filterItems = Array.from(document.querySelectorAll('.filter-item'));
const emptyState = document.querySelector('[data-empty-state]');

const normalize = (value) => (value || '').toString().trim().toLowerCase();

const urlParams = new URLSearchParams(window.location.search);
const initialQuery = urlParams.get('q');

if (filterInput && initialQuery) {
  filterInput.value = initialQuery;
}

const applyFilter = () => {
  const keyword = normalize(filterInput ? filterInput.value : '');
  const selectedType = normalize(filterType ? filterType.value : '');
  const extra = normalize(filterExtra ? filterExtra.value : '');
  let visible = 0;

  filterItems.forEach((item) => {
    const search = normalize(item.dataset.search);
    const type = normalize(item.dataset.type);
    const year = normalize(item.dataset.year);
    const region = normalize(item.dataset.region);
    const matchedKeyword = !keyword || search.includes(keyword);
    const matchedType = !selectedType || type === selectedType;
    const matchedExtra = !extra || year.includes(extra) || region.includes(extra) || search.includes(extra);
    const matched = matchedKeyword && matchedType && matchedExtra;

    item.hidden = !matched;
    if (matched) {
      visible += 1;
    }
  });

  if (emptyState) {
    emptyState.classList.toggle('is-visible', visible === 0);
  }
};

[filterInput, filterType, filterExtra].forEach((control) => {
  if (control) {
    control.addEventListener('input', applyFilter);
    control.addEventListener('change', applyFilter);
  }
});

if (filterItems.length) {
  applyFilter();
}
