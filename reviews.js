/* UnseenGo AI — Phase 2D traveller reviews */
(function () {
  const client = () => window.unseenGoSupabase || null;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m]));
  const params = new URLSearchParams(location.search);
  const city = params.get('city') || '';

  function stars(n) {
    const rating = Math.max(1, Math.min(5, Number(n) || 0));
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  async function listReviews() {
    const sb = client();
    if (!sb || !city) return [];
    const { data, error } = await sb.from('reviews')
      .select('id,city,place_name,reviewer_name,rating,review_text,created_at')
      .eq('city', city)
      .order('created_at', { ascending: false })
      .limit(30);
    if (error) {
      console.warn('UnseenGo AI: reviews could not be loaded.', error.message);
      return [];
    }
    return data || [];
  }

  function render(reviews) {
    const host = document.getElementById('localReviews');
    if (!host) return;
    if (!reviews.length) {
      host.innerHTML = '<div class="review-empty-state"><span>✦</span><p>No traveller reviews yet. Be the first to share what you discovered.</p></div>';
      return;
    }
    host.innerHTML = reviews.map(r => {
      const date = r.created_at ? new Date(r.created_at).toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' }) : '';
      return `<article class="traveller-review"><div class="review-head"><div class="review-author"><b>${esc(r.reviewer_name)}</b>${r.place_name ? `<small>Visited: ${esc(r.place_name)}</small>` : ''}</div><span class="review-stars" aria-label="${Number(r.rating)} out of 5 stars">${stars(r.rating)}</span></div><p>${esc(r.review_text)}</p><small class="review-date">${esc(date)}</small></article>`;
    }).join('');
  }

  async function refresh() {
    render(await listReviews());
  }

  async function submit(event) {
    event.preventDefault();
    const sb = client();
    const form = document.getElementById('reviewForm');
    const status = document.getElementById('reviewStatus');
    if (!sb) {
      if (status) status.textContent = 'Database connection is not ready. Please refresh the page and try again.';
      return false;
    }
    if (!city) {
      if (status) status.textContent = 'City information is missing from this page.';
      return false;
    }

    const name = document.getElementById('reviewName').value.trim();
    const rating = Number(document.getElementById('reviewRating').value);
    const text = document.getElementById('reviewText').value.trim();
    const place = document.getElementById('reviewPlace')?.value.trim() || null;

    if (name.length < 2 || name.length > 60 || !Number.isInteger(rating) || rating < 1 || rating > 5 || text.length < 10 || text.length > 1000) {
      if (status) status.textContent = 'Please enter a valid name, choose a 1–5 rating, and write 10–1000 characters.';
      return false;
    }

    if (status) status.textContent = 'Publishing your review…';
    const { error } = await sb.from('reviews').insert({
      city,
      place_name: place,
      reviewer_name: name,
      rating,
      review_text: text
    });

    if (error) {
      console.error('UnseenGo AI review insert failed:', error);
      if (status) status.textContent = 'Could not publish the review. Please try again.';
      return false;
    }

    form.reset();
    form.classList.remove('open');
    if (status) status.textContent = 'Review published successfully. Thank you for helping other travellers!';
    await refresh();
    return false;
  }

  function init() {
    const form = document.getElementById('reviewForm');
    if (!form) return;
    form.onsubmit = submit;
    refresh();
  }

  window.UnseenGoReviews = { refresh, submit };

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
  window.addEventListener('unseengo:supabase-ready', refresh);
})();
