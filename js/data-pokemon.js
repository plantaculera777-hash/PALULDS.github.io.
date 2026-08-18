// ═══════════════════════════════════════
//   DATA-POKEMON.JS — Ficha individual
// ═══════════════════════════════════════

(function () {

  if (typeof pokedex === "undefined") {
    console.error("data-pokemon.js: no se encontró 'pokedex'.");
    return;
  }

  const keys  = Object.keys(pokedex);
  const params = new URLSearchParams(window.location.search);
  const id     = params.get("id");

  if (!id || !pokedex[id]) {
    document.body.innerHTML = '<p style="padding:40px" class="chakra-petch-regular">Pokémon no encontrado.</p>';
    return;
  }

  const p       = pokedex[id];
  const idx     = keys.indexOf(id);
  const prevKey = keys[(idx - 1 + keys.length) % keys.length];
  const nextKey = keys[(idx + 1) % keys.length];
  const prev    = pokedex[prevKey];
  const next    = pokedex[nextKey];

  document.addEventListener("DOMContentLoaded", function () {

    // ─── TÍTULO ──────────────────────
    document.title = "Pokémon Tricolor — " + p.nombre;
    document.getElementById("poke-titulo").textContent =
      "#" + String(p.id).padStart(3, "0") + " " + p.nombre;

    // ─── NAV ANTERIOR / SIGUIENTE ────
    const nav = document.getElementById("poke-nav");
    nav.innerHTML =
      '<a href="data-tricolor.html?id=' + prevKey + '" class="poke-nav-btn">' +
        '<img src="' + prev.icon + '" alt="' + prev.nombre + '" class="poke-nav-icon">' +
        '<span class="chakra-petch-regular">← ' + prev.nombre + '</span>' +
      '</a>' +
      '<a href="pokedex-tricolor.html" class="poke-nav-volver chakra-petch-regular">Pokédex</a>' +
      '<a href="data-tricolor.html?id=' + nextKey + '" class="poke-nav-btn">' +
        '<span class="chakra-petch-regular">' + next.nombre + ' →</span>' +
        '<img src="' + next.icon + '" alt="' + next.nombre + '" class="poke-nav-icon">' +
      '</a>';

    // ─── ARTWORK ─────────────────────
    const artwork = document.getElementById("poke-artwork");
    artwork.src = p.artwork;
    artwork.alt = p.nombre;
    document.getElementById("poke-artwork-nota").textContent = p.nota || "";

    // ─── TIPOS ───────────────────────
    const tiposWrap = document.getElementById("poke-tipos");
    tiposWrap.innerHTML = p.tipos.map(function (t) {
      return '<img src="res/pokeicon/' + t + '.png" alt="' + t + '" class="poke-tipo-icon" title="' + t + '">';
    }).join("");

    // ─── ENTRADA POKÉDEX ─────────────
    document.getElementById("poke-entrada").textContent = p.pokedex;

    // ─── DATOS ───────────────────────
    const datosMap = [
      { key: "especie",     label: "Especie",      val: p.especie },
      { key: "tamanio",     label: "Tamaño",       val: p.datos.tamanio },
      { key: "peso",        label: "Peso",         val: p.datos.peso },
      { key: "color",       label: "Color",        val: p.datos.color },
      { key: "grupo_huevo", label: "Grupo Huevo",  val: p.datos.grupo_huevo },
      { key: "habilidad",   label: "Habilidad",    val: p.habilidad },
      { key: "habilidad_oculta", label: "Hab. Oculta", val: p.habilidad_oculta },
    ];

    const datosGrid = document.getElementById("poke-datos");
    datosGrid.innerHTML = datosMap.map(function (d) {
      return (
        '<div class="poke-dato-item">' +
          '<img src="res/pokeicon/' + d.key + '.png" alt="' + d.label + '" class="poke-dato-icon" onerror="this.style.display=\'none\'">' +
          '<div>' +
            '<span class="poke-dato-label chakra-petch-regular">' + d.label + '</span>' +
            '<span class="poke-dato-val chakra-petch-bold">' + d.val + '</span>' +
          '</div>' +
        '</div>'
      );
    }).join("");

    // ─── STATS ───────────────────────────
    const statKeys   = ["hp", "at", "de", "sat", "sde", "vel"];
    const statLabels = { hp: "HP", at: "Ataque", de: "Defensa", sat: "At. Esp.", sde: "Def. Esp.", vel: "Velocidad" };
    const statMax    = 255;

    const statsTotal = statKeys.reduce(function(sum, k) {
      return sum + (p.stats[k]?.base || 0);
    }, 0);

    const barras = document.getElementById("poke-stats-barras");
    barras.innerHTML = statKeys.map(function(k) {
      const val  = p.stats[k]?.base || 0;
      const pct  = Math.round((val / statMax) * 100);
      const color = val >= 100 ? "#4caf50" : val >= 60 ? "#ff9800" : "#ec2c2c";
      return (
        '<div class="stat-barra-row">' +
          '<span class="stat-barra-label chakra-petch-regular">' + statLabels[k] + '</span>' +
          '<span class="stat-barra-num chakra-petch-bold">' + val + '</span>' +
          '<div class="stat-barra-bg">' +
            '<div class="stat-barra-fill" style="width:' + pct + '%;background:' + color + '"></div>' +
          '</div>' +
        '</div>'
      );
    }).join("") +
    '<div class="stat-barra-row stat-total-row">' +
      '<span class="stat-barra-label chakra-petch-bold">Total</span>' +
      '<span class="stat-barra-num chakra-petch-bold" style="color:var(--red)">' + statsTotal + '</span>' +
      '<div class="stat-barra-bg"></div>' +
    '</div>';

    // ─── EVS ─────────────────────────────
    const evsTabla = document.getElementById("poke-evs-tabla");
    const evsConValor = statKeys.filter(function(k) {
      return (p.stats[k]?.evs || 0) > 0;
    });

    if (evsConValor.length === 0) {
      evsTabla.innerHTML = '<p class="chakra-petch-regular" style="color:var(--grey);font-size:12px">Este Pokémon no otorga EVs.</p>';
    } else {
      evsTabla.innerHTML =
        '<table class="evs-tabla">' +
          '<thead><tr>' +
            statKeys.map(function(k) {
              return '<th class="chakra-petch-regular">' + statLabels[k] + '</th>';
            }).join("") +
          '</tr></thead>' +
          '<tbody><tr>' +
            statKeys.map(function(k) {
              const val = p.stats[k]?.evs || 0;
              return '<td class="chakra-petch-bold' + (val > 0 ? ' evs-highlight' : '') + '">' + val + '</td>';
            }).join("") +
          '</tr></tbody>' +
        '</table>';
    }

    // ─── MOVIMIENTOS ─────────────────────
    function renderTablaMovs(contenedorId, movs, colLabel) {
      const contenedor = document.getElementById(contenedorId);
      if (!contenedor) return;

      if (!movs || movs.length === 0) {
        contenedor.innerHTML = '<p class="chakra-petch-regular" style="color:var(--grey);font-size:12px">Sin movimientos registrados.</p>';
        return;
      }

      contenedor.innerHTML =
        '<table class="movs-tabla">' +
          '<thead><tr>' +
            '<th class="chakra-petch-regular">' + colLabel + '</th>' +
            '<th class="chakra-petch-regular">Nombre</th>' +
            '<th class="chakra-petch-regular">Tipo</th>' +
            '<th class="chakra-petch-regular">Cat.</th>' +
            '<th class="chakra-petch-regular">Poder</th>' +
            '<th class="chakra-petch-regular">Precisión</th>' +
            '<th class="chakra-petch-regular">PP</th>' +
            '<th class="chakra-petch-regular">Descripción</th>' +
          '</tr></thead>' +
          '<tbody>' +
            movs.map(function(m) {
              const condicion = colLabel === "Nivel" ? m.nivel : m.mt;
              return (
                '<tr>' +
                  '<td class="chakra-petch-bold movs-condicion">' + condicion + '</td>' +
                  '<td class="chakra-petch-regular movs-nombre">' + m.nombre + '</td>' +
                  '<td class="movs-tipo">' +
                    '<img src="res/pokeicon/' + m.tipo + '.png" alt="' + m.tipo + '" class="mov-tipo-icon" title="' + m.tipo + '">' +
                  '</td>' +
                  '<td class="movs-cat">' +
                    '<img src="res/pokeicon/' + m.categoria + '.png" alt="' + m.categoria + '" class="mov-cat-icon" title="' + m.categoria + '">' +
                  '</td>' +
                  '<td class="chakra-petch-regular movs-num">' + (m.poder !== null ? m.poder : '—') + '</td>' +
                  '<td class="chakra-petch-regular movs-num">' + (m.precision !== null ? m.precision : '—') + '</td>' +
                  '<td class="chakra-petch-regular movs-num">' + (m.pp !== null ? m.pp : '—') + '</td>' +
                  '<td class="chakra-petch-regular movs-desc">' + (m.descripcion || '') + '</td>' +
                '</tr>'
              );
            }).join("") +
          '</tbody>' +
        '</table>';
    }

    renderTablaMovs("poke-movs-nivel", p.movimientos_nivel, "Nivel");
    renderTablaMovs("poke-movs-mt",    p.movimientos_mt,    "MT");

    // ─── LÍNEA EVOLUTIVA ─────────────────
    function getLineaEvolutiva(idActual) {
      function getPrimero(id) {
        const pre = pokedex[id]?.evolucion?.preevolucion;
        if (!pre || !pokedex[pre]) return id;
        return getPrimero(pre);
      }

      function getCadena(id) {
        const p = pokedex[id];
        if (!p) return [];

        const evo = p.evolucion?.evolucion;
        const evo2 = p.evolucion?.evolucion2;
        const evo3 = p.evolucion?.evolucion3;

        // Si hay múltiples evoluciones, las mostramos como ramas
        if (evo2) {
          const ramas = [evo, evo2];
          if (evo3) ramas.push(evo3);
          return [{
            id: id,
            ramas: ramas.map(function(r) {
              return {
                id: r,
                condicion: r === evo
                  ? p.evolucion.condicion
                  : r === evo2
                  ? p.evolucion.condicion2
                  : p.evolucion.condicion3
              };
            })
          }];
        }

        // Lineal normal
        if (!evo || !pokedex[evo]) return [id];
        return [id].concat(getCadena(evo));
      }

      const primero = getPrimero(idActual);
      return getCadena(primero);
    }

    const linea = getLineaEvolutiva(id);
    const evoContenedor = document.getElementById("poke-evo-linea");

    evoContenedor.innerHTML = linea.map(function(entry, i) {
      // Es un nodo con ramas (tipo Eevee)
      if (typeof entry === "object" && entry.ramas) {
        const pevo = pokedex[entry.id];
        const esActual = entry.id === id;
        const nodoBase =
          '<a href="data-tricolor.html?id=' + entry.id + '" class="evo-item' + (esActual ? ' evo-actual' : '') + '">' +
            '<img src="' + pevo.icon + '" alt="' + pevo.nombre + '" class="evo-icon">' +
            '<span class="chakra-petch-regular evo-nombre">' + pevo.nombre + '</span>' +
            '<span class="chakra-petch-regular evo-num">#' + String(pevo.id).padStart(3, "0") + '</span>' +
          '</a>';

        const ramas = entry.ramas.map(function(r) {
          const pr = pokedex[r.id];
          const esActualRama = r.id === id;
          return (
            '<div class="evo-rama">' +
              '<div class="evo-flecha">' +
                '<span class="evo-condicion chakra-petch-regular">' + (r.condicion || "") + '</span>' +
                '<span class="evo-arrow">→</span>' +
              '</div>' +
              '<a href="data-tricolor.html?id=' + r.id + '" class="evo-item' + (esActualRama ? ' evo-actual' : '') + '">' +
                '<img src="' + pr.icon + '" alt="' + pr.nombre + '" class="evo-icon">' +
                '<span class="chakra-petch-regular evo-nombre">' + pr.nombre + '</span>' +
                '<span class="chakra-petch-regular evo-num">#' + String(pr.id).padStart(3, "0") + '</span>' +
              '</a>' +
            '</div>'
          );
        }).join("");

        return nodoBase + '<div class="evo-ramas-wrap">' + ramas + '</div>';
      }

      // Nodo lineal normal
      const pevo = pokedex[entry];
      const condicion = i > 0 ? (pokedex[linea[i-1]]?.evolucion?.condicion || "") : "";
      const esActual = entry === id;

      const flecha = i > 0
        ? '<div class="evo-flecha">' +
            '<span class="evo-condicion chakra-petch-regular">' + condicion + '</span>' +
            '<span class="evo-arrow">→</span>' +
          '</div>'
        : '';

      return (
        flecha +
        '<a href="data-tricolor.html?id=' + entry + '" class="evo-item' + (esActual ? ' evo-actual' : '') + '">' +
          '<img src="' + pevo.icon + '" alt="' + pevo.nombre + '" class="evo-icon">' +
          '<span class="chakra-petch-regular evo-nombre">' + pevo.nombre + '</span>' +
          '<span class="chakra-petch-regular evo-num">#' + String(pevo.id).padStart(3, "0") + '</span>' +
        '</a>'
      );
    }).join("");
  });

})();