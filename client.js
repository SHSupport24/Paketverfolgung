/* global TrelloPowerUp */
const t = TrelloPowerUp.iframe();

window.openTrackingPopup = function (t) {
  return t.popup({
    title: 'Sendungsverfolgung',
    url: './tracking.html',
    height: 300
  });
};

window.getStatusBadge = function (t) {
  return t.get('card', 'shared', 'trackingStatus')
    .then(status => {
      if (!status) return [];

      let color = 'yellow';
      if (status === 'Zugestellt') color = 'green';
      if (status === 'Ausstehend') color = 'red';

      return [{
        text: status,
        color: color
      }];
    });
};
