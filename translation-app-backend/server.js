// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;
const apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
const apiKey = 'AIzaSyD1bCkgsZEZCaV3eJbb5Ec_ITAuDNOPG84'; // Thay thế với API key của bạn từ Google Console

app.use(cors());
app.use(express.json());

app.post('/translate', async (req, res) => {
  const { text, language } = req.body;

  const headers = {
    'Content-Type': 'application/json',
  };

  const data = {
    contents: [
      {
        parts: [
          { text: `Translate the following text to ${language}: ${text}` },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(`${apiEndpoint}?key=${apiKey}`, data, { headers });
    const { candidates } = response.data;
    if (candidates && candidates.length > 0) {
      const translatedText = candidates[0].content.parts[0].text;
      res.json({ translated_text: translatedText });
    } else {
      res.status(400).json({ error: 'No translation generated' });
    }
  } catch (error) {
    console.error('Translation Error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
