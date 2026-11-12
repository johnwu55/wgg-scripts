/* West Grand Garden · Weather card, variant B (tent score) (Open-Meteo, no key needed) */
/* Same live forecast as the standard card, plus a "tent verdict" per day by rain probability:
   <30% Perfect tent day · 30–70% OK — add sidewalls · >70% Rainy day */
(function () {
  var root = document.getElementById('wgg-weather');
  if (!root) return;
  var body = root.querySelector('.wgg-wx-body');
  if (!body) return;

  var LAT = 49.2827, LON = -123.1207; /* Vancouver, BC */
  var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + LAT + '&longitude=' + LON +
    '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
    '&timezone=America%2FVancouver&forecast_days=7';

  function label(code) {
    if (code === 0) return 'Clear';
    if (code === 1) return 'Mostly clear';
    if (code === 2) return 'Partly cloudy';
    if (code === 3) return 'Overcast';
    if (code === 45 || code === 48) return 'Foggy';
    if (code === 51 || code === 53 || code === 55) return 'Drizzle';
    if (code === 56 || code === 57) return 'Freezing drizzle';
    if (code >= 61 && code <= 65) return 'Rain';
    if (code === 66 || code === 67) return 'Freezing rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Showers';
    if (code === 85 || code === 86) return 'Snow showers';
    if (code === 95) return 'Thunderstorm';
    return '—';
  }

  var S = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
  var ICONS = {
    sun: S + '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    partly: S + '<circle cx="8" cy="8" r="3"/><path d="M8 2.4v1.5M8 12.1v1.5M2.4 8h1.5M12.1 8h1.5M4.1 4.1l1 1M11 11l1 1"/><path d="M10 20h7a3 3 0 0 0 .8-5.9A4.5 4.5 0 0 0 9.5 15 2.8 2.8 0 0 0 10 20z"/></svg>',
    cloud: S + '<path d="M7 19h10a3.5 3.5 0 0 0 .8-6.9A5 5 0 0 0 8.2 13 3 3 0 0 0 7 19z"/></svg>',
    rain: S + '<path d="M7 15h10a3.5 3.5 0 0 0 .8-6.9A5 5 0 0 0 8.2 9 3 3 0 0 0 7 15z"/><path d="M9 18l-1 2.5M13 18l-1 2.5M17 18l-1 2.5"/></svg>',
    snow: S + '<path d="M7 15h10a3.5 3.5 0 0 0 .8-6.9A5 5 0 0 0 8.2 9 3 3 0 0 0 7 15z"/><path d="M9 18.5h.01M13 18.5h.01M17 18.5h.01M11 21h.01M15 21h.01"/></svg>',
    storm: S + '<path d="M7 15h10a3.5 3.5 0 0 0 .8-6.9A5 5 0 0 0 8.2 9 3 3 0 0 0 7 15z"/><path d="M13 15l-2.5 4.5H13L11 22"/></svg>',
    fog: S + '<path d="M7 14h10a3.5 3.5 0 0 0 .8-6.9A5 5 0 0 0 8.2 8 3 3 0 0 0 7 14z"/><path d="M5 18h13M7 21h9"/></svg>'
  };

  function iconFor(code) {
    if (code === 0 || code === 1) return ICONS.sun;
    if (code === 2) return ICONS.partly;
    if (code === 3) return ICONS.cloud;
    if (code === 45 || code === 48) return ICONS.fog;
    if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return ICONS.rain;
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return ICONS.snow;
    if (code === 95) return ICONS.storm;
    return ICONS.cloud;
  }

  function dayName(iso, i) {
    if (i === 0) return 'Today';
    return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
  }

  function verdict(rain) {
    if (rain === null || rain === undefined) return { text: 'No data', cls: 'wgg-wx-v-none' };
    if (rain < 30) return { text: 'Perfect tent day', cls: 'wgg-wx-v-good' };
    if (rain <= 70) return { text: 'OK — add sidewalls', cls: 'wgg-wx-v-ok' };
    return { text: 'Rainy day', cls: 'wgg-wx-v-bad' };
  }

  fetch(url).then(function (r) {
    if (!r.ok) throw new Error('weather unavailable');
    return r.json();
  }).then(function (d) {
    var c = d.current, dy = d.daily;
    var today = verdict(dy.precipitation_probability_max[0]);
    var html = '';
    html += '<div class="wgg-wx-now">';
    html += '<div class="wgg-wx-temp">' + Math.round(c.temperature_2m) + '°</div>';
    html += '<div class="wgg-wx-cond"><span class="wgg-wx-ic">' + iconFor(c.weather_code) + '</span><span>' + label(c.weather_code) + '</span></div>';
    html += '<div class="wgg-wx-meta">Wind ' + Math.round(c.wind_speed_10m) + ' km/h &nbsp;·&nbsp; Humidity ' + Math.round(c.relative_humidity_2m) + '%</div>';
    html += '<span class="wgg-wx-verdict ' + today.cls + '">' + today.text + '</span>';
    html += '</div>';
    html += '<div class="wgg-wx-days">';
    for (var i = 0; i < dy.time.length; i++) {
      var rain = dy.precipitation_probability_max[i];
      var v = verdict(rain);
      html += '<div class="wgg-wx-day">';
      html += '<span class="wgg-wx-dname">' + dayName(dy.time[i], i) + '</span>';
      html += '<span class="wgg-wx-dicon">' + iconFor(dy.weather_code[i]) + '</span>';
      html += '<span class="wgg-wx-dtemp">' + Math.round(dy.temperature_2m_max[i]) + '° / ' + Math.round(dy.temperature_2m_min[i]) + '°</span>';
      html += '<span class="wgg-wx-drain">' + (rain === null || rain === undefined ? '—' : rain + '% rain') + '</span>';
      html += '<span class="wgg-wx-verdict ' + v.cls + '">' + v.text + '</span>';
      html += '</div>';
    }
    html += '</div>';
    body.innerHTML = html;
  }).catch(function () {
    body.innerHTML = '<p class="wgg-wx-fallback">Weather is unavailable right now. Please check back soon.</p>';
  });
})();
