
const bcrypt = require('bcryptjs');
const User=require("../models/user/UserMode");
const { generateToken } = require('../auth/JWT');
const {sendEmail}=require("../utiltiles/email");


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.sign=async(req,res)=>{
    try{
        console.log(req.body);
        const {username,email,password,role}=req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });
        await newUser.save();
        return res.status(201).json({ msg: 'User registered successfully' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        

        const token=await generateToken(user);
        if(user.role==='student'){
            return res.status(200).json({user,token,path:"/",msg:"Login successfully"});
        }
        else if(user.role==='admin'){
            return res.status(200).json({user,token,path:"/admin-dashboard",sg:"Login successfully"});
        }
        else if(user.role==='organizer'){
            return res.status(200).json({user,token,path:"/organizer-dashboard",sg:"Login successfully"});
        }
        return res.status(200).json({user,token});
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const otp = generateOTP();
        const otpExpires = Date.now() + 15 * 60 * 1000;
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

            const emailSubject = "Password Reset otp";
            const emailText = `Hello ${user?.username},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP is valid for 15 minutes. Please do not share it with anyone.\n\nThanks,\nYour Campus Connect Team`;
            const emailHtml = `
                <p>Hello <strong>${user?.username}</strong>,</p>
                <p>Your OTP for password reset is: <strong>${otp}</strong></p>
                <p>This OTP is valid for 15 minutes. Please do not share it with anyone.</p>
                <p>Thanks,</p>
                <p>Your Campus Connect Team</p>
            ` ;

            await sendEmail(email, emailSubject, emailText, emailHtml);

        return res.status(200).json({ msg: 'OTP sent to your email' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ msg: 'Password has been reset successfully' });
    } catch (error) {
        console.error(error.message);
    }

}


exports.profile=async(req,res)=>{
    try{
        const {email}=req.user;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'Invalid credentials' });
        }
        return res.status(201).json({email:user?.email,username:user?.username});
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
}
