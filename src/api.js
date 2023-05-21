/* eslint-disable prettier/prettier */
const API_KEY =
  "c544957142d2219ff2f3f7ec8ac88c46a0bd89f875d83503d19a4931285c9baf";
const tickersHandlers = new Map();

const loadTickers = () => {
  if (tickersHandlers.size === 0) {
    return;
  }

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickersHandlers.keys(),
    ].join(",")}&tsyms=USD&api_key=${API_KEY}`
  )
    .then((res) => res.json())
    .then((rawData) => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );
      Object.keys(updatedPrices).forEach(([curr, newPrice]) => {
        const handlers = tickersHandlers.get(curr) || [];
        handlers.forEach(fn => fn(newPrice))
      })
    });
};

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker)
};

setInterval(loadTickers, 5000);
