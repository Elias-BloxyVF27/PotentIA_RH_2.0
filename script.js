// =============================================
// POTENTIA RH — SCRIPT.JS
// =============================================

// ⚠️ IMPORTANTE: substitua pela URL do seu backend no Render.com
// Exemplo: "https://potentia-rh-backend.onrender.com"
const BACKEND_URL = "https://potentia-rh-2-0.onrender.com/";

console.log("PotentIA RH iniciado.");

// =============================================
// TEMA (CLARO / ESCURO)
// =============================================

const btnTema = document.getElementById("btnTema");
let modoClaro = false;

btnTema.addEventListener("click", function () {
  modoClaro = !modoClaro;
  document.body.classList.toggle("light", modoClaro);
  btnTema.textContent = modoClaro ? "🌙" : "☀️";
});

// =============================================
// BOAS-VINDAS
// =============================================

window.addEventListener("load", function () {
  setTimeout(function () {
    alert("Bem-vindo ao PotentIA RH!");
  }, 800);
});

// =============================================
// LOGIN
// =============================================

document.getElementById("formLogin").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  if (!email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  alert("Login realizado com sucesso!");
});

// =============================================
// CADASTRO
// =============================================

const perfisDisponiveis = [
  "Liderança Estratégica",
  "Criativo e Inovador",
  "Analítico e Organizado",
  "Comunicativo e Colaborativo",
  "Executor de Alta Performance",
];

document.getElementById("formCadastro").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("cadNome").value;
  const area = document.getElementById("cadArea").value;
  const habilidades = document.getElementById("cadHabilidades").value;

  if (!nome) {
    alert("Digite seu nome.");
    return;
  }

  const perfilGerado = perfisDisponiveis[Math.floor(Math.random() * perfisDisponiveis.length)];

  // Atualizar perfil
  document.getElementById("perfilNome").textContent = nome;
  document.getElementById("perfilArea").textContent = area || "—";
  document.getElementById("perfilHabilidades").textContent = habilidades || "—";
  document.getElementById("perfilStatus").textContent = "Perfil ativo";

  // Atualizar dashboard
  document.getElementById("dashPerfil").textContent = perfilGerado;
  document.getElementById("dashHab").textContent = habilidades || "—";
  document.getElementById("dashStatus").textContent = "Ativo";
  document.getElementById("dashStatus").style.color = "var(--success)";

  alert("Cadastro realizado com sucesso!");
});

// =============================================
// FORMULÁRIO COMPORTAMENTAL — COMPATIBILIDADE
// =============================================

document.getElementById("formComportamental").addEventListener("submit", function (e) {
  e.preventDefault();

  const pressao = document.getElementById("fPressao").value;
  const equipe = document.getElementById("fEquipe").value;
  const forte = document.getElementById("fForte").value;

  let score = 50;
  if (equipe === "Equipe") score += 20;
  if (equipe === "Ambos") score += 15;
  if (pressao.length > 20) score += 10;
  if (forte.length > 3) score += 10;
  if (score > 100) score = 100;

  document.getElementById("dashComp").textContent = score + "%";
  alert("Compatibilidade calculada: " + score + "%");
});

// =============================================
// EFEITO NOS CARDS DO DASHBOARD
// =============================================

document.querySelectorAll(".dash-item").forEach(function (item) {
  item.addEventListener("mouseenter", function () {
    item.style.transform = "scale(1.03)";
  });
  item.addEventListener("mouseleave", function () {
    item.style.transform = "scale(1)";
  });
});

// =============================================
// ANÁLISE COM IA (via backend no Render.com)
// =============================================

document.getElementById("botaoIA").addEventListener("click", async function () {

  const pressao = document.getElementById("fPressao").value;
  const equipe = document.getElementById("fEquipe").value;
  const forte = document.getElementById("fForte").value;

  if (!pressao) {
    alert("Preencha ao menos a primeira pergunta do formulário.");
    return;
  }

  const botao = document.getElementById("botaoIA");
  const resultado = document.getElementById("resultadoIA");

  // Estado de carregamento
  botao.disabled = true;
  botao.innerHTML = '<div class="dots"><span></span><span></span><span></span></div> Analisando perfil...';

  resultado.innerHTML = `
    <div class="res-box">
      <div class="res-titulo">
        <div class="dots"><span></span><span></span><span></span></div>
        Processando análise com IA...
      </div>
    </div>
  `;

  try {

    const resposta = await fetch(BACKEND_URL + "analisar-ia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pressao: pressao,
        equipe: equipe || "Não informado",
        forte: forte || "Não informado",
      }),
    });

    const dados = await resposta.json();

    if (dados.erro) throw new Error(dados.erro);

    resultado.innerHTML = `
      <div class="res-box">
        <div class="res-titulo">✦ Análise comportamental concluída</div>
        <div class="res-texto">${dados.resultado}</div>
      </div>
    `;

  } catch (erro) {

    resultado.innerHTML = `
      <div class="res-box res-erro">
        <div class="res-titulo">⚠ Erro na análise</div>
        <div class="res-texto">${erro.message}</div>
      </div>
    `;

  }

  // Restaurar botão
  botao.disabled = false;
  botao.innerHTML = "✦ Analisar com IA";

});

console.log("Todos os scripts carregados.");
