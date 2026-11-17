"use strict";

var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
var botaoAnterior = document.getElementById("btn-anterior");
var botaoProximo = document.getElementById("btn-proximo");
var legenda = document.getElementById("legenda-slide");
var slideAtual = 0;
var intervaloSlides;

function mostrarSlide(posicao) {
  if (slides.length === 0) {
    return;
  }

  slideAtual = (posicao + slides.length) % slides.length;
  slides.forEach(function (slide, indice) {
    var ativo = indice === slideAtual;
    slide.classList.toggle("ativo", ativo);
    slide.setAttribute("aria-hidden", ativo ? "false" : "true");
  });

  if (legenda) {
    legenda.textContent = (slideAtual + 1) + " / " + slides.length;
  }
}

function iniciarSlides() {
  window.clearInterval(intervaloSlides);

  if (slides.length < 2) {
    return;
  }

  intervaloSlides = window.setInterval(function () {
    mostrarSlide(slideAtual + 1);
  }, 6000);
}

function pausarSlides() {
  window.clearInterval(intervaloSlides);
}

if (slides.length > 0) {
  mostrarSlide(0);

  if (botaoAnterior) {
    botaoAnterior.addEventListener("click", function () {
      mostrarSlide(slideAtual - 1);
      iniciarSlides();
    });
  }

  if (botaoProximo) {
    botaoProximo.addEventListener("click", function () {
      mostrarSlide(slideAtual + 1);
      iniciarSlides();
    });
  }

  var showcase = document.querySelector(".showcase");
  if (showcase) {
    showcase.addEventListener("mouseenter", pausarSlides);
    showcase.addEventListener("mouseleave", iniciarSlides);
    showcase.addEventListener("focusin", pausarSlides);
    showcase.addEventListener("focusout", iniciarSlides);
  }

  iniciarSlides();
}

var botaoMenu = document.getElementById("btn-menu");
var menu = document.getElementById("menu");

function fecharMenu() {
  if (!botaoMenu || !menu) {
    return;
  }

  menu.classList.remove("aberto");
  botaoMenu.setAttribute("aria-expanded", "false");
  botaoMenu.setAttribute("aria-label", "Abrir menu");
}

if (botaoMenu && menu) {
  botaoMenu.addEventListener("click", function () {
    var aberto = menu.classList.toggle("aberto");
    botaoMenu.setAttribute("aria-expanded", aberto ? "true" : "false");
    botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", fecharMenu);
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      fecharMenu();
    }
  });
}

var linksMenu = Array.prototype.slice.call(
  document.querySelectorAll(".nav-links a:not(.nav-cta)")
);

function marcarLinkAtivo(idSecao) {
  linksMenu.forEach(function (link) {
    var ativo = link.getAttribute("href") === "#" + idSecao;
    link.classList.toggle("ativo", ativo);

    if (ativo) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

var secoesObservadas = linksMenu
  .map(function (link) {
    return document.querySelector(link.getAttribute("href"));
  })
  .filter(Boolean);

var secaoInicio = document.getElementById("inicio");
if (secaoInicio) {
  secoesObservadas.unshift(secaoInicio);
}

if ("IntersectionObserver" in window && secoesObservadas.length > 0) {
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        marcarLinkAtivo(entrada.target.id);
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  secoesObservadas.forEach(function (secao) {
    observador.observe(secao);
  });
}

var campoNivel = document.getElementById("nivel-agua");
var botaoSimular = document.getElementById("btn-simular");
var resultadoSimulador = document.getElementById("resultado-simulador");

function mostrarResultado(nivel, mensagem) {
  resultadoSimulador.dataset.level = nivel;
  resultadoSimulador.querySelector(".result-text").textContent = mensagem;
}

function simularRisco() {
  if (!campoNivel || !resultadoSimulador) {
    return;
  }

  var texto = campoNivel.value.trim();
  var nivel = Number(texto);

  if (texto === "" || !Number.isFinite(nivel) || nivel < 0 || nivel > 500) {
    mostrarResultado("error", "Digite uma altura entre 0 e 500 cm para continuar.");
    campoNivel.setAttribute("aria-invalid", "true");
    campoNivel.focus();
    return;
  }

  campoNivel.removeAttribute("aria-invalid");

  if (nivel >= 30) {
    mostrarResultado("danger", "PERIGO: não atravesse. Afaste-se da água e procure um local seguro.");
  } else if (nivel >= 15) {
    mostrarResultado("attention", "ATENÇÃO: evite a rua alagada e avise quem estiver por perto.");
  } else {
    mostrarResultado("normal", "ABAIXO DO LIMITE DE ATENÇÃO: continue acompanhando as condições.");
  }
}

if (botaoSimular) {
  botaoSimular.addEventListener("click", simularRisco);
}

if (campoNivel) {
  campoNivel.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
      simularRisco();
    }
  });
}

document.querySelectorAll(".quick-values [data-level]").forEach(function (botao) {
  botao.addEventListener("click", function () {
    if (campoNivel) {
      campoNivel.value = botao.dataset.level;
      simularRisco();
    }
  });
});