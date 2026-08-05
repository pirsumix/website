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

function findCurrentSection() {
  if (!sectionItems.length) return;

  const headerBottom = getHeaderHeight();
  const triggerPoint = headerBottom + 35;

  let currentId = "top";

  const pageSections = sectionItems.filter(function (item) {
    return item.id !== "top";
  });

  pageSections.forEach(function (item) {
    const rect = item.element.getBoundingClientRect();

    if (
      rect.top <= triggerPoint &&
      rect.bottom > triggerPoint
    ) {
      currentId = item.id;
    }
  });

  if (
    window.pageYOffset < 120
  ) {
    currentId = "top";
  }

  const atBottom =
    window.innerHeight + window.pageYOffset >=
    document.documentElement.scrollHeight - 50;

  if (atBottom) {
    currentId = "contact";
  }

  activateMenuItem(currentId);
}

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
