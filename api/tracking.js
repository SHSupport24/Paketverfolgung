const carrierMap = {
  'dhl': 'dhl-germany',
  'dhl-express': 'dhl',
  'ups': 'ups',
  'dpd': 'dpd',
  'gls': 'gls',
};

export default async function handler(req, res) {
  const { carrier_code, tracking_number } = req.query;

  if (!carrier_code || !tracking_number) {
    return res.status(400).json({ error: 'Fehlende Parameter' });
  }

  const mappedCarrier = carrierMap[carrier_code.toLowerCase()];
  if (!mappedCarrier) {
    return res.status(400).json({ error: 'Ungültiger Carrier-Code' });
  }

  const apiKey = process.env.TRACKINGMORE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API-Key fehlt' });
  }

  const headers = {
    'Tracking-Api-Key': apiKey,
    'Content-Type': 'application/json',
  };

  try {
    // Schritt 1: Tracking anlegen (ignoriere Fehler, falls es schon existiert)
    await fetch('https://api.trackingmore.com/v4/trackings/create', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        tracking_number,
        carrier_code: mappedCarrier,
      }),
    });

    // Schritt 2: Status abrufen
    const url = `https://api.trackingmore.com/v4/trackings/${mappedCarrier}/${tracking_number}`;
    const response = await fetch(url, {
      method: 'GET',
      headers,
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
