import express, { Router, Request, Response } from 'express';
import { itineraryQueries, activityQueries, agentBranchQueries, schoolQueries } from '../models/queries';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, Table, TableCell, WidthType } from 'docx';

const router = Router();

// ==================== ITINERARY ROUTES ====================

// Create itinerary
router.post('/', async (req: Request, res: Response) => {
  try {
    const { universityId, userId } = req.body;
    const itinerary = await itineraryQueries.create(universityId, userId, req.body);
    res.status(201).json(itinerary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create itinerary' });
  }
});

// Get all itineraries for user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const itineraries = await itineraryQueries.getByUser(userId);
    res.json(itineraries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch itineraries' });
  }
});

// Get all itineraries for university
router.get('/university/:universityId', async (req: Request, res: Response) => {
  try {
    const { universityId } = req.params;
    const itineraries = await itineraryQueries.getByUniversity(universityId);
    res.json(itineraries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch itineraries' });
  }
});

// Get itinerary by ID with activities
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const itinerary = await itineraryQueries.getById(id);
    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }
    const activities = await activityQueries.getByItinerary(id);
    res.json({ ...itinerary, activities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch itinerary' });
  }
});

// Update itinerary
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const itinerary = await itineraryQueries.update(id, req.body);
    res.json(itinerary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update itinerary' });
  }
});

// Delete itinerary
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await itineraryQueries.delete(id);
    res.json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete itinerary' });
  }
});

// ==================== ACTIVITY ROUTES ====================

// Create activity
router.post('/:itineraryId/activities', async (req: Request, res: Response) => {
  try {
    const { itineraryId } = req.params;
    const activity = await activityQueries.create(itineraryId, req.body);
    res.status(201).json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

// Get activities for itinerary
router.get('/:itineraryId/activities', async (req: Request, res: Response) => {
  try {
    const { itineraryId } = req.params;
    const activities = await activityQueries.getByItinerary(itineraryId);
    
    // Enrich activities with location details
    const enrichedActivities = await Promise.all(activities.map(async (activity) => {
      if (activity.agent_branch_id) {
        const branch = await agentBranchQueries.getByAgent(activity.agent_branch_id);
        activity.agent_branch = branch;
      }
      if (activity.school_id) {
        const school = await schoolQueries.getById(activity.school_id);
        activity.school = school;
      }
      return activity;
    }));

    res.json(enrichedActivities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Update activity
router.put('/activities/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const activity = await activityQueries.update(id, req.body);
    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

// Delete activity
router.delete('/activities/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await activityQueries.delete(id);
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

// ==================== EXPORT ROUTES ====================

// Export itinerary as PDF
router.get('/:id/export/pdf', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const itinerary = await itineraryQueries.getById(id);
    const activities = await activityQueries.getByItinerary(id);

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="itinerary-${id}.pdf"`);

    doc.pipe(res);

    // Header
    doc.fontSize(20).text(itinerary.title || 'Recruitment Itinerary', { align: 'center' });
    doc.fontSize(12).text(`Countries: ${itinerary.countries_visited}`, { align: 'center' });
    doc.text(`Dates: ${itinerary.start_date} to ${itinerary.end_date}`, { align: 'center' });
    doc.text(`Status: ${itinerary.status}`, { align: 'center' });

    // Activities table
    doc.moveDown();
    doc.fontSize(14).text('Activities', { underline: true });
    doc.moveDown(0.5);

    activities.forEach((activity, idx) => {
      doc.fontSize(11).text(`${idx + 1}. ${activity.activity_type.toUpperCase()}`);
      doc.fontSize(10).text(`Date: ${activity.activity_date}`);
      if (activity.start_time) doc.text(`Time: ${activity.start_time} - ${activity.end_time}`);
      if (activity.notes) doc.text(`Notes: ${activity.notes}`);
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to export PDF' });
  }
});

// Export itinerary as Word
router.get('/:id/export/word', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const itinerary = await itineraryQueries.getById(id);
    const activities = await activityQueries.getByItinerary(id);

    const rows = activities.map((activity, idx) => [
      new TableCell({ children: [new Paragraph(`${idx + 1}`)] }),
      new TableCell({ children: [new Paragraph(activity.activity_type)] }),
      new TableCell({ children: [new Paragraph(activity.activity_date)] }),
      new TableCell({ children: [new Paragraph(activity.notes || '')] })
    ]);

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: itinerary.title || 'Recruitment Itinerary', size: 32, bold: true }),
          new Paragraph({ text: `Countries: ${itinerary.countries_visited}`, size: 20 }),
          new Paragraph({ text: `Dates: ${itinerary.start_date} to ${itinerary.end_date}`, size: 20 }),
          new Paragraph({ text: `Status: ${itinerary.status}`, size: 20 }),
          new Paragraph(''),
          new Paragraph({ text: 'Activities', size: 24, bold: true }),
          new Table({
            width: { size: 100, type: WidthType.PERCENT },
            rows: [
              new Table.Row({
                children: [
                  new TableCell({ children: [new Paragraph('#')] }),
                  new TableCell({ children: [new Paragraph('Type')] }),
                  new TableCell({ children: [new Paragraph('Date')] }),
                  new TableCell({ children: [new Paragraph('Notes')] })
                ]
              }),
              ...rows.map((row, idx) => new Table.Row({ children: row }))
            ]
          })
        ]
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="itinerary-${id}.docx"`);
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to export Word document' });
  }
});

export default router;
