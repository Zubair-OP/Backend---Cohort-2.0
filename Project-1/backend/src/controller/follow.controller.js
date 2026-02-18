const followModel = require('../model/follow.model');

const followController = async (req ,res) =>{
    try {
        const follower = req.user.username;
        const followee = req.params.username;

        if(followee === follower){
            return res.status(400).json({ message : "You cannot follow yourself" })
        }

        isfolloweeExist = await followModel.findOne({ followee })

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


module.exports = { 
    followController,
    unfollowController
 }