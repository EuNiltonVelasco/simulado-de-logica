// Função para responder a pergunta
function responder(botao, respostaEscolhida) {
    const pergunta = botao.closest('.pergunta');
    const respostaCorreta = pergunta.getAttribute("data-resposta") === "true";

    const feedback = pergunta.querySelector(".feedback");

    if (respostaEscolhida === respostaCorreta) {
        feedback.innerText = "✅ Correto!";
        feedback.classList.add('correto');
        feedback.classList.remove('errado');
    } else {
        feedback.innerText = "❌ Errado!";
        feedback.classList.add('errado');
        feedback.classList.remove('correto');
    }

    // Marca como respondida
    pergunta.classList.add('respondida');

    // Desabilitar apenas os botões V/F dessa pergunta
    pergunta.querySelectorAll("button").forEach(b => {
        if (!b.classList.contains('btn-mostrar-resposta')) {
            b.disabled = true;
        }
    });

    // Habilitar o botão "Mostrar Resposta" caso a questão tenha sido respondida
    const botaoMostrarResposta = pergunta.querySelector('.btn-mostrar-resposta');
    if (botaoMostrarResposta) {
        botaoMostrarResposta.disabled = false;
    }

    atualizarProgresso();
}

// Função para mostrar resposta em cada pergunta (botão azul)
function mostrarResposta(botao) {
    const pergunta = botao.closest('.pergunta');
    const respostaCorreta = pergunta.getAttribute("data-resposta") === "true" ? "V" : "F";
    const explicacao = pergunta.getAttribute("data-explicacao") || "Nenhuma explicação disponível.";

    const feedback = pergunta.querySelector(".feedback");

    // Mostrar a resposta e explicação
    feedback.innerText = `Resposta correta: ${respostaCorreta}. ${explicacao}`;
    feedback.classList.add('correto');
    feedback.classList.remove('errado');

    // Desabilitar o botão "Mostrar Resposta" após a exibição
    botao.disabled = true;
}

// Função para atualizar barra de progresso
function atualizarProgresso() {
    const total = document.querySelectorAll('.pergunta').length;
    const respondidas = document.querySelectorAll('.pergunta.respondida').length;
    const barra = document.getElementById('barra-progresso');
    const status = document.getElementById('status');

    barra.style.width = ((respondidas / total) * 100) + '%';
    status.innerText = `${respondidas} de ${total} respondidas`;

    if (respondidas === total) {
        mostrarResultado();
    }
}

// Função para mostrar resultado final
function mostrarResultado() {
    let acertos = 0;
    document.querySelectorAll('.pergunta').forEach(p => {
        const correta = p.getAttribute('data-resposta') === 'true';
        const feedbackText = p.querySelector('.feedback').innerText;

        if ((correta && feedbackText.includes("Correto")) || (!correta && feedbackText.includes("Errado"))) {
            acertos++;
        }
    });

    const resultado = document.getElementById('resultado-final');
    resultado.style.display = 'block';
    document.getElementById('nota').innerText = `Você acertou ${acertos} de ${document.querySelectorAll('.pergunta').length} perguntas`;

    // 🎉 Confetti quando acertar todas
    if (acertos === document.querySelectorAll('.pergunta').length) {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}