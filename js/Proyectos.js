// ═══════════════════════════════════════
//   PROYECTOS.JS — Solo lógica
//   Los datos van en ProyectosData.js
// ═══════════════════════════════════════

(function () {

  if (typeof proyectos === "undefined" || !Array.isArray(proyectos)) {
    console.error("Proyectos.js: no se encontró el array 'proyectos'. ¿Cargaste ProyectosData.js antes?");
    return;
  }

  let filtroActual = "";

  // ─── RENDER GRID ───────────────────
  function renderGrid() {
    const grid = document.getElementById("proyectos-grid");
    if (!grid) return;

    const busquedaEl = document.getElementById("proyectos-busqueda");
    const busqueda   = busquedaEl ? busquedaEl.value.toLowerCase() : "";

    const filtrados = proyectos.filter(function(p) {
      const coincideBusqueda = p.nombre.toLowerCase().indexOf(busqueda) !== -1 ||
                               p.descripcion.toLowerCase().indexOf(busqueda) !== -1;
      const coincideCategoria = filtroActual === "" || p.categorias.indexOf(filtroActual) !== -1;
      return coincideBusqueda && coincideCategoria;
    });

    if (filtrados.length === 0) {
      grid.innerHTML = '<p class="chakra-petch-regular proyectos-vacio">No se encontraron proyectos.</p>';
      return;
    }

    grid.innerHTML = filtrados.map(function(p) {
      const imgHtml = p.imagen
        ? '<img src="' + p.imagen + '" alt="' + p.nombre + '">'
        : '<div class="proyecto-sin-imagen chakra-petch-regular">Sin imagen</div>';

      const etiquetas = p.categorias.map(function(cat) {
        return '<span class="proyecto-tag proyecto-tag-' + cat.toLowerCase() + ' chakra-petch-regular">' + cat + '</span>';
      }).join("");

      return (
        '<div class="proyecto-card">' +
          '<div class="proyecto-card-img">' + imgHtml + '</div>' +
          '<div class="proyecto-card-body">' +
            '<h3 class="chakra-petch-bold proyecto-nombre">' + p.nombre + '</h3>' +
            '<p class="chakra-petch-regular proyecto-desc">' + p.descripcion + '</p>' +
            '<div class="proyecto-tags">' + etiquetas + '</div>' +
            '<a href="' + p.pagina + '" class="chakra-petch-semibold proyecto-btn">Ver proyecto →</a>' +
          '</div>' +
        '</div>'
      );
    }).join("");
  }

  // ─── INIT ──────────────────────────
  document.addEventListener("DOMContentLoaded", function() {
    renderGrid();

    const busqueda = document.getElementById("proyectos-busqueda");
    if (busqueda) busqueda.addEventListener("input", renderGrid);

    document.querySelectorAll(".proyecto-filtro").forEach(function(btn) {
      btn.addEventListener("click", function() {
        document.querySelectorAll(".proyecto-filtro").forEach(function(b) {
          b.classList.remove("activo");
        });
        btn.classList.add("activo");
        filtroActual = btn.dataset.cat;
        renderGrid();
      });
    });
  });

})();
