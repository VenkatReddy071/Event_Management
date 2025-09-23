const College = require('../../models/CollegeRegister/College');
const Event = require('../../models/CollegeRegister/EventModel');
const User = require('../../models/user/UserMode');
const userRegister = require('../../models/CollegeRegister/EventRegistration');

const getDashboardStats = async (req, res) => {
    try {
        const [
            collegeCount,
            eventCount,
            userCount,
            allRegistrations,
            recentColleges,
            recentRegistrations
        ] = await Promise.all([
            College.countDocuments(),
            Event.countDocuments(),
            User.countDocuments(),
            userRegister.find().populate('subEvent', 'registrationPrice'),
            College.find().sort({ registrationDate: -1 }).limit(5),
            userRegister.find().sort({ createdAt: -1 }).limit(5).populate('event', 'title')
        ]);

        const totalRevenue = allRegistrations.reduce((sum, reg) => {
            if (reg.subEvent && reg.subEvent.registrationPrice) {
                return sum + reg.subEvent.registrationPrice;
            }
            return sum;
        }, 0);
        
        const registrationCount = allRegistrations.length;

        res.status(200).json({
            colleges: collegeCount,
            events: eventCount,
            activeUsers: userCount,
            revenue: totalRevenue,
            recentColleges: recentColleges,
            recentRegistrations: recentRegistrations,
            registrations: registrationCount
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: "Server error. Could not fetch dashboard data." });
    }
};

module.exports = { getDashboardStats };
