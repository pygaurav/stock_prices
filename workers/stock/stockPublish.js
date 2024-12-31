import { producer, admin } from "@repo/lib-kafka";
import { TOPICS } from "@repo/lib-constants";

// List of simulated stock symbols
const stockSymbols = [
  "AAPL",
  "GOOGL",
  "AMZN",
  "TSLA",
  "MSFT",
  "NFLX",
  "FB",
  "NVDA",
  "SPY",
  "BABA",
];

// Base prices for the symbols
const basePrices = {
  AAPL: 150,
  GOOGL: 2800,
  AMZN: 3500,
  TSLA: 800,
  MSFT: 300,
  NFLX: 600,
  FB: 350,
  NVDA: 200,
  SPY: 400,
  BABA: 160,
};

// Function to fluctuate all symbols at once
function fluctuateAllStocks() {
  // Generate a random fluctuation value to be applied to all stocks
  const fluctuation = (Math.random() - 0.5) * 10; // Random fluctuation between -5 to 5 for all stocks

  // Create a message for each stock symbol
  let messages = stockSymbols.map((symbol) => {
    const newPrice = (basePrices[symbol] + fluctuation).toFixed(2);
    return {
      symbol: symbol,
      price: newPrice,
      timestamp: new Date().toISOString(),
    };
  });

  return messages;
}

(async function () {
  await admin.connect();
  const existingTopics = await admin.listTopics();
  if (!existingTopics.includes(TOPICS.stockUpdates)) {
    await admin.createTopics({
      topics: [
        {
          topic: TOPICS.stockUpdates,
          numPartitions: 1,
          replicationFactor: 1,
        },
      ],
    });
  }
  await producer.connect();

  setInterval(async () => {
    const messages = fluctuateAllStocks();
    const kafkaMessages = messages.map((msg) => ({
      value: JSON.stringify(msg), // Converting the message to string
    }));
    await producer.send({
      topic: TOPICS.stockUpdates,
      messages: kafkaMessages,
    });
  }, 100);
})();
