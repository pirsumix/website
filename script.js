document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".site-header");

  const desktopLinks = Array.from(
    document.querySelectorAll('.desktop-nav a[href^="#"]')
  );

  const mobileLinks = Array.from(
    document.querySelectorAll('.mobile-chips a[href^="#"]')
  );

  const allNavLinks = [...desktopLinks, ...mobileLinks];

  const mascot = document.getElementById("mascot");
  const toTopButton = document.getElementById("toTop");

  let currentActiveSection = "";
  let scrollTicking = false;

  const sectionTargets = [];

  allNavLinks.forEach(function (link) {
    const href = link.getAttribute("href");

    if (!href || href === "#") {
      return;
    }

    const sectionId = href.substring(1);
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    const alreadyExists = sectionTargets.some(function (item) {
      return item.id === sectionId;
    });

    if (!alreadyExists) {
      sectionTargets.push({
        id: sectionId,
        element: section
      });
    }
  });

  function setActiveNavigation(sectionId) {
    if (!sectionId || currentActiveSection === sectionId) {
      return;
    }

    currentActiveSection = sectionId;

    allNavLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      const linkSectionId = href ? href.substring(1) : "";

      link.classList.toggle("active", linkSectionId === sectionId);
    });

    const activeMobileLink = mobileLinks.find(function (link) {
      return link.getAttribute("href") === "#" + sectionId;
    });

    if (activeMobileLink) {
      activeMobileLink.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
  }

  function detectActiveSection() {
    if (sectionTargets.length === 0) {
      return;
    }

    const headerHeight = header ? header.offsetHeight : 0;
    const scrollPosition = window.scrollY || window.pageYOffset;

    const detectionPoint =
      scrollPosition +
      headerHeight +
      Math.min(window.innerHeight * 0.28, 220);

    let activeSectionId = sectionTargets[0].id;

    sectionTargets.forEach(function (item) {
      if (item.element.offsetTop <= detectionPoint) {
        activeSectionId = item.id;
      }
    });

    const reachedBottom =
      window.innerHeight + scrollPosition >=
      document.documentElement.scrollHeight - 40;

    if (reachedBottom) {
      const contactSection = sectionTargets.find(function (item) {
        return item.id === "contact";
      });

      if (contactSection) {
        activeSectionId = "contact";
      }
    }

    setActiveNavigation(activeSectionId);
  }

  function rotateMascot() {
    if (!mascot) {
      return;
    }

    const scrollPosition = window.scrollY || window.pageYOffset;
    const rotation = scrollPosition * 0.2;

    mascot.style.transform = "rotate(" + rotation + "deg)";
    mascot.style.opacity = scrollPosition > 100 ? "0.42" : "0.30";
  }

  function updateToTopButton() {
    if (!toTopButton) {
      return;
    }

    const scrollPosition = window.scrollY || window.pageYOffset;

    if (scrollPosition > 500) {
      toTopButton.classList.add("show");
    } else {
      toTopButton.classList.remove("show");
    }
  }

  function updateScrollEffects() {
    detectActiveSection();
    rotateMascot();
    updateToTopButton();
  }

  window.addEventListener(
    "scroll",
    function () {
      if (scrollTicking) {
        return;
      }

      scrollTicking = true;

      window.requestAnimationFrame(function () {
        updateScrollEffects();
        scrollTicking = false;
      });
    },
    { passive: true }
  );

  allNavLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const href = link.getAttribute("href");

      if (!href || href === "#") {
        return;
      }

      const sectionId = href.substring(1);
      const section = document.getElementById(sectionId);

      if (!section) {
        return;
      }

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;

      const sectionPosition =
        section.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        12;

      window.scrollTo({
        top: sectionPosition,
        behavior: "smooth"
      });

      setActiveNavigation(sectionId);
    });
  });

  if (toTopButton) {
    toTopButton.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      setActiveNavigation("top");
    });
  }

  window.addEventListener("resize", updateScrollEffects);
  window.addEventListener("load", updateScrollEffects);

  updateScrollEffects();
});
