// const API_KEY='d1jla29r01qvg5gv8j40d1jla29r01qvg5gv8j4g' // Ashish's token
const API_KEY = 'd1hqgb1r01qsvr2bqhc0d1hqgb1r01qsvr2bqhcg';
const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

// List of tickers shown on the page
// const tickers = Array.from(document.querySelectorAll('.ticker')).map(el => el.innerText);
const tickers = Array.from(document.querySelectorAll('.ticker')).map(el => el.innerText.trim()).slice(0, 10);
// Subscribe to all tickers

  console.log(tickers);
socket.addEventListener('open', function () {
    tickers.forEach(ticker => {
    socket.send(JSON.stringify({ type: 'subscribe', symbol: ticker }));
  });
});

// Update price on message
socket.addEventListener('message', function (event) {
  const data = JSON.parse(event.data);
  console.log(data.data[0]);
  if (data.type === 'trade') {
    data.data.forEach(trade => {
      const { s: symbol, p: price } = trade;
      const priceElement = document.getElementById(`price-${symbol}`);
      if (priceElement) {
        priceElement.textContent = `$${price.toFixed(2)}`;
      }
    });
  }
});

// Gracefully unsubscribe when leaving page
window.addEventListener('beforeunload', () => {
  tickers.forEach(ticker => {
    socket.send(JSON.stringify({ type: 'unsubscribe', symbol: ticker }));
  });
  socket.close();
});
