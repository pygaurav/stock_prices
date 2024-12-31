import { createConsumer } from "@repo/lib-kafka";
import { TOPICS } from "@repo/lib-constants";
import { redisClient } from "@repo/lib-redis";

const consumeMessages = async () => {
  const consumer = createConsumer("client");
  const BATCH_SIZE = 100;  // Adjust based on your needs
  const BATCH_INTERVAL = 1000;  // Flush every 1 second
  
  // Initialize Redis with empty object
  await redisClient.set('latestStockPrices', JSON.stringify({}));
  
  // Initialize batch processing
  let batch = [];
  let batchTimer = null;

  // Function to process batch
  const processBatch = async () => {
    if (batch.length === 0) return;

    try {
      // Get current state once
      const currentData = JSON.parse(await redisClient.get('latestStockPrices') || '{}');
      
      // Update all symbols in memory
      batch.forEach(priceData => {
        currentData[priceData.symbol] = priceData;
      });

      // Single Redis write for all updates
      await redisClient.set('latestStockPrices', JSON.stringify(currentData));
      
      console.log(`Processed batch of ${batch.length} stock updates`);
      batch = [];
    } catch (error) {
      console.error('Error processing batch:', error);
    }
  };

  // Connect to Kafka
  await consumer.connect();
  await consumer.subscribe({ topic: TOPICS.stockUpdates, fromBeginning: false });

  // Start the consumer
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const priceData = JSON.parse(message.value.toString());
        batch.push(priceData);

        // Process batch if we hit the size threshold
        if (batch.length >= BATCH_SIZE) {
          await processBatch();
        }

        // Reset the timer whenever we receive a message
        if (batchTimer) {
          clearTimeout(batchTimer);
        }

        // Set new timer to process pending messages
        batchTimer = setTimeout(processBatch, BATCH_INTERVAL);

      } catch (error) {
        console.error('Error processing message:', error);
      }
    },
  });

  // Cleanup function
  const cleanup = async () => {
    if (batchTimer) {
      clearTimeout(batchTimer);
    }
    await processBatch(); // Process any remaining messages
    await consumer.disconnect();
  };

  // Handle graceful shutdown
  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);
};

await consumeMessages();