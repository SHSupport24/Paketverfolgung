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
    // 1. Sendung bei TrackingMore registrieren
    const registerResponse = await fetch('https://api.trackingmore.com/v4/trackings', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        tracking_number,
        carrier_code: mappedCarrier,
        destination_code: 'DE',
        language: 'de',
      }),
    });

    const registerData = await registerResponse.json();

    // 4016 = Bereits vorhanden -> kein Fehler
    if (
      registerData.meta.code !== 200 &&
      registerData.meta.code !== 4016
    ) {
      return res.status(500).json({
        error: 'Fehler beim Registrieren der Sendung',
        raw: registerData,
      });
    }

    // 2. Trackingdaten abrufen
    const statusResponse = await fetch(
      `https://api.trackingmore.com/v4/trackings/get?carrier_code=${mappedCarrier}&tracking_number=${tracking_number}`,
      {
        method: 'GET',
        headers,
      }
    );

    const statusData = await statusResponse.json();

    if (
      !statusData ||
      !statusData.data ||
      !statusData.data.tracking_info
    ) {
      return res.status(404).json({
        error: 'Keine Tracking-Daten gefunden',
        raw: statusData,
      });
    }

    const trackingStatus = statusData.data.tracking_info.status || 'unknown';

    const statusMapping = {
      delivered: 'Zugestellt',
      transit: 'Unterwegs',
      exception: 'Problem',
      pending: 'Ausstehend',
      notfound: 'Ausstehend',
      expired: 'Abgelaufen',
      unknown: 'Unbekannt',
    };

    const germanStatus = statusMapping[trackingStatus.toLowerCase()] || 'Unbekannt';

    return res.status(200).json({ status: germanStatus });
  } catch (err) {
    return res.status(500).json({
      error: 'Tracking API Fehler',
      raw: err.message,
    });
  }
}
