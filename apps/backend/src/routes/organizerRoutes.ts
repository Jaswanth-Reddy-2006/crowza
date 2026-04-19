import express, { Request, Response } from 'express';
import { organizerService, eventService, paymentService, fileUploadService } from '../services/organizerService';

const router = express.Router();

// ===== ORGANIZER ROUTES =====

// Create new organizer (registration)
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { firebaseUid, email, name, companyName, phone, bio, website } = req.body;

    // Validation
    if (!firebaseUid || !email || !name || !companyName || !phone) {
      return res.status(400).json({
        error: 'Missing required fields: firebaseUid, email, name, companyName, phone',
      });
    }

    const organizer = await organizerService.createOrganizer({
      firebaseUid,
      email,
      name,
      companyName,
      phone,
      bio,
      website,
    });

    res.status(201).json({ data: organizer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create organizer' });
  }
});

// Get organizer profile
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const organizer = await organizerService.getOrganizerById(id);

    if (!organizer) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    res.json({ data: organizer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organizer' });
  }
});

// Get organizer by Firebase UID
router.get('/firebase/:firebaseUid', async (req: Request, res: Response) => {
  try {
    const firebaseUid = req.params.firebaseUid as string;
    const organizer = await organizerService.getOrganizerByFirebaseUid(firebaseUid);

    if (!organizer) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    res.json({ data: organizer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organizer' });
  }
});

// Update organizer profile
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const updateData = req.body;

    const updated = await organizerService.updateOrganizer(id, updateData);

    if (!updated) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    res.json({ data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update organizer' });
  }
});

// Get organizer's events
router.get('/:id/events', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const events = await organizerService.getOrganizerEvents(id);
    res.json({ data: events });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// ===== EVENT ROUTES =====

// Create event
router.post('/:organizerId/events', async (req: Request, res: Response) => {
  try {
    const organizerId = req.params.organizerId as string;
    const {
      title,
      description,
      category,
      startDate,
      endDate,
      location,
      expectedAttendees,
      maxAttendees,
      ticketPrice,
      tags,
      details,
    } = req.body;

    // Validation
    if (
      !title ||
      !description ||
      !category ||
      !startDate ||
      !endDate ||
      !location ||
      !expectedAttendees ||
      !maxAttendees
    ) {
      return res.status(400).json({ error: 'Missing required event fields' });
    }

    const event = await eventService.createEvent(organizerId, {
      title,
      description,
      category,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location,
      expectedAttendees,
      maxAttendees,
      ticketPrice,
      tags,
      details,
    });

    res.status(201).json({ data: event });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Get event details
router.get('/events/:eventId', async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId as string;
    const event = await eventService.getEventById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ data: event });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Update event
router.patch('/:organizerId/events/:eventId', async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId as string;
    const updateData = req.body;

    const event = await eventService.getEventById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const updated = await eventService.updateEvent(eventId, updateData);
    res.json({ data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Submit event for review
router.post('/:organizerId/events/:eventId/submit-review', async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId as string;

    const event = await eventService.submitEventForReview(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ data: event, message: 'Event submitted for review' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit event for review' });
  }
});

// Delete event
router.delete('/:organizerId/events/:eventId', async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId as string;

    const deleted = await eventService.deleteEvent(eventId);
    if (!deleted) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Get event analytics
router.get('/:organizerId/events/:eventId/analytics', async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId as string;

    const analytics = await eventService.getEventAnalytics(eventId);
    if (!analytics) {
      return res.status(404).json({ error: 'Analytics not found' });
    }

    res.json({ data: analytics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// ===== FILE UPLOAD ROUTES =====

// Upload event file (simplified - in production use multer properly)
router.post('/:organizerId/events/:eventId/files', async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId as string;
    const { fileName, fileUrl, fileType, fileSize } = req.body;

    if (!fileName || !fileUrl) {
      return res.status(400).json({ error: 'Missing fileName or fileUrl' });
    }

    // Create file record
    const file = {
      id: Math.random().toString(36).substring(7),
      eventId,
      fileUrl,
      fileName,
      fileType: fileType || 'application/octet-stream',
      fileSize: fileSize || 0,
      uploadedAt: new Date(),
    };

    res.status(201).json({ data: file });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get event files
router.get('/:organizerId/events/:eventId/files', async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId as string;
    const files = await fileUploadService.getEventFiles(eventId);
    res.json({ data: files });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Delete event file
router.delete('/:organizerId/events/:eventId/files/:fileId', async (req: Request, res: Response) => {
  try {
    const fileId = req.params.fileId as string;

    const deleted = await fileUploadService.deleteEventFile(fileId);
    if (!deleted) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// ===== PAYMENT ROUTES =====

// Calculate event fee
router.post('/payments/calculate-fee', async (req: Request, res: Response) => {
  try {
    const { expectedAttendees } = req.body;

    if (!expectedAttendees || expectedAttendees < 1) {
      return res.status(400).json({ error: 'Invalid expectedAttendees' });
    }

    const fee = await paymentService.calculateEventFee(expectedAttendees);

    res.json({
      data: {
        expectedAttendees,
        fee,
        currencyCode: 'USD',
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate fee' });
  }
});

// Create payment intent
router.post('/:organizerId/payments', async (req: Request, res: Response) => {
  try {
    const organizerId = req.params.organizerId as string;
    const { eventId, amount } = req.body;

    if (!eventId || !amount) {
      return res.status(400).json({ error: 'Missing eventId or amount' });
    }

    const payment = await paymentService.createPaymentIntent(eventId, organizerId, amount);

    res.status(201).json({
      data: {
        ...payment,
        clientSecret: `secret_${Math.random().toString(36).substring(7)}`,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Get payment status
router.get('/:organizerId/payments/:paymentId', async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.paymentId as string;

    const payment = await paymentService.getPaymentStatus(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ data: payment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// ===== ADMIN ROUTES =====

// Get pending events for review
router.get('/admin/events/pending', async (req: Request, res: Response) => {
  try {
    const pendingEvents = await eventService.getPendingEvents();
    res.json({ data: pendingEvents });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending events' });
  }
});

// Approve event
router.patch('/admin/events/:eventId/approve', async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId as string;
    const { approverId } = req.body;

    if (!approverId) {
      return res.status(400).json({ error: 'approverId is required' });
    }

    const event = await eventService.approveEvent(eventId, approverId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ data: event, message: 'Event approved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve event' });
  }
});

// Reject event
router.patch('/admin/events/:eventId/reject', async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId as string;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }

    const event = await eventService.rejectEvent(eventId, reason);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ data: event, message: 'Event rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject event' });
  }
});

export default router;
