import { Router } from 'express';
import { mcpTools } from '../services/mcpService';

export const mcpRouter = Router();

// List available tools
mcpRouter.get('/tools', (_req, res) => {
  res.json({ tools: mcpTools.list() });
});

// Execute a tool
mcpRouter.post('/execute', async (req, res) => {
  const { toolName, args } = req.body as { toolName: string; args: Record<string, unknown> };
  if (!toolName) {
    res.status(400).json({ error: 'toolName required' });
    return;
  }
  const result = await mcpTools.execute(toolName, args || {});
  res.json({ toolName, result });
});
