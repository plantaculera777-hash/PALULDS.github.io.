// ═══════════════════════════════════════
//   GALERIA.JS — Solo lógica
// ═══════════════════════════════════════
 
(function () {
 
  // Verifica que GaleriaData.js cargó
  if (typeof imagenes === "undefined" || !Array.isArray(imagenes)) {
    console.error("Galeria.js: no se encontró el array 'imagenes'. ¿Cargaste GaleriaData.js antes?");
    return;
  }
 
  // ─── CATEGORÍA ─────────────────────
  function getCategoria(nombre) {
    if (nombre.startsWith("Fondo")) return "Fondo";
    if (nombre.startsWith("Foto"))  return "Foto";
    return "Otro";
  }
 
  // ─── CARRUSEL ──────────────────────
  const fondos = imagenes.filter(function(img) { return img.startsWith("Fondo"); });
  let carruselIndex = 0;
  let carruselInterval = null;
 
  function renderSlide() {
    const carrusel = document.getElementById("carrusel");
    if (!carrusel || fondos.length === 0) return;
 
    carrusel.innerHTML =
      '<div class="carrusel-slide">' +
        '<img src="res/' + fondos[carruselIndex] + '" alt="' + fondos[carruselIndex] + '">' +
        '<div class="carrusel-label chakra-petch-regular">' + fondos[carruselIndex] + '</div>' +
        '<button class="carrusel-btn izq chakra-petch-bold" onclick="window._galeria.moverCarrusel(-1)">&#8592;</button>' +
        '<button class="carrusel-btn der chakra-petch-bold" onclick="window._galeria.moverCarrusel(1)">&#8594;</button>' +
        '<div class="carrusel-dots">' +
          fondos.map(function(_, i) {
            return '<span class="dot ' + (i === carruselIndex ? 'activo' : '') + '" onclick="window._galeria.irASlide(' + i + ')"></span>';
          }).join("") +
        '</div>' +
      '</div>';
  }
 
  function moverCarrusel(dir) {
    carruselIndex = (carruselIndex + dir + fondos.length) % fondos.length;
    renderSlide();
  }
 
  function irASlide(i) {
    carruselIndex = i;
    renderSlide();
  }
 
  function initCarrusel() {
    renderSlide();
    if (carruselInterval) clearInterval(carruselInterval);
    if (fondos.length > 1) {
      carruselInterval = setInterval(function() {
        carruselIndex = (carruselIndex + 1) % fondos.length;
        renderSlide();
      }, 4000);
    }
  }
 
  // ─── GRID ──────────────────────────
  let filtroActual = "";
 
  function renderGrid() {
    const grid = document.getElementById("galeria-grid");
    if (!grid) return;
 
    const busquedaEl = document.getElementById("galeria-busqueda");
    const busqueda = busquedaEl ? busquedaEl.value.toLowerCase() : "";
 
    const filtradas = imagenes.filter(function(img) {
      const coincideBusqueda = img.toLowerCase().indexOf(busqueda) !== -1;
      const coincideCategoria = filtroActual === "" || getCategoria(img) === filtroActual;
      return coincideBusqueda && coincideCategoria;
    });
 
    if (filtradas.length === 0) {
      grid.innerHTML = '<p class="chakra-petch-regular galeria-vacia">No se encontraron imágenes.</p>';
      return;
    }
 
    grid.innerHTML = filtradas.map(function(img) {
      return (
        '<div class="galeria-card" onclick="window._galeria.abrirModal(\'' + img + '\')">' +
          '<img src="res/' + img + '" alt="' + img + '">' +
          '<div class="galeria-card-info">' +
            '<span class="chakra-petch-regular galeria-nombre">' + img + '</span>' +
            '<span class="chakra-petch-regular galeria-cat galeria-cat-' + getCategoria(img).toLowerCase() + '">' + getCategoria(img) + '</span>' +
          '</div>' +
        '</div>'
      );
    }).join("");
  }
 
  // ─── MODAL ─────────────────────────
  function abrirModal(img) {
    const modal         = document.getElementById("galeria-modal");
    const modalImg      = document.getElementById("modal-img");
    const modalNombre   = document.getElementById("modal-nombre");
    const modalCat      = document.getElementById("modal-cat");
    const modalDescarga = document.getElementById("modal-descarga");
 
    if (!modal || !modalImg) return;
 
    modalImg.src             = "res/" + img;
    modalImg.alt             = img;
    modalNombre.textContent  = img;
    modalCat.textContent     = getCategoria(img);
    modalCat.className       = "chakra-petch-regular modal-cat modal-cat-" + getCategoria(img).toLowerCase();
    modalDescarga.href       = "res/" + img;
    modalDescarga.download   = img;
 
    modal.classList.add("activo");
    document.body.style.overflow = "hidden";
  }
 
  function cerrarModal() {
    const modal = document.getElementById("galeria-modal");
    if (modal) modal.classList.remove("activo");
    document.body.style.overflow = "";
  }
 
  // ─── EXPONER FUNCIONES ─────────────
  window._galeria = {
    moverCarrusel: moverCarrusel,
    irASlide: irASlide,
    abrirModal: abrirModal,
    cerrarModal: cerrarModal
  };
 
  // Para el botón cerrar en el HTML
  window.cerrarModal = cerrarModal;
 
  // ─── INIT ──────────────────────────
  document.addEventListener("DOMContentLoaded", function() {
    initCarrusel();
    renderGrid();
 
    const busqueda = document.getElementById("galeria-busqueda");
    if (busqueda) busqueda.addEventListener("input", renderGrid);
 
    document.querySelectorAll(".galeria-filtro").forEach(function(btn) {
      btn.addEventListener("click", function() {
        document.querySelectorAll(".galeria-filtro").forEach(function(b) {
          b.classList.remove("activo");
        });
        btn.classList.add("activo");
        filtroActual = btn.dataset.cat;
        renderGrid();
      });
    });
 
    const modal = document.getElementById("galeria-modal");
    if (modal) {
      modal.addEventListener("click", function(e) {
        if (e.target.id === "galeria-modal") cerrarModal();
      });
    }
 
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape") cerrarModal();
    });
  });
 
})();