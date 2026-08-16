// ═══════════════════════════════════════
//   MAIN.JS
// ═══════════════════════════════════════

 // ─── BURGER MENU ───────────────────
document.addEventListener("DOMContentLoaded", function () {
  const burger = document.getElementById("header-burger");
  const menu   = document.getElementById("header-menu-movil");
  if (!burger || !menu) return;

  burger.addEventListener("click", function () {
    burger.classList.toggle("open");
    menu.classList.toggle("open");
  });

  // Cierra al dar clic en un link
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      burger.classList.remove("open");
      menu.classList.remove("open");
    });
  });
});
