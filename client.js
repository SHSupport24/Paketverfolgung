window.TrelloPowerUp.initialize({
    'card-buttons': function (t, options) {
      return [{
        text: 'Sendung verfolgen',
        callback: function (t) {
          return t.popup({
            title: 'Trackingnummer eingeben',
            url: './index.html',
            height: 200
          });
        }
      }];
    },
    'card-badges': function (t, options) {
      return t.get('card', 'shared', 'trackingInfo')
        .then(function (info) {
          if (info && info.status) {
            return [{
              text: info.status,
              color: info.status === "Zugestellt" ? "green" : "orange"
            }];
          }
          return [];
        });
    }
  });
  
  const t = TrelloPowerUp.iframe();
  
  t.render(() => {
    const container = document.getElementById('app');
    container.innerHTML = `
      <label>Paketdienst:
        <input type="text" id="dienst" />
      </label><br/>
      <label>Trackingnummer:
        <input type="text" id="nummer" />
      </label><br/>
      <button id="save">Speichern</button>
    `;
  
    document.getElementById('save').addEventListener('click', async () => {
      const carrier = document.getElementById('dienst').value;
      const tracking = document.getElementById('nummer').value;
      const status = "Ausstehend"; // Später ersetzen durch echten API-Status
  
      await t.set('card', 'shared', { trackingInfo: { carrier, tracking, status } });
      t.closePopup();
    });
  });
  