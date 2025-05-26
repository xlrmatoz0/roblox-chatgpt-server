const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_KEY}`,
        }
      }
    );
    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI error:", err.response?.data || err.message);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
