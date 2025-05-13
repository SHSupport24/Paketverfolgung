window.TrelloPowerUp.initialize({
  'card-buttons': function(t, options) {
    return [{
      text: 'Sendung verfolgen',
      callback: function(t) {
        return t.popup({
          title: 'Sendung verfolgen',
          url: './tracking.html',
          height: 250
        });
      }
    }];
  },
  'card-badges': function(t, options) {
    return t.get('card', 'shared', 'trackingStatus')
      .then(function(status) {
        if (!status) return [];
        let color = 'orange';
        if (status === 'Zugestellt') color = 'green';
        if (status === 'Ausstehend') color = 'red';
        return [{
          text: status,
          color: color
        }];
      });
  }
});
