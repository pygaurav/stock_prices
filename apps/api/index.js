import express from "express";
import cors from "cors";
import { redisClient } from "@repo/lib-redis";

const app = express();
const PORT = 3000;
app.use(cors());

app.get("/stock_prices", async (req, res) => {
  const latestStockPrice = await redisClient.get('latestStockPrices');
  res.send({ message: JSON.parse(latestStockPrice) });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
