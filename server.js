// =============================================
// POTENTIA RH — SERVER.JS
// Deploy no Render.com — IA: Google Gemini
// =============================================

const express = require("express");
const cors    = require("cors");

const app  = express();
const PORT = process.env.PORT || 3000;

// =============================================
// CONFIGURAÇÃO
// =============================================

app.use(cors());
app.use(express.json());

// =============================================
// ROTA PRINCIPAL
// =============================================

app.get("/", (req, res) => {
  res.json({ status: "PotentIA RH Backend funcionando!" });
});

// =============================================
// ROTA — ANÁLISE COM IA (Google Gemini)
// =============================================

app.post("/analisar-ia", async (req, res) => {

  const { pressao, equipe, forte } = req.body;

  if (!pressao) {
    return res.status(400).json({ erro: "Campo 'pressao' é obrigatório." });
  }

  // Verificar se a chave está configurada
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY não está configurada no Render.");
    return res.status(500).json({ erro: "Chave da IA não configurada no servidor." });
  }

  const prompt = `Você é um especialista em Recursos Humanos e psicologia organizacional.

Analise o seguinte perfil comportamental de candidato:

- Como reage sob pressão: "${pressao}"
- Preferência de trabalho: "${equipe}"
- Principal ponto forte: "${forte}"

Forneça uma análise profissional estruturada com os seguintes tópicos:

1. Perfil Comportamental — Qual é o perfil predominante deste candidato?
2. Pontos Fortes — Quais são os principais diferenciais identificados?
3. Compatibilidade Profissional — Quais áreas ou cargos seriam ideais?
4. Recomendação Final — Uma avaliação objetiva e construtiva.

Seja direto, profissional e use linguagem acessível. Responda em português.`;

  try {

    const resposta = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const dados = await resposta.json();

    // Verificar se o Gemini retornou erro
    if (dados.error) {
      console.error("Erro retornado pelo Gemini:", JSON.stringify(dados.error));
      return res.status(500).json({ erro: "Erro da API do Gemini: " + dados.error.message });
    }

    // Verificar se a resposta tem o formato esperado
    if (!dados.candidates || !dados.candidates[0]) {
      console.error("Resposta inesperada do Gemini:", JSON.stringify(dados));
      return res.status(500).json({ erro: "Resposta inválida do Gemini." });
    }

    const resultado = dados.candidates[0].content.parts[0].text;

    res.json({ resultado });

  } catch (erro) {

    console.error("Erro na requisição ao Gemini:", erro.message);
    res.status(500).json({ erro: "Erro ao processar análise com IA: " + erro.message });

  }

});

// =============================================
// CANDIDATOS (banco em memória)
// =============================================

let candidatos = [];

app.post("/candidatos", (req, res) => {
  const { nome, email, cidade, habilidades, area } = req.body;
  if (!nome || !email) return res.status(400).json({ erro: "Nome e e-mail obrigatórios." });
  const novo = { id: candidatos.length + 1, nome, email, cidade, habilidades, area };
  candidatos.push(novo);
  res.status(201).json({ mensagem: "Candidato cadastrado!", candidato: novo });
});

app.get("/candidatos", (req, res) => {
  res.json(candidatos);
});

// =============================================
// INICIAR SERVIDOR
// =============================================

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
