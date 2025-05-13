const axios = require('axios');

module.exports = async (req, res) => {
  const { carrier_code, tracking_number } = req.query;

  if (!carrier_code || !tracking_number) {
    return res.status(400).json({ error: 'carrier_code und tracking_number erforderlich' });
  }

  try {
    const response = await axios.get('https://api.trackingmore.com/v4/trackings/get', {
      headers: {
        'Tracking-Api-Key': process.env.TRACKINGMORE_API_KEY,
        'Content-Type': 'application/json',
      },
      params: {
        carrier_code,
        tracking_number,
      },
    });

    const tracking = response.data.data;

    res.status(200).json({
      status: tracking.status,
      expected_delivery: tracking.expected_delivery,
      last_update: tracking.lastEventTime,
    });
  } catch (err) {
    res.status(500).json({ error: 'Fehler bei TrackingMore', details: err.message });
  }
};
