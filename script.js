// Google Analytics 4 + carregamento do script principal da Zoqvera.
(() => {
  const GA_MEASUREMENT_ID = 'G-FGZGQTZDML';
  const currentScript = document.currentScript;

  if (!window.__zoqveraGa4Loaded) {
    window.__zoqveraGa4Loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);

    const googleTag = document.createElement('script');
    googleTag.async = true;
    googleTag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    document.head.appendChild(googleTag);
  }

  const coreScript = document.createElement('script');
  const scriptUrl = currentScript?.src || new URL('/script.js', window.location.origin).href;
  coreScript.src = new URL('script-core.js', scriptUrl).href;
  coreScript.async = false;

  if (currentScript?.parentNode) {
    currentScript.parentNode.insertBefore(coreScript, currentScript.nextSibling);
  } else {
    document.body.appendChild(coreScript);
  }
})();
