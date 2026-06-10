import express, { Router, Request, Response } from 'express';
import { schoolQueries } from '../models/queries';
import multer from 'multer';
import fs from 'fs';

const router = Router();

// Configure multer for CSV uploads
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 5242880 } });

// ==================== SCHOOL ROUTES ====================

// Create school
router.post('/', async (req: Request, res: Response) => {
  try {
    const { universityId } = req.body;
    const school = await schoolQueries.create(universityId, req.body);
    res.status(201).json(school);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create school' });
  }
});

// Get all schools for university
router.get('/:universityId', async (req: Request, res: Response) => {
  try {
    const { universityId } = req.params;
    const schools = await schoolQueries.getByUniversity(universityId);
    res.json(schools);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch schools' });
  }
});

// Get schools by country and city
router.get('/:universityId/search/:country/:city', async (req: Request, res: Response) => {
  try {
    const { universityId, country, city } = req.params;
    const schools = await schoolQueries.getByCountryCity(universityId, country, city);
    res.json(schools);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search schools' });
  }
});

// Get school by ID
router.get('/:universityId/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const school = await schoolQueries.getById(id);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }
    res.json(school);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch school' });
  }
});

// Update school
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const school = await schoolQueries.update(id, req.body);
    res.json(school);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update school' });
  }
});

// Delete school
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await schoolQueries.delete(id);
    res.json({ message: 'School deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete school' });
  }
});

// Upload CSV for bulk school import
router.post('/upload/csv', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { universityId } = req.body;
    const content = fs.readFileSync(req.file.path, 'utf-8');
    const lines = content.split('\n').slice(1); // Skip header

    const schools = [];
    for (const line of lines) {
      if (!line.trim()) continue;
      const [school_name, country, city, region, website, school_type, general_email, general_contact_number, primary_contact_person, primary_contact_email, primary_contact_phone] = line.split(',');
      
      const school = await schoolQueries.create(universityId, {
        school_name: school_name.trim(),
        country: country.trim(),
        city: city.trim(),
        region: region.trim(),
        website: website.trim(),
        school_type: school_type.trim(),
        general_email: general_email.trim(),
        general_contact_number: general_contact_number.trim(),
        primary_contact_person: primary_contact_person.trim(),
        primary_contact_email: primary_contact_email.trim(),
        primary_contact_phone: primary_contact_phone.trim()
      });
      schools.push(school);
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.status(201).json({ message: `${schools.length} schools imported successfully`, schools });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to import schools' });
  }
});

export default router;
