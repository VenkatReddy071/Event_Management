const Event = require('../../models/CollegeRegister/EventModel');
const cloudinary = require('../../config/cloudnary');

exports.createEvent = async (req, res) => {
  try {
    const id=req?.user?.id;
    console.log(id,req.user);
    const { title, description, startDate, endDate, location, category,departments } = req.body;
    let posterUrl = req.file ? req.file.path : null;

    const newEvent = new Event({
      title,
      description,
      startDate,
      endDate,
      location,
      category,
      college:id,
      posterUrl,
      departments
    });

    const event = await newEvent.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getEventsByCollege = async (req, res) => {
      try {
          const collegeId  = req.user?.id;
          const events = await Event.find({ college: collegeId });

          if (!events || events.length === 0) {
              return res.status(404).json({ message: "No events found for this college." });
          }

          res.status(200).json(events);
      } catch (error) {
          console.error("Error fetching events by college ID:", error);
          res.status(500).json({ message: "Server error. Could not fetch events." });
      }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).populate('college');
    return res.status(200).json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getEventsAdmin = async (req, res) => {
  try {
    const events = await Event.find({}).populate('college');
    return res.status(200).json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('college subevents');
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server error');
  }
};


exports.updateEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, category, college, subevents } = req.body;
    let eventFields = { title, description, startDate, endDate, location, category, college, subevents };

    if (req.file) {
      const event = await Event.findById(req.params.id);
      if (event && event.posterUrl) {
        const publicId = event.posterUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`event-posters/${publicId}`);
      }
      eventFields.posterUrl = req.file.path;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: eventFields },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.json(updatedEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    if (event.posterUrl) {
      const publicId = event.posterUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`event-posters/${publicId}`);
    }

    await Event.deleteOne({ _id: req.params.id });

    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server error');
  }
};