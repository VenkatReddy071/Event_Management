const UserRegister = require('../../models/CollegeRegister/EventRegistration');
const Event=require("../../models/CollegeRegister/EventModel");
const {sendEmail}=require("../../utiltiles/email");
const Subevent=require("../../models/CollegeRegister/Events");
// exports.createRegistration = async (req, res) => {
//   try {
//     const { username, email, CollegeName, year, branch, semister, paymentId, event, subEvent } = req.body;
//     if (!req.file) {
//       return res.status(400).json({ msg: 'Payment screenshot is required.' });
//     }
//     const paymentScreenShot = req.file.path;
//     const newRegistration = new UserRegister({
//       username,
//       email,
      
//       CollegeName,
//       year,
//       branch,
//       semister,
//       paymentId,
//       paymentScreenShot,
//       event,
//       subEvent,
//     });
//     const registration = await newRegistration.save();
//     res.status(201).json(registration);
//   } catch (err) {
//     console.error(err.message);
//     if (err.code === 11000) {
//       return res.status(400).json({ msg: 'Payment ID or email already exists.' });
//     }
//     res.status(500).send('Server error');
//   }
// };

exports.createRegistration = async (req, res) => {
  try {
    // Destructure all the required fields from the request body and file
    const { username, email, CollegeName, year, branch, semister, paymentId, event, subEvent,groupType } = req.body;
    if (!req.file) {
      return res.status(400).json({ msg: 'Payment screenshot is required.' });
    }
    const paymentScreenShot = req.file.path;

    // Create a new registration document in the database
    const newRegistration = new UserRegister({
      username,
      email,
      mobile,
      CollegeName,
      year,
      branch,
      semister,
      paymentId,
      paymentScreenShot,
      event,
      subEvent,
      groupType
    });
    const registration = await newRegistration.save();
    const fetchedSubEvent = await Subevent.findById(subEvent).populate('event');

    if (!fetchedSubEvent) {
        return res.status(404).json({ msg: 'Sub-event not found.' });
    }

    // const emailSubject = "Congratulations! Your Registration is Confirmed";

    // const emailHtml = `
    //   <p>Hello <strong>${username}</strong>,</p>
    //   <p>Congratulations! Your registration for the event <strong>${fetchedSubEvent.event.title}</strong> has been confirmed.</p>
    //   <p>We are excited to see you there! Here are your event details:</p>
      
    //   <ul>
    //       <li><strong>Sub-Event:</strong> ${fetchedSubEvent.title}</li>
    //       <li><strong>Date:</strong> ${new Date(fetchedSubEvent.eventDate).toDateString()}</li>
    //       // <li><strong>Time:</strong> ${fetchedSubEvent.time}</li>
    //       // <li><strong>Venue:</strong> ${fetchedSubEvent.venue}</li>
    //       <li><strong>Registration Fee:</strong> ₹${fetchedSubEvent.registrationPrice}</li>
    //   </ul>
      
    //   <p><strong>Coordinator Details:</strong></p>
    //   <ul>
    //       <li><strong>Student Coordinator:</strong> ${fetchedSubEvent.studentCoordinator1} - ${fetchedSubEvent.StudentContact1}</li>
    //       <li><strong>Faculty Coordinator:</strong> ${fetchedSubEvent.facultyCoordinator} - ${fetchedSubEvent.facultyContact}</li>
    //   </ul>
      
    //   <p>Thanks,</p>
    //   <p>Your Campus Connect Team</p>
    // `;
    // await sendEmail(email, emailSubject, '', emailHtml);

    res.status(201).json(registration);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Payment ID or email already exists.' });
    }
    res.status(500).send('Server error');
  }
};
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await UserRegister.find()
      .populate('event','title')
      .populate('subEvent','title');
    return res.status(200).json(registrations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// This function is for an event organizer (college) to get all registrations for their event.
exports.getRegistrationsForCollege = async (req, res) => {
  try {
    const collegeId = req.user.id;
    const event = await Event.findOne({ college: collegeId });

    if (!event) {
      return res.status(404).json({ msg: 'No event found for this college.' });
    }

    const registrations = await UserRegister.find({ event: event._id })
      .populate('event', 'title')
      .populate('subEvent', 'title');

    if (registrations.length === 0) {
      return res.status(404).json({ msg: 'No registrations found for this event.' });
    }

    return res.status(200).json(registrations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getRegistrationsByEmail = async (req, res) => {
  try {
    // Assuming the authenticated user's email is available from the token
    const userEmail = req.user.email;
    const registrations = await UserRegister.find({ email: userEmail })
      .populate('event', 'title')
      .populate('subEvent', 'title');

    if (registrations.length === 0) {
      return res.status(404).json({ msg: 'No registrations found for this email.' });
    }

    return res.status(200).json(registrations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.getRegistrationsByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;
    const registrations = await UserRegister.find({ event: eventId })
      .populate('user', '-password')
      .populate('event')
      .populate('subEvent');
    if (registrations.length === 0) {
      return res.status(404).json({ msg: 'No registrations found for this event.' });
    }
    res.json(registrations);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found.' });
    }
    res.status(500).send('Server error');
  }
};
