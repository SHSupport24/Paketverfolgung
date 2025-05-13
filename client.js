/* global TrelloPowerUp */

// Trello Power-Up Client initialisieren
var t = TrelloPowerUp.iframe();

// Beispielhafte Status-Daten (hier später Tracking-Daten integrieren)
let trackingData = {};

// Öffnet das Eingabefenster, wenn der Button geklickt wird
window.openTrackingPopup = function (t) {
  return t.popup({
    title: 'Sendung verfolgen',
    url: './tracking.html',
    height: 250,
  });
};

// Liefert ein Badge für den Kartenstatus (z. B. "Ausstehend", "Zugestellt", Lieferdatum)
window.getStatusBadge = function (t, options) {
  return t.get('card', 'shared', 'trackingStatus')
    .then(status => {
      if (!status) {
        return [];
      }

      let color = 'orange';
      if (status === 'Zugestellt') color = 'green';
      if (status === 'Ausstehend') color = 'red';

      return [{
        text: status,
        color: color,
        icon: null
      }];
    });
};

// Speichert Trackingdaten (diese Funktion kann z. B. in tracking.html verwendet werden)
window.saveTrackingStatus = function (status) {
  return t.set('card', 'shared', 'trackingStatus', status);
};
