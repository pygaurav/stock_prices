import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    async function getStockPrices() {
      const response = await fetch("http://localhost:3000/stock_prices");
      const reply = await response.json();
      console.log(Object.values(reply.message));
      setStocks(Object.values(reply.message));
    }
    setInterval(() => {
      getStockPrices();
    }, 1000);
  }, []);

  return (
    <>
      <div style={{ display: "flex", gap: 20 }}>
        {stocks.map(({ symbol, price }) => (
          <div
            style={{ border: "1px solid rgb(46, 46, 46)", borderRadius:'5px', background:'rgb(27, 27, 27)', padding: "20px", width: '100px' }}
            key={symbol}
          >
            <div style={{ fontWeight: "bold", textAlign: 'left'}}>{symbol}</div>
            <div style={{maxWidth: '40px', fontSize: '14px', textAlign: 'left'}}>${price}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;