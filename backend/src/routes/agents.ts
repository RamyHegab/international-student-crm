import express, { Router, Request, Response } from 'express';
import { agentQueries, agentBranchQueries } from '../models/queries';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// ==================== AGENT ROUTES ====================

// Create agent
router.post('/', async (req: Request, res: Response) => {
  try {
    const { universityId } = req.body;
    const agent = await agentQueries.create(universityId, req.body);
    res.status(201).json(agent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
});

// Get all agents for university
router.get('/:universityId', async (req: Request, res: Response) => {
  try {
    const { universityId } = req.params;
    const agents = await agentQueries.getByUniversity(universityId);
    res.json(agents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Get agent by ID
router.get('/:universityId/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const agent = await agentQueries.getById(id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

// Update agent
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const agent = await agentQueries.update(id, req.body);
    res.json(agent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

// Delete agent
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await agentQueries.delete(id);
    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
});

// ==================== AGENT BRANCH ROUTES ====================

// Create agent branch with Google Maps
router.post('/:agentId/branches', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const branch = await agentBranchQueries.create({
      ...req.body,
      agent_id: agentId
    });
    res.status(201).json(branch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create agent branch' });
  }
});

// Get all branches for agent
router.get('/:agentId/branches', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const branches = await agentBranchQueries.getByAgent(agentId);
    res.json(branches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

// Get branches by country and city
router.get('/search/:country/:city', async (req: Request, res: Response) => {
  try {
    const { country, city } = req.params;
    const branches = await agentBranchQueries.getByCountryCity(country, city);
    res.json(branches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search branches' });
  }
});

// Update agent branch
router.put('/branches/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const branch = await agentBranchQueries.update(id, req.body);
    res.json(branch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update branch' });
  }
});

// Delete agent branch
router.delete('/branches/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await agentBranchQueries.delete(id);
    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete branch' });
  }
});

export default router;
