document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".site-header");
  const mascot = document.getElementById("mascot");
  const toTop = document.getElementById("toTop");

  const navLinks = Array.from(
    document.querySelectorAll(
      '.desktop-nav a[href^="#"], .mobile-chips a[href^="#"]'
    )
  );

  const sectionMap = new Map();

  navLinks.forEach(function (link) {
    const href = link.getAttribute("href");

    if (!href || href === "#") {
      return;
    }

    const key = href.slice(1);
    let target = document.getElementById(key);

    if (!target && key === "top") {
      target =
        document.querySelector(".hero") ||
        document.querySelector("main");
    }

    if (target) {
      sectionMap.set(key, target);
    }
  });

  const sections = Array.from(sectionMap.entries()).map(function (entry) {
    return {
      key: entry[0],
      element: entry[1]
    };
  });

  let activeKey = "";
  let ticking = false;

  function setActiveNavigation(key) {
    if (!key || key === activeKey) {
      return;
    }

    activeKey = key;

    navLinks.forEach(function (link) {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + key
      );
    });
  }

  function getHeaderHeight() {
    return header
      ? header.getBoundingClientRect().height
      : 0;
  }

  function detectCurrentSection() {
    if (!sections.length) {
      return;
    }

    const scrollY =
      window.scrollY ||
      window.pageYOffset;

    const probe =
      scrollY +
      getHeaderHeight() +
      Math.min(window.innerHeight * 0.3, 240);

    let current = sections[0].key;

    sections.forEach(function (section) {
      const top =
        section.element.getBoundingClientRect().top +
        scrollY;

      if (top <= probe) {
        current = section.key;
      }
    });

    const nearBottom =
      window.innerHeight + scrollY >=
      document.documentElement.scrollHeight - 50;

    if (nearBottom && sectionMap.has("contact")) {
      current = "contact";
    }

    setActiveNavigation(current);
  }

  function updateMascot() {
    if (!mascot) {
      return;
    }

    const scrollY =
      window.scrollY ||
      window.pageYOffset;

    mascot.style.transform =
      "rotate(" + scrollY * 0.2 + "deg)";

    mascot.style.opacity =
      scrollY > 100 ? "0.42" : "0.30";
  }

  function updateToTop() {
    if (!toTop) {
      return;
    }

    toTop.classList.toggle(
      "show",
      (window.scrollY || window.pageYOffset) > 500
    );
  }

  function updateScrollState() {
    detectCurrentSection();
    updateMascot();
    updateToTop();
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const href = link.getAttribute("href");

      if (!href || href === "#") {
        return;
      }

      const key = href.slice(1);
      const target = sectionMap.get(key);

      if (!target) {
        return;
      }

      event.preventDefault();

      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        getHeaderHeight() -
        8;

      window.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth"
      });

      setActiveNavigation(key);
    });
  });

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      setActiveNavigation("top");
    });
  }

  window.addEventListener(
    "scroll",
    function () {
      if (ticking) {
        return;
      }

      ticking = true;

      window.requestAnimationFrame(function () {
        updateScrollState();
        ticking = false;
      });
    },
    { passive: true }
  );

  window.addEventListener(
    "resize",
    updateScrollState
  );

  window.addEventListener(
    "load",
    updateScrollState
  );

  updateScrollState();
});
