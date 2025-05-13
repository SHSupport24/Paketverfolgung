export default async function handler(req, res) {
  const { carrier_code, tracking_number } = req.query;

  if (!carrier_code || !tracking_number) {
    return res.status(400).json({ error: 'Fehlende Parameter' });
  }

  const apiKey = process.env.TRACKINGMORE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API-Key nicht gesetzt' });
  }

  try {
    const response = await fetch(`https://api.trackingmore.com/v4/trackings/get?carrier_code=${carrier_code}&tracking_number=${tracking_number}`, {
      method: 'GET',
      headers: {
        'Tracking-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    const text = await response.text();

    // Wenn keine gültige JSON-Antwort → Fehler zurückgeben
    try {
      const result = JSON.parse(text);
      const status = result.data?.items?.[0]?.status || 'unbekannt';
      return res.status(200).json({ status });
    } catch (jsonErr) {
      return res.status(500).json({ error: 'Ungültige Antwort von Tracking-API', raw: text });
    }

  } catch (error) {
    return res.status(500).json({ error: 'Serverfehler bei API-Anfrage', details: error.message });
  }
}
