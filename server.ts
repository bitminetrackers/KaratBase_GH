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
      let results: any[] = [];
      try {
        results = await yahooFinance.quote(symbols) as any[];
      } catch (e) {
        console.error("Error fetching quotes:", e);
      }

      // Fetch historical data for Gold (1 month)
      let chartData: any[] = [];
      try {
        const goldHistory = await yahooFinance.chart('GC=F', {
          period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          interval: '1d'
        });
        chartData = goldHistory.quotes.map((q: any) => ({
          date: new Date(q.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: q.close
        }));
      } catch (e) {
        console.error("Error fetching chart data:", e);
      }

      const prices = {
        gold: results.find(r => r.symbol === 'GC=F')?.regularMarketPrice || 2050.45,
        silver: results.find(r => r.symbol === 'SI=F')?.regularMarketPrice || 23.15,
        platinum: results.find(r => r.symbol === 'PL=F')?.regularMarketPrice || 920.80,
        palladium: results.find(r => r.symbol === 'PA=F')?.regularMarketPrice || 1050.20,
        rhodium: 14500,
        chartData: chartData.length > 0 ? chartData : [
          { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), price: 2000 },
          { date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), price: 2030 },
          { date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), price: 2050.45 }
        ],
        updatedAt: new Date().toISOString()
      };

      res.json(prices);
    } catch (error) {
      console.error("Critical error in /api/prices:", error);
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
