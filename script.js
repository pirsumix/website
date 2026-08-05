document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".site-header");
  const mascot = document.getElementById("mascot");
  const toTopButton = document.getElementById("toTop");

  const navLinks = Array.from(
    document.querySelectorAll(
      '.desktop-nav a[href^="#"], .mobile-chips a[href^="#"]'
    )
  );

  const sections = [];

  navLinks.forEach(function (link) {
    const href = link.getAttribute("href");

    if (!href || href === "#") {
      return;
    }

    const id = href.substring(1);

    let section = document.getElementById(id);

    if (!section && id === "top") {
      section =
        document.querySelector(".hero") ||
        document.querySelector("main");
    }

    if (!section) {
      return;
    }

    const exists = sections.some(function (item) {
      return item.id === id;
    });

    if (!exists) {
      sections.push({
        id: id,
        element: section
      });
    }
  });

  let activeSection = "";
  let ticking = false;

  function getHeaderHeight() {
    if (!header) {
      return 0;
    }

    return header.getBoundingClientRect().height;
  }

  function setActiveSection(id) {
    if (!id) {
      return;
    }

    activeSection = id;

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");

      link.classList.toggle(
        "active",
        href === "#" + id
      );
    });
  }

  function detectActiveSection() {
    if (!sections.length) {
      return;
    }

    const scrollY =
      window.scrollY ||
      window.pageYOffset ||
      0;

    const detectionPoint =
      scrollY +
      getHeaderHeight() +
      Math.min(window.innerHeight * 0.3, 220);

    let currentSection = sections[0].id;

    sections.forEach(function (item) {
      const sectionTop =
        item.element.getBoundingClientRect().top +
        scrollY;

      if (sectionTop <= detectionPoint) {
        currentSection = item.id;
      }
    });

    const pageBottom =
      window.innerHeight + scrollY >=
      document.documentElement.scrollHeight - 40;

    if (pageBottom) {
      const contactExists = sections.some(function (item) {
        return item.id === "contact";
      });

      if (contactExists) {
        currentSection = "contact";
      }
    }

    setActiveSection(currentSection);
  }

  function updateMascot() {
    if (!mascot) {
      return;
    }

    const scrollY =
      window.scrollY ||
      window.pageYOffset ||
      0;

    mascot.style.transform =
      "rotate(" + scrollY * 0.2 + "deg)";

    mascot.style.opacity =
      scrollY > 100 ? "0.42" : "0.30";
  }

  function updateToTopButton() {
    if (!toTopButton) {
      return;
    }

    const scrollY =
      window.scrollY ||
      window.pageYOffset ||
      0;

    toTopButton.classList.toggle(
      "show",
      scrollY > 500
    );
  }

  function updatePageState() {
    detectActiveSection();
    updateMascot();
    updateToTopButton();
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const href = link.getAttribute("href");

      if (!href || href === "#") {
        return;
      }

      const id = href.substring(1);

      let target = document.getElementById(id);

      if (!target && id === "top") {
        target =
          document.querySelector(".hero") ||
          document.querySelector("main");
      }

      if (!target) {
        return;
      }

      event.preventDefault();

      const targetTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        getHeaderHeight() -
        8;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth"
      });

      setActiveSection(id);
    });
  });

  if (toTopButton) {
    toTopButton.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      setActiveSection("top");
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
        updatePageState();
        ticking = false;
      });
    },
    {
      passive: true
    }
  );

  window.addEventListener(
    "resize",
    updatePageState
  );

  window.addEventListener(
    "load",
    updatePageState
  );

  updatePageState();
});
