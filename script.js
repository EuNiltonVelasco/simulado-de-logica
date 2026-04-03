/* ===================================================== */
/* ===== AVISO AO RECARREGAR (F5) ===================== */
/* ===================================================== */
window.onbeforeunload = function () {
  return "Se sair, seu progresso será perdido.";
};

/* ===================================================== */
/* ===== VARIÁVEIS GLOBAIS ============================ */
/* ===================================================== */
let perguntas;
let totalPerguntas;
let respondidas;
let acertos;
let status;
let barraProgresso;
let resultadoFinal;
let notaElemento;
let btnRevisao;

/* ===================================================== */
/* ===== INICIALIZAÇÃO QUANDO HTML CARREGA ============ */
/* ===================================================== */
document.addEventListener("DOMContentLoaded", function () {

  perguntas = document.querySelectorAll(".pergunta");
  totalPerguntas = perguntas.length;
  respondidas = parseInt(localStorage.getItem("respondidas")) || 0;
  acertos = parseInt(localStorage.getItem("acertos")) || 0;

  status = document.getElementById("status");
  barraProgresso = document.getElementById("barra-progresso");
  resultadoFinal = document.getElementById("resultado-final");
  notaElemento = document.getElementById("nota");
  btnRevisao = document.getElementById("btn-revisao");

  // Restaura progresso salvo
  perguntas.forEach((pergunta, index) => {
    const salvo = localStorage.getItem(`pergunta_${index}`);
    if (salvo) {
      const dados = JSON.parse(salvo);
      if (dados.respondida) {
        pergunta.classList.add("respondida");
        pergunta.querySelectorAll("button").forEach(b => b.disabled = true);
        const feedback = pergunta.querySelector(".feedback");
        if (dados.acertou) {
          feedback.textContent = "✅ Acertou!";
          feedback.className = "feedback correto";
          pergunta.classList.add("acertou");
        } else {
          feedback.textContent = `❌ Errou! Resposta correta: ${pergunta.dataset.resposta === "true" ? "V" : "F"}`;
          feedback.className = "feedback errado";
        }
      }
    }
  });

  atualizarProgresso();
});

/* ===================================================== */
/* ===== FUNÇÃO RESPOSTA GLOBAL ======================= */
/* ===================================================== */
function responder(botao, respostaUsuario) {
  const pergunta = botao.closest(".pergunta");
  if (pergunta.classList.contains("respondida")) return;

  const respostaCorreta = pergunta.dataset.resposta === "true";
  const feedback = pergunta.querySelector(".feedback");

  pergunta.classList.add("respondida");
  pergunta.querySelectorAll("button").forEach(b => b.disabled = true);

  if (respostaUsuario === respostaCorreta) {
    feedback.textContent = "✅ Acertou!";
    feedback.className = "feedback correto";
    pergunta.classList.add("acertou");
    acertos++;
  } else {
    feedback.textContent = `❌ Errou! Resposta correta: ${respostaCorreta ? "V" : "F"}`;
    feedback.className = "feedback errado";
  }

  respondidas++;
  atualizarProgresso();
  salvarProgresso(pergunta, respostaUsuario === respostaCorreta);

  if (respondidas === totalPerguntas) mostrarResultado();
}

/* ===================================================== */
/* ===== SALVA PROGRESSO ============================= */
function salvarProgresso(pergunta, acertou) {
  const index = Array.from(perguntas).indexOf(pergunta);
  localStorage.setItem("acertos", acertos);
  localStorage.setItem("respondidas", respondidas);
  localStorage.setItem(`pergunta_${index}`, JSON.stringify({
    respondida: true,
    acertou: acertou
  }));
}

/* ===================================================== */
/* ===== ATUALIZA BARRA E STATUS ====================== */
function atualizarProgresso() {
  status.textContent = `${respondidas} de ${totalPerguntas} respondidas`;
  barraProgresso.style.width = `${(respondidas / totalPerguntas) * 100}%`;
}

/* ===================================================== */
/* ===== MOSTRAR RESULTADO FINAL ===================== */
function mostrarResultado() {
  resultadoFinal.style.display = "block";
  const notaFinal = (acertos / totalPerguntas) * 100;

  let mensagem = "";
  if (notaFinal >= 100) {
    mensagem = "🏆 Perfeito! Gabaritou!";
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
  } else if (notaFinal >= 80) {
    mensagem = "🔥 Excelente! Mandou muito bem!";
  } else if (notaFinal >= 70) {
    mensagem = "🟢 Bom desempenho!";
  } else if (notaFinal >= 50) {
    mensagem = "🔵 Ok, pode melhorar!";
  } else {
    mensagem = "🔴 Atenção, revise o conteúdo!";
  }

  notaElemento.style.color = notaFinal >= 70 ? "#00ff88" : notaFinal >= 50 ? "#4da6ff" : "#ff4d4d";
  notaElemento.textContent = `Você acertou ${acertos} de ${totalPerguntas} (${notaFinal.toFixed(0)}%) - ${mensagem}`;
  btnRevisao.style.display = "inline-block";
  resultadoFinal.scrollIntoView({ behavior: "smooth" });
}
