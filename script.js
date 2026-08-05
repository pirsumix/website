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

  let isMenuScrolling = false;
  let scrollLockTimer = null;
  let ticking = false;

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

    if (isMenuScrolling) return;

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

    if (window.pageYOffset < 120) {
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

    isMenuScrolling = true;

    activateMenuItem(id);

    window.scrollTo({
      top: Math.max(0, top),
      behavior: "smooth"
    });

    if (scrollLockTimer) {
      clearTimeout(scrollLockTimer);
    }

    scrollLockTimer = setTimeout(function () {
      isMenuScrolling = false;
      findCurrentSection();
    }, 900);
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const id = href.slice(1);

      const exists = sectionItems.some(function (item) {
        return item.id === id;
      });

      if (!exists) return;

      event.preventDefault();

      scrollToTarget(id);
    });
  });

  function updateMascot() {
    if (!mascot) return;

    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0;

    mascot.style.transform =
      "rotate(" + scrollTop * 0.22 + "deg)";

    mascot.style.opacity =
      window.innerWidth <= 650
        ? "0.24"
        : scrollTop > 100
          ? "0.42"
          : "0.30";
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
      isMenuScrolling = true;

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      activateMenuItem("top");

      if (scrollLockTimer) {
        clearTimeout(scrollLockTimer);
      }

      scrollLockTimer = setTimeout(function () {
        isMenuScrolling = false;
        findCurrentSection();
      }, 900);
    });
  }
function updateEverything() {
  const scrollTop =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    0;

  document.body.classList.toggle(
    "mobile-header-collapsed",
    window.innerWidth <= 980 && scrollTop > 60
  );

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

window.addEventListener("resize", function () {
  updateEverything();
});

window.addEventListener("load", function () {
  updateEverything();
});

updateEverything();
});
