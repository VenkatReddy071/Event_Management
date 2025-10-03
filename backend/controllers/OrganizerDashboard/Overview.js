
const Event = require('../../models/CollegeRegister/EventModel');
const userRegister = require('../../models/CollegeRegister/EventRegistration');
const Subevent = require('../../models/CollegeRegister/Events');

// exports.getDashboardData = async (req, res) => {
//   try {
//     const collegeId = req.user.id;
//     const totalEvents = await Event.countDocuments({ college: collegeId });
//     const totalParticipants = await userRegister.countDocuments({
//       subEvent: {
//         $in: await Subevent.find({ event: { $in: await Event.find({ college: collegeId }).select('_id') } }).select('_id')
//       }
//     });
//     const registrations = await userRegister.find({
//       subEvent: {
//         $in: await Subevent.find({ event: { $in: await Event.find({ college: collegeId }).select('_id') } }).select('_id')
//       }
//     }).populate('subEvent', 'registrationPrice');
    
//     const totalRevenue = registrations.reduce((sum, reg) => {
//       return sum + (reg.subEvent?.registrationPrice || 0);
//     }, 0);

//     res.json({
//       totalHostedEvents: totalEvents,
//       totalParticipants: totalParticipants,
//       revenueSummary: totalRevenue,
//     });

//   } catch (error) {
//     console.error('Error fetching dashboard data:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

const Register = require('../models/userRegister'); // Assuming your model path

// Helper function to extract the price (number) from the registrationPrice string
const extractPriceFromString = (priceString) => {
    if (!priceString) return 0;

    // Use a regular expression to find all numbers in the string
    // The expression /[\d,.]+/g finds sequences of digits, commas, or periods.
    const priceMatches = priceString.match(/[\d.]+/g);

    if (priceMatches && priceMatches.length > 0) {
        // We assume the last number in the string is the price.
        // Convert it to a float to handle potential decimals and return.
        return parseFloat(priceMatches[priceMatches.length - 1]);
    }
    return 0; // Return 0 if no price could be extracted
};

exports.getDashboardData = async (req, res) => {
    try {
        // 1. Fetch all registrations and populate the 'subEvent' to access the registrationPrice field
        const registrations = await Register.find({})
            .populate({
                path: 'subEvent',
                select: 'registrationPrice' // Select only the field that contains the price string
            })
            .exec();

        let totalRevenue = 0;
        let registrationCount = 0;

        // 2. Iterate through registrations and calculate revenue
        for (const registration of registrations) {
            const subEventDetails = registration.subEvent;

            // Ensure subEvent details were successfully populated and the price field exists
            if (subEventDetails && subEventDetails.registrationPrice) {
                
                // The price string is now available directly from the populated subEvent
                const priceString = subEventDetails.registrationPrice;
                
                // Extract the numeric value from the complex price string (e.g., "Group - 400" -> 400)
                const price = extractPriceFromString(priceString);

                // Add the extracted price for this registration to the total revenue
                // NOTE: This assumes that the 'subEvent' document has the correct price string 
                // that corresponds to the 'groupType' of the current registration.
                // If 'subEvent' has multiple price strings and the logic needs to choose one based on registration.groupType,
                // the Subevent schema is likely structured incorrectly for easy population.
                // Assuming the price string fetched IS the correct price for this registration:
                totalRevenue += price;
                registrationCount++;

            } else {
                console.warn(`Missing subEvent or pricing details for registration with ID: ${registration._id}`);
            }
        }

        // 3. Send the calculated data as a response
        return res.status(200).json({
            success: true,
            totalRevenue: totalRevenue.toFixed(2), // Format revenue to 2 decimal places
            totalRegistrations: registrationCount,
            message: "Dashboard data calculated successfully based on extracted price strings."
        });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data.",
            error: error.message
        });
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
