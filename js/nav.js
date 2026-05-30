(function () {
  var hamburger = document.getElementById('navHamburger');
  var navMobile = document.getElementById('navMobile');
  var closeBtn  = document.getElementById('navMobileClose');

  function openMenu() {
    navMobile.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    navMobile.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeBtn)  closeBtn.addEventListener('click', closeMenu);
  if (navMobile) {
    navMobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    // Marquer le lien actif selon l'URL courante
    var path = window.location.pathname.split('/').pop() || 'index.html';
    navMobile.querySelectorAll('a').forEach(function (a) {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });
  }
})();
