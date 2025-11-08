const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Create a new event
router.post('/', async (req, res) => {
  try {
    const event = new Event({
      title: req.body.title,
      time: req.body.time,
      place: req.body.place,
      description: req.body.description,
      creatorId: req.body.creatorId,
      attendees: [req.body.creatorId] // Creator automatically attends
    });
    const newEvent = await event.save();
    const populatedEvent = await Event.findById(newEvent._id)
      .populate('creatorId', 'username name avatar majorYear')
      .populate('attendees', 'username name avatar majorYear interests');
    res.status(201).json(populatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all events with populated attendees
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('creatorId', 'username name avatar majorYear')
      .populate('attendees', 'username name avatar majorYear interests')
      .populate('messages.userId', 'username name avatar')
      .sort({ time: 1 }); // Sort by time ascending
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific event with populated attendees
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creatorId', 'username name avatar majorYear')
      .populate('attendees', 'username name avatar majorYear interests')
      .populate('messages.userId', 'username name avatar');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (req.body.title) event.title = req.body.title;
    if (req.body.time) event.time = req.body.time;
    if (req.body.place) event.place = req.body.place;
    if (req.body.description) event.description = req.body.description;

    const updatedEvent = await event.save();
    const populatedEvent = await Event.findById(updatedEvent._id)
      .populate('creatorId', 'username name avatar majorYear')
      .populate('attendees', 'username name avatar majorYear interests');
    res.json(populatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Join an event (add user to attendees)
router.post('/:id/attend', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Check if user is already attending
    if (event.attendees.includes(userId)) {
      return res.status(400).json({ message: 'User already attending this event' });
    }

    event.attendees.push(userId);
    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('creatorId', 'username name avatar majorYear')
      .populate('attendees', 'username name avatar majorYear interests');
    res.json(populatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Leave an event (remove user from attendees)
router.delete('/:id/attend', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    event.attendees = event.attendees.filter(id => id.toString() !== userId);
    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('creatorId', 'username name avatar majorYear')
      .populate('attendees', 'username name avatar majorYear interests');
    res.json(populatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Post a message to an event
router.post('/:id/messages', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const { userId, text } = req.body;
    if (!userId || !text) {
      return res.status(400).json({ message: 'userId and text are required' });
    }

    event.messages.push({ userId, text, timestamp: new Date() });
    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('creatorId', 'username name avatar majorYear')
      .populate('attendees', 'username name avatar majorYear interests')
      .populate('messages.userId', 'username name avatar');
    res.json(populatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
