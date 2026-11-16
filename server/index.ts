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


// Prüft die Erreichbarkeit unserer ComfyUI-Engine.
// Keine Bildgenerierung und kein Modell-Download.
app.get('/api/comfyui-status', async (_req, res) => {
  const comfyUrl =
    process.env.COMFYUI_URL ??
    'http://127.0.0.1:8188';

  try {
    const response = await fetch(
      new URL('/system_stats', comfyUrl),
      {
        signal: AbortSignal.timeout(5000)
      }
    );

    if (!response.ok) {
      throw new Error('ComfyUI antwortet nicht korrekt');
    }

    res.json({
      success: true,
      engine: 'comfyui',
      status: 'online'
    });

  } catch {
    res.status(503).json({
      success: false,
      engine: 'comfyui',
      status: 'offline'
    });
  }
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
