document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".site-header");
  const mascot = document.getElementById("mascot");
  const toTopButton = document.getElementById("toTop");

  const navLinks = Array.from(
    document.querySelectorAll(
      '.desktop-nav a[href^="#"], .mobile-chips a[href^="#"]'
    )
  );

  const sectionItems = [];

  navLinks.forEach(function (link) {
    const href = link.getAttribute("href");

    if (!href || href === "#") return;

    const id = href.slice(1);
    let target = document.getElementById(id);

    if (!target && id === "top") {
      target =
        document.querySelector(".hero") ||
        document.querySelector("main");
    }

    if (!target) return;

    const alreadyAdded = sectionItems.some(function (item) {
      return item.id === id;
    });

    if (!alreadyAdded) {
      sectionItems.push({
        id: id,
        element: target
      });
    }
  });

  function getHeaderHeight() {
    return header
      ? Math.ceil(header.getBoundingClientRect().height)
      : 0;
  }

  function activateMenuItem(id) {
    if (!id) return;

    navLinks.forEach(function (link) {
      const isActive =
        link.getAttribute("href") === "#" + id;

      link.classList.toggle("active", isActive);
      link.setAttribute(
        "aria-current",
        isActive ? "true" : "false"
      );
    });
  }

  function scrollToTarget(id) {
    if (!sectionItems.length) return;

    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0;

    const marker =
      scrollTop +
      getHeaderHeight() +
      Math.min(window.innerHeight * 0.33, 250);

    let currentId = sectionItems[0].id;

    sectionItems.forEach(function (item) {
      const sectionTop =
        item.element.getBoundingClientRect().top +
        scrollTop;

      if (sectionTop <= marker) {
        currentId = item.id;
      }
    });

    const atBottom =
      window.innerHeight + scrollTop >=
      document.documentElement.scrollHeight - 60;

    if (atBottom) {
      const contact = sectionItems.find(function (item) {
        return item.id === "contact";
      });

      if (contact) currentId = "contact";
    }

    activateMenuItem(currentId);
  }

  function scrollToTarget(id) {
    const item = sectionItems.find(function (section) {
      return section.id === id;
    });

    if (!item) return;

    const top =
      item.element.getBoundingClientRect().top +
      window.pageYOffset -
      getHeaderHeight() -
      8;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: "smooth"
    });

    activateMenuItem(id);
  }

  document.addEventListener("click", function (event) {
    const link = event.target.closest(
      '.desktop-nav a[href^="#"], .mobile-chips a[href^="#"]'
    );

    if (!link) return;

    const href = link.getAttribute("href");

    if (!href || href === "#") return;

    const id = href.slice(1);

    if (!sectionItems.some(function (item) {
      return item.id === id;
    })) {
      return;
    }

    event.preventDefault();
    scrollToTarget(id);
  });

  function updateMascot() {
    if (!mascot) return;

    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0;

    mascot.style.transform =
      "rotate(" + scrollTop * 0.2 + "deg)";

    mascot.style.opacity =
      scrollTop > 100 ? "0.42" : "0.30";
  }

  function updateToTopButton() {
    if (!toTopButton) return;

    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0;

    toTopButton.classList.toggle(
      "show",
      scrollTop > 500
    );
  }

  if (toTopButton) {
    toTopButton.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      activateMenuItem("top");
    });
  }

  let ticking = false;

  function updateEverything() {
    findCurrentSection();
    updateMascot();
    updateToTopButton();
  }

  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;

      ticking = true;

      window.requestAnimationFrame(function () {
        updateEverything();
        ticking = false;
      });
    },
    { passive: true }
  );

  window.addEventListener("resize", updateEverything);
  window.addEventListener("load", updateEverything);

  updateEverything();
});
