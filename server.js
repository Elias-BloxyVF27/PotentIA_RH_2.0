// =============================================
// POTENTIA RH — SERVER.JS
// Deploy no Render.com
// =============================================

const Anthropic = require("@anthropic-ai/sdk");
const express   = require("express");
const cors      = require("cors");

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
// ROTA — ANÁLISE COM IA (Claude)
// =============================================

app.post("/analisar-ia", async (req, res) => {

  const { pressao, equipe, forte } = req.body;

  if (!pressao) {
    return res.status(400).json({ erro: "Campo 'pressao' é obrigatório." });
  }

  try {

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

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

    const mensagem = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [
        { role: "user", content: prompt }
      ],
    });

    const resultado = mensagem.content[0].text;

    res.json({ resultado });

  } catch (erro) {

    console.error("Erro na API do Claude:", erro.message);

    res.status(500).json({ erro: "Erro ao processar análise com IA." });

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
