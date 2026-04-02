/* ===================================================== */
/* ===== AVISO AO RECARREGAR (F5) ===================== */
/* ===================================================== */
window.onbeforeunload = function () {
  return "Se sair, seu progresso será perdido.";
};

/* ===================================================== */
/* ===== GARANTE QUE O HTML CARREGOU ================== */
/* ===================================================== */
document.addEventListener("DOMContentLoaded", function () {

  const perguntas = document.querySelectorAll(".pergunta");
  const totalPerguntas = perguntas.length;
  let respondidas = parseInt(localStorage.getItem("respondidas")) || 0;
  let acertos = parseInt(localStorage.getItem("acertos")) || 0;

  const status = document.getElementById("status");
  const barraProgresso = document.getElementById("barra-progresso");
  const resultadoFinal = document.getElementById("resultado-final");
  const notaElemento = document.getElementById("nota");
  const btnRevisao = document.getElementById("btn-revisao");

  /* ===================================================== */
  /* ===== RESTAURA PROGRESSO =========================== */
  /* ===================================================== */
  perguntas.forEach((pergunta, index) => {
    const salvo = localStorage.getItem(`pergunta_${index}`);
    if (salvo) {
      const dados = JSON.parse(salvo);
      if (dados.respondida) {
        pergunta.classList.add("respondida");
        const botoes = pergunta.querySelectorAll("button");
        botoes.forEach(b => b.disabled = true);
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

  /* ===================================================== */
  /* ===== FUNÇÃO PRINCIPAL DE RESPOSTA ================== */
  /* ===================================================== */
  function responder(botao, respostaUsuario) {
    const pergunta = botao.closest(".pergunta");
    if (pergunta.classList.contains("respondida")) return;

    const respostaCorreta = pergunta.dataset.resposta === "true";
    const feedback = pergunta.querySelector(".feedback");

    // Marca como respondida
    pergunta.classList.add("respondida");

    // Bloqueia botões
    pergunta.querySelectorAll("button").forEach(b => b.disabled = true);

    // Verifica resposta
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

    // Atualiza progresso e salva
    atualizarProgresso();
    salvarProgresso(pergunta, respostaUsuario === respostaCorreta);

    // Se todas respondidas, mostra resultado
    if (respondidas === totalPerguntas) {
      mostrarResultado();
    }
  }

  /* ===================================================== */
  /* ===== SALVA PROGRESSO NO LOCALSTORAGE ============== */
  /* ===================================================== */
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
  /* ===== ATUALIZA STATUS E BARRA ====================== */
  /* ===================================================== */
  function atualizarProgresso() {
    status.textContent = `${respondidas} de ${totalPerguntas} respondidas`;
    barraProgresso.style.width = `${(respondidas / totalPerguntas) * 100}%`;
  }

  /* ===================================================== */
  /* ===== RESULTADO FINAL ============================== */
  /* ===================================================== */
  function mostrarResultado() {
    resultadoFinal.style.display = "block";
    const notaFinal = (acertos / totalPerguntas) * 100;

    let mensagem = "";
    if (notaFinal === 100) {
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

    // Cor da nota
    if (notaFinal >= 70) notaElemento.style.color = "#00ff88";
    else if (notaFinal >= 50) notaElemento.style.color = "#4da6ff";
    else notaElemento.style.color = "#ff4d4d";

    notaElemento.textContent = `Você acertou ${acertos} de ${totalPerguntas} (${notaFinal.toFixed(0)}%) - ${mensagem}`;

    // Mostra botão de revisão
    btnRevisao.style.display = "inline-block";

    // Scroll suave
    resultadoFinal.scrollIntoView({ behavior: "smooth" });
  }

  // Disponibiliza a função globalmente
  window.responder = responder;
});