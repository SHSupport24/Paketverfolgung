/* global TrelloPowerUp */
var t = TrelloPowerUp.iframe();

window.openTrackingPopup = function (t) {
  return t.popup({
    title: 'Sendung verfolgen',
    url: './tracking.html',
    height: 250,
  });
};

window.getStatusBadge = function (t, options) {
  return t.get('card', 'shared', 'trackingStatus')
    .then(status => {
      if (!status) return [];

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
