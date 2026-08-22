(() => {
  const MOBILE_NAV_QUERY = '(max-width: 1020px)';
  const mobileNav = window.matchMedia(MOBILE_NAV_QUERY);

  const getElements = () => ({
    nav: document.querySelector('.main-nav'),
    toggle: document.querySelector('.menu-toggle'),
    servicesMenu: document.querySelector('.ux-services-menu'),
    servicesTrigger: document.querySelector('.ux-services-trigger')
  });

  const closeNavigation = ({ restoreFocus = false } = {}) => {
    const { nav, toggle, servicesMenu, servicesTrigger } = getElements();

    nav?.classList.remove('open');
    servicesMenu?.classList.remove('is-open');
    document.body.classList.remove('menu-open');

    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Abrir menu');
    servicesTrigger?.setAttribute('aria-expanded', 'false');

    if (restoreFocus && mobileNav.matches) toggle?.focus();
  };

  const configureToggle = () => {
    const { nav, toggle } = getElements();
    if (!toggle || !nav) return;

    if (!nav.id) nav.id = 'navegacao-principal';
    toggle.setAttribute('aria-controls', nav.id);
  };

  const handleBreakpointChange = (event) => {
    if (!event.matches) closeNavigation();
  };

  const handleKeydown = (event) => {
    if (event.key !== 'Escape') return;

    const { nav, servicesMenu } = getElements();
    const menuIsOpen = nav?.classList.contains('open') || servicesMenu?.classList.contains('is-open');
    if (menuIsOpen) closeNavigation({ restoreFocus: true });
  };

  const init = () => {
    configureToggle();
    closeNavigation();

    if (typeof mobileNav.addEventListener === 'function') {
      mobileNav.addEventListener('change', handleBreakpointChange);
    } else {
      mobileNav.addListener(handleBreakpointChange);
    }

    document.addEventListener('keydown', handleKeydown);
    window.addEventListener('pageshow', () => closeNavigation());
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
