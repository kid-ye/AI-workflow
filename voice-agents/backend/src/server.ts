import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../backend/.env') });
// Fallback: also try relative to cwd for tsx watch mode
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import { handleWebSocketConnection } from './modules/wsHandler';
import { mcpRouter } from './routes/mcp';

const app = express();
app.use(cors());
app.use(express.json());

// MCP REST endpoints (tool APIs)
app.use('/api/mcp', mcpRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: Date.now() }));

const server = http.createServer(app);

// WebSocket server on same HTTP server
const wss = new WebSocketServer({ server, path: '/ws' });
wss.on('connection', handleWebSocketConnection);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`[server] HTTP + WS listening on http://localhost:${PORT}`);
  console.log(`[server] WebSocket endpoint: ws://localhost:${PORT}/ws`);
  console.log(`[server] OPENAI_API_KEY loaded: ${!!process.env.OPENAI_API_KEY}`);
  console.log(`[server] SARVAM_API_KEY loaded: ${!!process.env.SARVAM_API_KEY}`);
});
