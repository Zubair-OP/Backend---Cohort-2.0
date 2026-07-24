import mongoose, { Document } from "mongoose";
import { Iuser } from "../types/user.types";
import bcrypt from "bcrypt"


interface NewDocument extends Omit<Iuser, '_id'>,Document{
    ComparePassword(password: string) : Promise<boolean>
}

const userSchema = new mongoose.Schema<NewDocument>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
    },
    Mobile: {
        type: String,
        minlength:10,
        maxlength:10
    }
},{
    timestamps: true
})

userSchema.pre('save', function (): void{
    if(!this.isModified('password')) return;
    this.password = bcrypt.hashSync(this.password, 10)
})

userSchema.methods.ComparePassword = function (password : string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
}
const UserModel = (mongoose.models.User as mongoose.Model<NewDocument>) || mongoose.model<NewDocument>('User', userSchema);
export default UserModel;