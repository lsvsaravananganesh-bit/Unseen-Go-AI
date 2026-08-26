window.UnseenGoAI = {
  async createItinerary(payload) {
    const response = await fetch('/api/ai-itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'AI itinerary unavailable');
    return data;
  }
};
