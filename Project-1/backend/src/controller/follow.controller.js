const followModel = require('../model/follow.model');
const userModel = require('../model/user.model');

const followController = async (req ,res) =>{
    try {
        const follower = req.user.username;
        const followee = req.params.username;

        if(followee === follower){
            return res.status(400).json({ message : "You cannot follow yourself" })
        }

        const isfolloweeExist = await userModel.findOne({ name: followee })

        if(!isfolloweeExist){
            return res.status(404).json({ message : "The user you are trying to follow does not exist" })
        }

        const isAlreadyFollowing = await followModel.findOne({ follower, followee })

        if(isAlreadyFollowing){
            return res.status(400).json({ message : "You are already following this user" })
        }

        const newFollow = await followModel.create({ follower, followee });



        return res.status(201).json({ 
            message : "User followed successfully", 
            newFollow 
        })
    } catch (error) {
        return res.status(500).json({ message : "Internal Server Error" })
    }
}

const unfollowController = async (req, res) => {
    try {
        const follower = req.user.username;
        const followee = req.params.username;

        const isAlreadyFollowing = await followModel.findOne({ follower, followee })

        if(!isAlreadyFollowing){
            return res.status(400).json({ message : `You already not following ${followee}` })
        }

        await followModel.findByIdAndDelete(isAlreadyFollowing._id)

        return res.status(200).json({
            message : `You have unfollowed user ${followee} successfully`
        })


    } catch (error) {
        return res.status(500).json({ message : "Internal Server Error" })
    }
}


const sendRequestController = async (req, res) => {
 try {
    const sender = req.user.username;
    const receiver = req.params.username;

    if(sender === receiver){
        return res.status(400).json({ message : "You cannot send follow request to yourself" })
    }

    const isReceiverExist = await userModel.findOne({ name : receiver })
    if(!isReceiverExist){
        return res.status(404).json({ message : "The user you are trying to follow does not exist" })
    }

    if(isReceiverExist.status === "pending"){
        return res.status(400).json({ message : "You have already sent a follow request to this user" })
    } 

    if(isReceiverExist.status === "accepted"){
        return res.status(400).json({ message : "You are already freinds" })
    }

    if(isReceiverExist.status === "rejected"){
        isReceiverExist.status = "pending"
        await isReceiverExist.save()
        return res.status(200).json({ message : "Follow request sent successfully" })
    }

    const newFollowRequest = await followModel.create({ 
        follower : sender, 
        followee : receiver, 
        status : "pending" 
    })

    return res.status(201).json({
        message : "Follow request sent successfully",
        newFollowRequest
    })
 } catch (error) {
    return res.status(500).json({ message : "Internal Server Error" })
 }   
}

const acceptRequestController = async (req, res) => {
    try {

        const loggedInUser = req.user.username;
        const requestSender = req.params.username;

        // requestSender ne loggedInUser ko follow request bheji thi
        const request = await followModel.findOne({ follower : requestSender, followee : loggedInUser, status : "pending" })

        if(!request){
            return res.status(404).json({ message : "No follow request found" })
        }

        request.status = "accepted"
        await request.save()

        return res.status(200).json({
            message : "Follow request accepted successfully" 
        
        })

    } catch (error) {
        return res.status(500).json({ message : "Internal Server Error" })   
    }
}

module.exports = { 
    followController,
    unfollowController,
    sendRequestController,
    acceptRequestController
 }