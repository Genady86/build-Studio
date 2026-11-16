import express from 'express';

const app = express();
const PORT = 8787;

// JSON-Anfragen verarbeiten
app.use(express.json({ limit: '1mb' }));

// Test: Ist unser Backend erreichbar?
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    project: 'GENA Bild-Studio',
    version: '1.1.0',
    backend: 'online',
    generator: 'not_connected'
  });
});

// Spätere Bildgenerierung: noch deaktiviert
app.post('/api/generate', (_req, res) => {
  res.status(503).json({
    success: false,
    error: 'KI-Backend noch nicht verbunden'
  });
});

// Nur lokal erreichbar, nicht öffentlich
app.listen(PORT, '127.0.0.1', () => {
  console.log('GENA API gestartet');
  console.log(`http://127.0.0.1:${PORT}/api/health`);
});
