// Neurobloom site — small enhancements only (no framework)
document.addEventListener("DOMContentLoaded", function () {
  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Gentle reveal on scroll for cards
  var cards = document.querySelectorAll(".about-card, .topic-card, .resource-card");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach(function (c) {
      c.style.opacity = "0";
      c.style.transform = "translateY(18px)";
      c.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      io.observe(c);
    });
  }
});
