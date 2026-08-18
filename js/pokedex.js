// ═══════════════════════════════════════
//   POKEDEX.JS — Lógica del grid
//   Los datos van en pokedata.js
// ═══════════════════════════════════════

(function () {

  if (typeof pokedex === "undefined") {
    console.error("pokedex.js: no se encontró 'pokedex'. ¿Cargaste pokedata.js antes?");
    return;
  }

  let filtroTipo = "";

  const statKeys = ["hp", "at", "de", "sat", "sde", "vel"];
  const statLabels = { hp: "HP", at: "At", de: "De", sat: "SAt", sde: "SDe", vel: "Vel" };

  // ─── TIPOS ÚNICOS ──────────────────
  function getTipos() {
    const tipos = new Set();
    Object.values(pokedex).forEach(function(p) {
      p.tipos.forEach(function(t) { tipos.add(t); });
    });
    return Array.from(tipos).sort();
  }

  // ─── RENDER FILTROS ────────────────
  function renderFiltros() {
    const contenedor = document.getElementById("pokedex-filtros");
    if (!contenedor) return;

    const tipos = getTipos();
    tipos.forEach(function(tipo) {
      const btn = document.createElement("button");
      btn.className = "pokedex-filtro chakra-petch-regular";
      btn.dataset.tipo = tipo;
      btn.innerHTML = '<img src="res/pokeicon/' + tipo + '.png" alt="' + tipo + '" class="filtro-tipo-icon"> ' + tipo;
      contenedor.appendChild(btn);
    });

    contenedor.querySelectorAll(".pokedex-filtro").forEach(function(btn) {
      btn.addEventListener("click", function() {
        contenedor.querySelectorAll(".pokedex-filtro").forEach(function(b) { b.classList.remove("activo"); });
        btn.classList.add("activo");
        filtroTipo = btn.dataset.tipo;
        renderGrid();
      });
    });
  }

  // ─── RENDER GRID ───────────────────
  function renderGrid() {
    const grid = document.getElementById("pokedex-grid");
    if (!grid) return;

    const busqueda = (document.getElementById("pokedex-busqueda")?.value || "").toLowerCase();

    const lista = Object.entries(pokedex).filter(function(entry) {
      const p = entry[1];
      const coincideNombre = p.nombre.toLowerCase().indexOf(busqueda) !== -1;
      const coincideTipo   = filtroTipo === "" || p.tipos.indexOf(filtroTipo) !== -1;
      return coincideNombre && coincideTipo;
    });

    if (lista.length === 0) {
      grid.innerHTML = '<p class="chakra-petch-regular pokedex-vacio">No se encontraron Pokémon.</p>';
      return;
    }

    grid.innerHTML = lista.map(function(entry) {
      const id = entry[0];
      const p  = entry[1];

      const tipos = p.tipos.map(function(t) {
        return '<img src="res/pokeicon/' + t + '.png" alt="' + t + '" class="poke-tipo-icon" title="' + t + '">';
      }).join("");

      const statsTotal = statKeys.reduce(function(sum, k) {
        return sum + (p.stats[k]?.base || 0);
      }, 0);

      const statsHtml = statKeys.map(function(k) {
        return '<div class="poke-stat"><span class="poke-stat-label chakra-petch-regular">' + statLabels[k] + '</span><span class="poke-stat-val chakra-petch-bold">' + (p.stats[k]?.base || 0) + '</span></div>';
      }).join("");

      return (
        '<a href="data-tricolor.html?id=' + id + '" class="poke-card">' +
          '<div class="poke-card-top">' +
            '<span class="poke-num chakra-petch-regular">#' + String(p.id).padStart(3, "0") + '</span>' +
            '<img src="' + p.icon + '" alt="' + p.nombre + '" class="poke-icon">' +
            '<span class="poke-nombre chakra-petch-bold">' + p.nombre + '</span>' +
            '<div class="poke-tipos">' + tipos + '</div>' +
          '</div>' +
          '<div class="poke-card-stats">' +
            statsHtml +
            '<div class="poke-stat poke-stat-total"><span class="poke-stat-label chakra-petch-regular">Total</span><span class="poke-stat-val chakra-petch-bold">' + statsTotal + '</span></div>' +
          '</div>' +
        '</a>'
      );
    }).join("");
  }

  // ─── INIT ──────────────────────────
  document.addEventListener("DOMContentLoaded", function() {
    renderFiltros();
    renderGrid();

    document.getElementById("pokedex-busqueda")?.addEventListener("input", renderGrid);
  });

})();