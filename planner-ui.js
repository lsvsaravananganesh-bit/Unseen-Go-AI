/* UnseenGo AI — planner UI adapter */
(function () {
  'use strict';

  const byId = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>\"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function showMessage(message, type = 'info') {
    let box = byId('plannerMessage');
    if (!box) {
      box = document.createElement('p');
      box.id = 'plannerMessage';
      box.className = 'note';
      byId('generate')?.insertAdjacentElement('afterend', box);
    }
    box.textContent = message;
    box.dataset.type = type;
  }

  function populateCities() {
    const citySelect = byId('city');
    if (!citySelect || !window.UnseenGoAI) return;

    const names = window.UnseenGoAI.getCityNames();
    citySelect.replaceChildren();

    if (!names.length) {
      const option = document.createElement('option');
      option.textContent = 'No destination data available';
      option.disabled = true;
      option.selected = true;
      citySelect.appendChild(option);
      return;
    }

    names.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });

    if (names.includes('Kurnool')) citySelect.value = 'Kurnool';
  }

  function renderResult(result) {
    const results = byId('results');
    const recommendations = byId('recommendations');
    const itinerary = byId('itinerary');
    const mapLink = byId('mapLink');

    if (!result.recommendations.length) {
      recommendations.replaceChildren();
      itinerary.replaceChildren();
      results.classList.remove('show');
      showMessage(result.summary, 'warning');
      return;
    }

    byId('resultTitle').textContent = `${result.city} · hidden gems`;
    byId('resultSummary').textContent = result.summary;

    recommendations.innerHTML = result.recommendations.map(place => `
      <article class="place">
        <span class="category">${esc(place.category)}</span>
        <h3>${esc(place.name)}</h3>
        <small>${esc(place.location)}</small>
        <p>${esc(place.description)}</p>
        <div class="score">${place.unseenScore}<small>/100 UnseenGo Score</small></div>
      </article>
    `).join('');

    itinerary.innerHTML = result.itinerary.map(day => `
      <article class="day">
        <h3>DAY ${day.day}</h3>
        ${day.places.map(place => `
          <div class="day-place">
            <span><b>${esc(place.name)}</b><br><small>${esc(place.category)} · ${esc(place.location)}</small></span>
            <strong>${place.unseenScore}</strong>
          </div>
        `).join('')}
      </article>
    `).join('');

    mapLink.href = result.mapsUrl;
    mapLink.hidden = result.mapsUrl === '#';
    results.classList.add('show');
    showMessage(
      result.actualDays < result.requestedDays
        ? `This city currently has enough verified records for ${result.actualDays} practical itinerary day(s). Add more destination records to unlock ${result.requestedDays} days.`
        : 'Plan generated from the current city destination dataset using the transparent UnseenGo scoring model.',
      'info'
    );
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function init() {
    const citySelect = byId('city');
    const generate = byId('generate');
    if (!citySelect || !generate || !window.UnseenGoAI) return;

    populateCities();

    generate.addEventListener('click', () => {
      const interests = [...document.querySelectorAll('.interest input:checked')].map(input => input.value);
      const city = citySelect.value;
      const days = Number(byId('days').value);
      const budget = byId('budget').value;
      const pace = byId('pace').value;

      if (!city) {
        showMessage('Please choose a destination city first.', 'warning');
        return;
      }
      if (!Number.isInteger(days) || days < 1 || days > 14) {
        showMessage('Trip duration must be between 1 and 14 days.', 'warning');
        return;
      }

      generate.disabled = true;
      generate.textContent = '✦ Building your plan…';
      try {
        const result = window.UnseenGoAI.generate(city, { days, budget, pace, interests });
        renderResult(result);
      } catch (error) {
        console.error('UnseenGo planner error:', error);
        showMessage('We could not build this plan. Please try another city or refresh the page.', 'error');
      } finally {
        generate.disabled = false;
        generate.textContent = '✦ Generate my hidden-gem trip';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
