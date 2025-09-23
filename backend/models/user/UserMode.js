const mongoose=require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
  password: {
        type: String,
  },
  role: { type: String, enum: ["student", "organizer", "admin"], default: "student" },
  loginTime: { type: Date},
  createdAt: { type: Date, default: Date.now },
  otp: {
        type: String,
        required: false,
    },
    otpExpires: {
        type: Date,
        required: false,
  },
  googleId:{
    type: String,
  },
  visitedEvents: [
    {
      eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
      visitedAt: { type: Date, default: Date.now }
    }
  ]
},{timestamps:true});

userSchema.pre("save", function (next) {
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

  this.visitedEvents = this.visitedEvents.filter(
    (event) => event.visitedAt >= fifteenDaysAgo
  );

  next();
});

userSchema.methods.getActiveVisitedEvents = function () {
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

  return this.visitedEvents.filter(event => event.visitedAt >= fifteenDaysAgo);
};

module.exports=mongoose.model("User",userSchema)