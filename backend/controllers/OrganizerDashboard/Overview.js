
const Event = require('../../models/CollegeRegister/EventModel');
const userRegister = require('../../models/CollegeRegister/EventRegistration');
const Subevent = require('../../models/CollegeRegister/Events');

exports.getDashboardData = async (req, res) => {
  try {
    const collegeId = req.user.id;
    const totalEvents = await Event.countDocuments({ college: collegeId });
    const totalParticipants = await userRegister.countDocuments({
      subEvent: {
        $in: await Subevent.find({ event: { $in: await Event.find({ college: collegeId }).select('_id') } }).select('_id')
      }
    });
    const registrations = await userRegister.find({
      subEvent: {
        $in: await Subevent.find({ event: { $in: await Event.find({ college: collegeId }).select('_id') } }).select('_id')
      }
    }).populate('subEvent', 'registrationPrice');
    
    const totalRevenue = registrations.reduce((sum, reg) => {
      return sum + (reg.subEvent?.registrationPrice || 0);
    }, 0);

    res.json({
      totalHostedEvents: totalEvents,
      totalParticipants: totalParticipants,
      revenueSummary: totalRevenue,
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecentEvents = async (req, res) => {
  try {
    const collegeId =req.user.id; 
    const limit = parseInt(req.query.limit) || 5;

    const events = await Event.find({ college: collegeId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title startDate');

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecentRegistrations = async (req, res) => {
  try {
    const collegeId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    
    const collegeEvents = await Event.find({ college: collegeId }).select('_id');
    const collegeSubevents = await Subevent.find({ event: { $in: collegeEvents } }).select('_id');

    const registrations = await userRegister.find({ subEvent: { $in: collegeSubevents } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('username CollegeName paymentId');

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
