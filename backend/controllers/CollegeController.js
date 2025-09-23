const College = require('../models/CollegeRegister/College');
const bcrypt = require('bcryptjs');
const {sendEmail}=require("../utiltiles/email");
const {generateToken}=require("../auth/JWT");
const User =require("../models/user/UserMode");
exports.register = async (req, res) => {
    try {
        const { name, address, website, contactName, contactEmail, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newCollege = new College({
            name,
            address,
            website,
            contactName,
            contactEmail,
            password: hashedPassword
        });
        const newUser=await User({
            username:name,
            email:contactName,
            password:hashedPassword,
            role:"organizer",
        })

        await newCollege.save();
        await newUser.save();
        res.status(201).json({ message: 'College registration successful. Awaiting admin approval.' });
    } catch (err) {
        res.status(500).json({ error: 'College registration failed. Please try again.' });
    }
};

exports.approveCollege = async (req, res) => {
    try {
        const collegeId = req.params.id;
        const college = await College.findByIdAndUpdate(collegeId, { isApproved: true }, { new: true });
        if (!college) {
            return res.status(404).json({ message: 'College not found.' });
        }

                    const emailSubject = "Host Request is Approved by Admin";
                    const emailText = `Hello ${college?.name},\n\nYour HOST Request is Accepted By Admin..!\n\n Now You can Host any Events for a Free ..! Login to a dashboard to host a event link is given below`;
                    const emailHtml = `
                        <p>Hello <strong>${college?.name}</strong>,</p>
                        <p>Your Request is accepted: <strong>By Admin..!</strong></p>
                        <a href=${'localhost:5173/'}>Click Here To login</a> 
                        <p>Thanks,</p>
                        <p>Your Campus Connect Team</p>
                    ` ;
        
                    await sendEmail(college?.contactEmail, emailSubject, emailText, emailHtml);
        res.status(200).json({ message: 'College approved successfully.', college });
    } catch (err) {
        res.status(500).json({ error: 'Failed to approve college.' });
    }
};
exports.rejectCollege = async (req, res) => {
    try {
        const collegeId = req.params.id;
        const college = await College.findByIdAndUpdate(collegeId, { isApproved: false }, { new: true });
        if (!college) {
            return res.status(404).json({ message: 'College not found.' });
        }

        const emailSubject = "Host Request is Rejected by Admin";
                    const emailText = `Hello ${college?.name},\n\nYour HOST Request is Rejected By Admin..!\n\n Now You can't Host any Events for a Free ..!`;
                    const emailHtml = `
                        <p>Hello <strong>${college?.name}</strong>,</p>
                        <p>Your Request is rejected: <strong>By Admin..!</strong></p>
                        <p>Thanks,</p>
                        <p>Your Campus Connect Team</p>
                    ` ;
                await sendEmail(college?.contactEmail, emailSubject, emailText, emailHtml);
        res.status(200).json({ message: 'College rejected successfully.', college });
    } catch (err) {
        res.status(500).json({ error: 'Failed to rejected college.' });
    }
};
exports.getAllColleges=async(req,res)=>{
    try{
        const allColleges = await College.find({}).sort({ isApproved: 1, registrationDate: -1 });
        return res.status(201).json({allColleges});
    }
    catch (err) {
        return res.status(500).json({ error: 'Login failed.' });
    }
}
exports.login = async (req, res) => {
    try {
        const { contactEmail, password } = req.body.form;
        console.log(req.body);
        const college = await College.findOne({ contactEmail });
        if (!college) {
            return res.status(404).json({ message: 'College not found.' });
        }

        const isMatch = await bcrypt.compare(password, college.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        if (!college.isApproved) {
            return res.status(403).json({ message: 'Your account is pending admin approval.' });
        }
        // const newUser=await User({
        //     username:college?.name,
        //     email:college?.contactName,
        //     password:college?.password,
        //     role:"organizer",
        // })
        // await newUser.save();
        const payload={
            username:college?.name,
            email:college?.contactEmail,
            role:"organizer",
            _id:college?._id,
        }
        const token=await generateToken(payload)
        res.status(200).json({ message: 'Login successful.', token });
    } catch (err) {
        res.status(500).json({ error: 'Login failed.' });
    }
};

