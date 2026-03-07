import express from "express";
import { createServer as createViteServer } from "vite";
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new (YahooFinance as any)();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes for metal prices
  app.get("/api/prices", async (req, res) => {
    try {
      const symbols = ['GC=F', 'SI=F', 'PL=F', 'PA=F'];
      const results = await yahooFinance.quote(symbols) as any[];

      // Fetch historical data for Gold (1 month)
      const goldHistory = await yahooFinance.chart('GC=F', {
        period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        interval: '1d'
      });

      const chartData = goldHistory.quotes.map((q: any) => ({
        date: new Date(q.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: q.close
      }));

      const prices = {
        gold: results.find(r => r.symbol === 'GC=F')?.regularMarketPrice,
        silver: results.find(r => r.symbol === 'SI=F')?.regularMarketPrice,
        platinum: results.find(r => r.symbol === 'PL=F')?.regularMarketPrice,
        palladium: results.find(r => r.symbol === 'PA=F')?.regularMarketPrice,
        rhodium: 14500,
        chartData,
        updatedAt: new Date().toISOString()
      };

      res.json(prices);
    } catch (error) {
      console.error("Error fetching prices:", error);
      res.status(500).json({ error: "Failed to fetch prices" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
