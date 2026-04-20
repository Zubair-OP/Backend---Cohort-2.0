import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: false },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        }
    },
    fullname: { type: String, required: true },
    role: {
        type: String,
        enum: [ "buyer", "seller" ],
        default: "buyer"
    },
    googleId: {
        type: String,
    }
})


userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
})


userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}



const User = mongoose.model('User', userSchema);


export default User;
