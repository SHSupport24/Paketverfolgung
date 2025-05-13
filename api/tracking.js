export default async function handler(req, res) {
  const { carrier_code, tracking_number } = req.query;

  if (!carrier_code || !tracking_number) {
    return res.status(400).json({ error: 'Fehlende Parameter' });
  }

  const apiKey = process.env.TRACKINGMORE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API-Key fehlt' });
  }

  try {
    const url = `https://api.trackingmore.com/v4/trackings/${carrier_code}/${tracking_number}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Tracking-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok || data.meta?.code !== 200) {
      return res.status(500).json({ error: 'Tracking API Fehler', raw: data });
    }

    const status = data.data?.status || 'unbekannt';
    return res.status(200).json({ status });

  } catch (error) {
    return res.status(500).json({ error: 'Serverfehler', details: error.message });
  }
}
