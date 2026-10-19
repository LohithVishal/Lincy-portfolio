document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".desktop-nav");
  const navLinks = [...document.querySelectorAll(".desktop-nav a")];
  const sections = [...document.querySelectorAll("main section[id], .content-section[id], .contact-section[id]")];
  const photo = document.querySelector(".profile-photo");
  const fallback = document.querySelector(".photo-fallback");
  const cursorGlow = document.querySelector(".cursor-glow");
  const year = document.querySelector("#year");

  if (year) year.textContent = new Date().getFullYear();

  // Use the initials placeholder if no profile image has been added yet.
  function showPhotoState() {
    const loaded = photo && photo.complete && photo.naturalWidth > 0;
    if (fallback) fallback.style.display = loaded ? "none" : "grid";
    if (photo) photo.style.display = loaded ? "block" : "none";
  }
  if (photo) {
    photo.addEventListener("load", showPhotoState);
    photo.addEventListener("error", showPhotoState);
    showPhotoState();
  }

  // Mobile navigation.
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      nav.classList.toggle("open", !isOpen);
    });
    navLinks.forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    }));
  }

  // Scroll-in animations; content remains visible when reduced motion is requested.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Highlight the section currently in view.
  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${id}`));
        }
      });
    }, { rootMargin: "-25% 0px -60% 0px" });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Restrained cursor glow on desktop only.
  if (cursorGlow && window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
    window.addEventListener("pointermove", event => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }
});
