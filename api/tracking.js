export default async function handler(req, res) {
  const apiKey = process.env.TRACKINGMORE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API-Key fehlt' });
  }

  try {
    const response = await fetch('https://api.trackingmore.com/v4/trackings/get', {
      method: 'POST',
      headers: {
        'Tracking-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        carrier_code: 'dhl',
        tracking_number: '616561107463',
      }),
    });

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Fehler bei Fetch', details: error.message });
  }
}
