(() => {

  const header = document.querySelector('.site-header');

  const navLinks = [
    ...document.querySelectorAll('.desktop-nav a[href^="#"], .mobile-chips a[href^="#"]')
  ];

  const sections = [
    ...document.querySelectorAll('.nav-section[id], .nav-section[data-nav]')
  ];

  const mascot = document.getElementById('mascot');
  const toTop = document.getElementById('toTop');

  function getSectionKey(section) {
    return section.dataset.nav || section.id;
  }

  function setActiveNav(key) {

    navLinks.forEach(link => {

      const target = link.getAttribute('href').replace('#', '');

      if (target === key) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }

    });

    const activeMobile = document.querySelector(
      `.mobile-chips a[href="#${CSS.escape(key)}"]`
    );

    if (activeMobile) {
      activeMobile.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }

  }

  function updateScrollEffects() {

    const scrollY =
      window.pageYOffset ||
      document.documentElement.scrollTop;

    const headerHeight = header ? header.offsetHeight : 0;

    const probe =
      scrollY +
      headerHeight +
      Math.min(window.innerHeight * 0.28, 220);

    let current = "top";

    sections.forEach(section => {

      if (section.offsetTop <= probe) {
        current = getSectionKey(section);
      }

    });

    setActiveNav(current);

    if (mascot) {

      mascot.style.transform =
        `rotate(${scrollY * 0.16}deg)`;

      mascot.style.opacity =
        scrollY > 120 ? ".34" : ".25";

    }

    if (toTop) {

      if (scrollY > 500) {
        toTop.classList.add("show");
      } else {
        toTop.classList.remove("show");
      }

    }

  }

  navLinks.forEach(link => {

    link.addEventListener("click", () => {

      const key =
        link.getAttribute("href").replace("#", "");

      setActiveNav(key);

    });

  });

  if (toTop) {

    toTop.addEventListener("click", () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

  }

  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {

      if (!ticking) {

        window.requestAnimationFrame(() => {

          updateScrollEffects();

          ticking = false;

        });

        ticking = true;

      }

    },
    { passive: true }
  );

  window.addEventListener("resize", updateScrollEffects);

  window.addEventListener("load", updateScrollEffects);

  updateScrollEffects();

})();
