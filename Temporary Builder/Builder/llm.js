const fetch = require("node-fetch");

const API_KEY = process.env.OPENROUTER_API_KEY;

async function generate(prompt) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a production DevOps AI that outputs ONLY valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "{}";
}

module.exports = { generate };
