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
    slide.style.display = ativo ? "block" : "none";
    slide.setAttribute("aria-hidden", ativo ? "false" : "true");
  });

  if (legenda) {
    legenda.textContent = (slideAtual + 1) + " / " + slides.length;
  }
}

function iniciarSlides() {
  if (slides.length < 2) {
    mostrarSlide(0);
    return;
  }

  window.clearInterval(intervaloSlides);
  intervaloSlides = window.setInterval(function () {
    mostrarSlide(slideAtual + 1);
  }, 6000);
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
    showcase.addEventListener("mouseenter", function () {
      window.clearInterval(intervaloSlides);
    });
    showcase.addEventListener("mouseleave", iniciarSlides);
    showcase.addEventListener("focusin", function () {
      window.clearInterval(intervaloSlides);
    });
    showcase.addEventListener("focusout", iniciarSlides);
  }

  iniciarSlides();
}

var botaoMenu = document.getElementById("btn-menu");
var menu = document.getElementById("menu");

if (botaoMenu && menu) {
  botaoMenu.addEventListener("click", function () {
    var aberto = menu.classList.toggle("aberto");
    botaoMenu.setAttribute("aria-expanded", aberto ? "true" : "false");
    botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("aberto");
      botaoMenu.setAttribute("aria-expanded", "false");
      botaoMenu.setAttribute("aria-label", "Abrir menu");
    });
  });
}

var campoNivel = document.getElementById("nivel-agua");
var botaoSimular = document.getElementById("btn-simular");
var resultadoSimulador = document.getElementById("resultado-simulador");

function simularRisco() {
  if (!campoNivel || !resultadoSimulador) {
    return;
  }

  var texto = campoNivel.value.trim();
  var nivel = Number(texto);

  if (texto === "" || !Number.isFinite(nivel) || nivel < 0 || nivel > 500) {
    resultadoSimulador.dataset.level = "error";
    resultadoSimulador.querySelector(".result-text").textContent =
      "Digite uma altura entre 0 e 500 cm para continuar.";
    campoNivel.setAttribute("aria-invalid", "true");
    campoNivel.focus();
    return;
  }

  campoNivel.removeAttribute("aria-invalid");

  if (nivel >= 30) {
    resultadoSimulador.dataset.level = "danger";
    resultadoSimulador.querySelector(".result-text").textContent =
      "PERIGO: não atravesse. Afaste-se da água e procure um local seguro.";
  } else if (nivel >= 15) {
    resultadoSimulador.dataset.level = "attention";
    resultadoSimulador.querySelector(".result-text").textContent =
      "ATENÇÃO: evite a rua alagada e avise quem estiver por perto.";
  } else {
    resultadoSimulador.dataset.level = "normal";
    resultadoSimulador.querySelector(".result-text").textContent =
      "ABAIXO DO LIMITE DE ATENÇÃO: continue acompanhando as condições.";
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

document.querySelectorAll("[data-level]").forEach(function (botao) {
  botao.addEventListener("click", function () {
    if (campoNivel) {
      campoNivel.value = botao.dataset.level;
      simularRisco();
    }
  });
});
