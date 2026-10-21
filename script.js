```javascript
/* =========================================================
   Dayene Evangelista — Mentoria Militar
   ========================================================= */

/* ---------- CONFIGURAÇÕES (edite aqui) ---------- */
const CONFIG = {
  // Número com DDI + DDD, só dígitos. Ex.: 5561999999999
  whatsappNumber: "5561999999999",
  whatsappMessage: "Olá, Dayene! Vim pelo site e quero saber mais sobre a mentoria.",
  instagramUrl: "https://www.instagram.com/SEU_USUARIO",
  tiktokUrl: "https://www.tiktok.com/@SEU_USUARIO",

  // Foto principal
  heroPhoto: "assets/foto-dayene.jpg",

  // Foto da seção "Sobre mim"
  aboutPhoto: "assets/foto-sobre.jpg",
};

/* Lista de aprovados. Deixe vazia para mostrar os espaços reservados.
   Exemplo:
   { nome: "Fulano de Tal", concurso: "EsPCEx 2026", foto: "assets/aprovados/fulano.jpg" }
*/
const APROVADOS = [];
const PLACEHOLDERS = 6;

/* ---------- Links (WhatsApp, Instagram, TikTok) ---------- */
(function setLinks() {
  const wa = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;

  document.querySelectorAll(".js-whatsapp").forEach((a) => (a.href = wa));
  document.querySelectorAll(".js-instagram").forEach((a) => (a.href = CONFIG.instagramUrl));
  document.querySelectorAll(".js-tiktok").forEach((a) => (a.href = CONFIG.tiktokUrl));
})();

/* ---------- Ano no rodapé ---------- */
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ---------- Menu mobile ---------- */
(function menu() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) close();
  });
})();

/* ---------- Header com sombra ao rolar + link ativo ---------- */
(function headerScroll() {
  const header = document.getElementById("header");
  const links = document.querySelectorAll(".nav__link");

  // Incluída a seção "escolha" (Formatos)
  const sections = ["sobre", "mentoria", "escolha", "aprovados", "contato"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const onScroll = () => {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    }

    const y = window.scrollY + 160;
    let current = "";

    sections.forEach((s) => {
      if (y >= s.offsetTop) current = s.id;
    });

    links.forEach((l) => {
      l.classList.toggle(
        "is-active",
        l.getAttribute("href") === `#${current}`
      );
    });
  };

  onScroll();

  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* ---------- Fotos (troca o espaço reservado se o arquivo existir) ---------- */
(function photos() {
  const load = (id, src, alt) => {
    const frame = document.getElementById(id);

    if (!frame || !src) return;

    const img = new Image();

    img.onload = () => {
      const el = document.createElement("img");

      el.src = src;
      el.alt = alt;
      el.className = "photo-frame__img";

      frame.innerHTML = "";
      frame.appendChild(el);
      frame.classList.add("has-photo");
    };

    img.src = src;
  };

  load("heroPhoto", CONFIG.heroPhoto, "Dayene Evangelista");
  load("aboutPhoto", CONFIG.aboutPhoto, "Dayene Evangelista, mentora");
})();

/* ---------- Aprovados ---------- */
(function approved() {
  const grid = document.getElementById("approvedGrid");
  const note = document.getElementById("approvedNote");

  if (!grid) return;

  const userIcon =
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';

  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));

  const items = APROVADOS.length
    ? APROVADOS
    : Array.from({ length: PLACEHOLDERS }, () => ({
        nome: "Nome da aprovada ou do aprovado",
        concurso: "Concurso e ano",
        foto: ""
      }));

  if (APROVADOS.length && note) {
    note.style.display = "none";
  }

  grid.innerHTML = items
    .map((p) => {
      const filled = APROVADOS.length > 0;

      const photo = p.foto
        ? `<img class="approved__img" src="${escapeHtml(p.foto)}" alt="${escapeHtml(p.nome)}" loading="lazy" />`
        : `<span class="approved__mark"><img src="assets/logo.png" alt="" />${userIcon}</span>`;

      return `
        <article class="approved ${filled ? "approved--filled" : ""}">
          <div class="approved__photo">${photo}</div>
          <div class="approved__info">
            <h4 class="approved__name">${escapeHtml(p.nome)}</h4>
            <p class="approved__meta">${escapeHtml(p.concurso)}</p>
          </div>
        </article>`;
    })
    .join("");
})();

/* ---------- Carrossel de aprovados ---------- */
(function carousel() {
  const track = document.getElementById("approvedGrid");
  const prev = document.getElementById("approvedPrev");
  const next = document.getElementById("approvedNext");

  if (!track) return;

  const hasOverflow = () => track.scrollWidth > track.clientWidth + 4;

  const step = () => {
    const card = track.querySelector(".approved");

    if (!card) return 0;

    const gap = parseFloat(getComputedStyle(track).columnGap) || 22;

    return card.getBoundingClientRect().width + gap;
  };

  const go = (dir) => {
    if (!hasOverflow()) return;

    const max = track.scrollWidth - track.clientWidth;
    let target = track.scrollLeft + dir * step();

    // Chegou ao fim: volta ao início
    if (dir > 0 && track.scrollLeft >= max - 4) {
      target = 0;
    }

    // Está no início: vai ao fim
    if (dir < 0 && track.scrollLeft <= 4) {
      target = max;
    }

    track.scrollTo({
      left: target,
      behavior: "smooth"
    });
  };

  if (prev) {
    prev.addEventListener("click", () => go(-1));
  }

  if (next) {
    next.addEventListener("click", () => go(1));
  }

  const updateButtons = () => {
    const show = hasOverflow();

    if (prev) prev.hidden = !show;
    if (next) next.hidden = !show;
  };

  updateButtons();

  window.addEventListener("resize", updateButtons);

  // Passa sozinho; pausa com mouse, toque ou foco
  let timer;

  const stop = () => clearInterval(timer);

  const start = () => {
    stop();
    timer = setInterval(() => go(1), 3500);
  };

  const area = track.parentElement;

  if (area) {
    ["mouseenter", "touchstart", "focusin"].forEach((e) => {
      area.addEventListener(e, stop, { passive: true });
    });

    ["mouseleave", "touchend", "focusout"].forEach((e) => {
      area.addEventListener(e, start, { passive: true });
    });
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    start();
  }
})();

/* ---------- Animação de entrada ---------- */
(function reveal() {
  const els = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  els.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 90}ms`;
    io.observe(el);
  });
})();
```
