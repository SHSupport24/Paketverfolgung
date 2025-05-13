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
    const response = await fetch('https://api.trackingmore.com/v4/trackings/get', {
      method: 'POST',
      headers: {
        'Tracking-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        carrier_code: carrier_code,
        tracking_number: tracking_number,
      }),
    });

    const json = await response.json();

    if (!response.ok || json.meta?.code !== 200) {
      return res.status(500).json({ error: 'Tracking API Fehler', raw: json });
    }

    const status = json.data?.items?.[0]?.status || 'unbekannt';
    return res.status(200).json({ status });

  } catch (error) {
    return res.status(500).json({ error: 'Serverfehler bei API-Anfrage', details: error.message });
