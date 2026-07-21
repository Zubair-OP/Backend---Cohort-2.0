import mongoose, { Document } from "mongoose";
import { Iuser } from "../types/user.types";
import bcrypt from "bcrypt"


interface NewDocument extends Omit<Iuser, '_id'>,Document{
    ComparePassword(password: string) :boolean
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
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
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

userSchema.methods.ComparePassword = function (password : string): boolean {
    return bcrypt.compareSync(password, this.password)
}
const UserModel = mongoose.model<NewDocument>('User',userSchema)
export default UserModel