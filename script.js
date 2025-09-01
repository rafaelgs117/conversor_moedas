// Lista para armazenar histórico
let historico = [];

// Carrega moedas suportadas ao iniciar a página
document.addEventListener("DOMContentLoaded", async () => {
  const url = "https://api.frankfurter.app/currencies";
  const selectDe = document.getElementById("moedaDe");
  const selectPara = document.getElementById("moedaPara");

  try {
    let resposta = await fetch(url);
    let moedas = await resposta.json();

    // Preenche os <select> com todas as moedas
    for (let codigo in moedas) {
      let option1 = document.createElement("option");
      option1.value = codigo;
      option1.textContent = `${moedas[codigo]} (${codigo})`;
      selectDe.appendChild(option1);

      let option2 = option1.cloneNode(true);
      selectPara.appendChild(option2);
    }

    // Define valores padrão
    selectDe.value = "USD";
    selectPara.value = "BRL";

  } catch (error) {
    document.getElementById("resultado").innerText = "Erro ao carregar moedas.";
  }

  // Carrega histórico do localStorage
  let salvo = localStorage.getItem("historicoConversoes");
  if (salvo) {
    historico = JSON.parse(salvo);
    atualizarHistorico();
  }
});

// Função de conversão
async function converter() {
  let moedaDe = document.getElementById("moedaDe").value;
  let moedaPara = document.getElementById("moedaPara").value;
  let valor = document.getElementById("valor").value;

  if (moedaDe === moedaPara) {
    document.getElementById("resultado").innerText = "Selecione moedas diferentes.";
    return;
  }

  if (valor === "" || valor <= 0) {
    document.getElementById("resultado").innerText = "Digite um valor válido.";
    return;
  }

  try {
    let url = `https://api.frankfurter.app/latest?amount=${valor}&from=${moedaDe}&to=${moedaPara}`;
    let resposta = await fetch(url);
    let dados = await resposta.json();

    let convertido = dados.rates[moedaPara].toFixed(2);
    let resultado = `${valor} ${moedaDe} = ${convertido} ${moedaPara}`;

    // Exibe resultado atual
    document.getElementById("resultado").innerText = resultado;

    // Adiciona ao histórico
    historico.unshift(resultado); // adiciona no topo
    if (historico.length > 5) historico.pop(); // mantém no máximo 5 registros

    // Atualiza tela e salva no localStorage
    atualizarHistorico();
    localStorage.setItem("historicoConversoes", JSON.stringify(historico));

  } catch (error) {
    document.getElementById("resultado").innerText = "Erro ao obter cotação.";
  }
}

// Atualiza lista do histórico
function atualizarHistorico() {
  const lista = document.getElementById("historico");
  lista.innerHTML = "";
  historico.forEach(item => {
    let li = document.createElement("li");
    li.textContent = item;
    lista.appendChild(li);
  });
}

// Função para limpar histórico
function limparHistorico() {
  historico = [];
  localStorage.removeItem("historicoConversoes");
  atualizarHistorico();
}

// Ativa o botão
document.getElementById("btnConverter").addEventListener("click", converter);
document.getElementById("btnLimpar").addEventListener("click", limparHistorico);
