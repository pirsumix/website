document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".site-header");
  const mascot = document.getElementById("mascot");
  const toTopButton = document.getElementById("toTop");

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const navLinks = Array.from(
    document.querySelectorAll(
      '.desktop-nav a[href^="#"], .mobile-chips a[href^="#"]'
    )
  );

  const sectionItems = [];
  const seenIds = new Set();

  navLinks.forEach(function (link) {
    const href = link.getAttribute("href");

    if (!href || href === "#") return;

    const id = href.slice(1);
    let target;

    if (id === "top") {
      target = document.querySelector(".hero");
    } else {
      target = document.getElementById(id);
    }

    if (!target || seenIds.has(id)) return;

    seenIds.add(id);

    sectionItems.push({
      id: id,
      element: target
    });
  });

  let isMenuScrolling = false;
  let scrollLockTimer = null;
  let ticking = false;

  function getScrollTop() {
    return (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0
    );
  }

  function getHeaderHeight() {
    return header
      ? Math.ceil(header.getBoundingClientRect().height)
      : 0;
  }

  function updateHeaderSpace() {
    if (!header) return;

    const wasCollapsed =
      document.body.classList.contains(
        "mobile-header-collapsed"
      );

    if (window.innerWidth <= 980) {
      document.body.classList.remove(
        "mobile-header-collapsed"
      );
    }

    const fullHeaderHeight =
      Math.ceil(header.getBoundingClientRect().height);

    document.documentElement.style.setProperty(
      "--header-space",
      fullHeaderHeight + "px"
    );

    if (wasCollapsed && window.innerWidth <= 980) {
      document.body.classList.add(
        "mobile-header-collapsed"
      );
    }
  }

  function activateMenuItem(id) {
    if (!id) return;

    navLinks.forEach(function (link) {
      const isActive =
        link.getAttribute("href") === "#" + id;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function findCurrentSection() {
    if (!sectionItems.length || isMenuScrolling) return;

    const scrollTop = getScrollTop();

    const marker =
      getHeaderHeight() +
      Math.min(window.innerHeight * 0.22, 170);

    let currentId = "top";

    sectionItems.forEach(function (item) {
      if (item.id === "top") return;

      const sectionTop =
        item.element.getBoundingClientRect().top +
        scrollTop;

      if (sectionTop <= scrollTop + marker) {
        currentId = item.id;
      }
    });

    if (scrollTop < 80) {
      currentId = "top";
    }

    const atBottom =
      window.innerHeight + scrollTop >=
      document.documentElement.scrollHeight - 60;

    if (atBottom) {
      currentId = "contact";
    }

    activateMenuItem(currentId);
  }

  function releaseMenuScrollLock(id) {
    if (scrollLockTimer) {
      clearTimeout(scrollLockTimer);
    }

    scrollLockTimer = setTimeout(function () {
      isMenuScrolling = false;
      activateMenuItem(id);
      findCurrentSection();
    }, 850);
  }

  function scrollToTarget(id) {
    const item = sectionItems.find(function (section) {
      return section.id === id;
    });

    if (!item) return;

    const targetTop =
      item.element.getBoundingClientRect().top +
      getScrollTop() -
      getHeaderHeight() -
      8;

    isMenuScrolling = true;
    activateMenuItem(id);

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth"
    });

    releaseMenuScrollLock(id);
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

    const isMobile = window.innerWidth <= 980;

    if (isMobile) {
      mascot.style.display = "none";
      mascot.style.transform = "";
      return;
    }

    mascot.style.display = "block";

    const scrollTop = getScrollTop();

    mascot.style.transform =
      "rotate(" + scrollTop * 0.22 + "deg)";

    mascot.style.opacity =
      scrollTop > 100 ? "0.42" : "0.30";
  }

  function updateToTopButton() {
    if (!toTopButton) return;

    toTopButton.classList.toggle(
      "show",
      getScrollTop() > 500
    );
  }

  function updateEverything() {
    const scrollTop = getScrollTop();
    const isMobile = window.innerWidth <= 980;

    document.body.classList.toggle(
      "mobile-header-collapsed",
      isMobile && scrollTop > 60
    );

    findCurrentSection();
    updateMascot();
    updateToTopButton();
  }

  if (toTopButton) {
    toTopButton.addEventListener("click", function () {
      isMenuScrolling = true;
      activateMenuItem("top");

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      releaseMenuScrollLock("top");
    });
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
    updateHeaderSpace();
    updateEverything();
  });

  window.addEventListener("load", function () {
    updateHeaderSpace();
    updateEverything();
  });

  window.addEventListener("pageshow", function () {
    setTimeout(function () {
      window.scrollTo(0, 0);
      updateEverything();
    }, 0);
  });

  updateHeaderSpace();
  updateEverything();

  setTimeout(function () {
    window.scrollTo(0, 0);
  }, 0);
});
