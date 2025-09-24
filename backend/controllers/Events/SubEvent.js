const Subevent = require('../../models/CollegeRegister/Events');
const cloudinary = require('../../config/cloudnary');
const Event=require("../../models/CollegeRegister/EventModel");
exports.createSubevent = async (req, res) => {
  try {
    console.log(req.body);
    const college=req.user?.id;
    const { title, description, registrationPrice, winningPrices, eventDate, time, team, venue, eventType, event,studentCoordinator1,studentContact1,studentCoordinator2,studentContact2,facultyCoordinator,facultyContact } = req.body;

    if (!req.files || !req.files['photo'] || !req.files['paymentScanner']) {
      return res.status(400).json({ msg: 'Both photo and payment scanner images are required.' });
    }

    const photo = req.files['photo'][0].path;
    const paymentScanner = req.files['paymentScanner'][0].path;

    let parsedWinningPrices = [];
    if (winningPrices) {
      try {
        parsedWinningPrices = JSON.parse(winningPrices);
      } catch (e) {
        return res.status(400).json({ msg: 'winningPrices must be a valid JSON array.' });
      }
    }

    const newSubevent = new Subevent({
      title,
      description,
      photo,
      registrationPrice,
      paymentScanner,
      winningPrices: parsedWinningPrices,
      eventDate,
      time,
      team,
      venue,
      eventType,
      event,
      college,
      studentCoordinator1,
      studentContact1,
      studentCoordinator2,
      studentContact2,
      facultyCoordinator,
      facultyContact,
    });

    const subevent = await newSubevent.save();
    res.status(201).json(subevent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getSubeventsByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;
    const subevents = await Subevent.find({event:eventId}).populate('event');
    return res.status(200).json(subevents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.getSubeventById = async (req, res) => {
  try {
    const subevent = await Subevent.findById(req.params.id).populate('event');
    if (!subevent) {
      return res.status(404).json({ msg: 'Subevent not found' });
    }
    res.json(subevent);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Subevent not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.updateSubevent = async (req, res) => {
  try {
    const { title, description, registrationPrice, winningPrices, eventDate, time, team, venue, eventType } = req.body;
    let subeventFields = { title, description, registrationPrice, eventDate, time, team, venue, eventType };

    const files = req.files;
    const subevent = await Subevent.findById(req.params.id);

    if (files && files['photo']) {
      if (subevent.photo) {
        const publicId = subevent.photo.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`subevent-photos/${publicId}`);
      }
      subeventFields.photo = files['photo'][0].path;
    }
    
    if (files && files['paymentScanner']) {
      if (subevent.paymentScanner) {
        const publicId = subevent.paymentScanner.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`subevent-scanners/${publicId}`);
      }
      subeventFields.paymentScanner = files['paymentScanner'][0].path;
    }

    if (winningPrices) {
      try {
        subeventFields.winningPrices = JSON.parse(winningPrices);
      } catch (e) {
        return res.status(400).json({ msg: 'winningPrices must be a valid JSON array.' });
      }
    }

    const updatedSubevent = await Subevent.findByIdAndUpdate(
      req.params.id,
      { $set: subeventFields },
      { new: true }
    );

    if (!updatedSubevent) {
      return res.status(404).json({ msg: 'Subevent not found' });
    }

    res.json(updatedSubevent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.deleteSubevent = async (req, res) => {
  try {
    const subevent = await Subevent.findById(req.params.id);

    if (!subevent) {
      return res.status(404).json({ msg: 'Subevent not found' });
    }
    if (subevent.photo) {
      const photoPublicId = subevent.photo.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`subevent-photos/${photoPublicId}`);
    }
    if (subevent.paymentScanner) {
      const scannerPublicId = subevent.paymentScanner.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`subevent-scanners/${scannerPublicId}`);
    }

    await Subevent.deleteOne({ _id: req.params.id });

    res.json({ msg: 'Subevent removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Subevent not found' });
    }
    res.status(500).send('Server error');
  }
};


exports.getEventsByCollege = async (req, res) => {
    try {
        const collegeId  = req.user?.id;
        const events = await Subevent.find({ college: collegeId });

        if (!events || events.length === 0) {
            return res.status(404).json({ message: "No events found for this college." });
        }

        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events by college ID:", error);
        res.status(500).json({ message: "Server error. Could not fetch events." });
    }
};