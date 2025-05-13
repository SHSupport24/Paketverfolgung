export default async function handler(req, res) {
  const { carrier_code, tracking_number } = req.query;

  const TRACKINGMORE_API_KEY = 'xlogsga5-8jha-ch20-l4re-nqd4k9fphxxh';
  const headers = {
    'Content-Type': 'application/json',
    'Tracking-Api-Key': TRACKINGMORE_API_KEY,
  };

  const carrierMap = {
    'dhl': 'dhl',
    'dhl-express': 'dhl',
    'ups': 'ups',
    'dpd': 'dpd',
    'gls': 'gls',
  };

  const mappedCarrier = carrierMap[carrier_code];

  if (!mappedCarrier || !tracking_number) {
    return res.status(400).json({ error: 'Ungültige Parameter' });
  }

  try {
    // 1. Tracking-Objekt anlegen mit zusätzlichem Ziel-Land
    const postResponse = await fetch('https://api.trackingmore.com/v4/trackings', {

      method: 'POST',
      headers,
      body: JSON.stringify({
        tracking_number,
        carrier_code: mappedCarrier,
        destination_code: 'DE',
        language: 'de',
      }),
    });

    const postData = await postResponse.json();

    // Überprüfe, ob die POST-Anfrage erfolgreich war
    if (postResponse.status !== 200 || !postData || postData.error) {
      return res.status(500).json({ error: 'Fehler beim Senden der Tracking-Nummer', raw: postData });
    }

    // 2. Status abfragen
    const statusRes = await fetch(`https://api.trackingmore.com/v4/trackings/${mappedCarrier}/${tracking_number}`, {
      method: 'GET',
      headers,
    });

    const statusData = await statusRes.json();

    // Überprüfe die Antwortstruktur
    if (!statusData || !statusData.data || !statusData.data.tracking_info) {
      return res.status(500).json({ error: 'Keine Tracking-Daten gefunden' });
    }

    // 3. Status interpretieren
    const trackingStatus = statusData.data.tracking_info.status || 'unknown';

    const statusMapping = {
      'delivered': 'Zugestellt',
      'transit': 'Unterwegs',
      'exception': 'Problem',
      'pending': 'Ausstehend',
      'notfound': 'Ausstehend',
      'expired': 'Abgelaufen',
      'unknown': 'Unbekannt',
    };

    const germanStatus = statusMapping[trackingStatus.toLowerCase()] || 'Unbekannt';

    return res.status(200).json({ status: germanStatus });

  } catch (err) {
    return res.status(500).json({ error: 'Tracking API Fehler', raw: err.message });
  }
}
