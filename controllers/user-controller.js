const { Thought, User } = require('../models');

const userController = {
    //get all users
    getUsers(req, res) {
        User.find()
            .sort({ createdAt: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //get one user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //create user
    createUser(req,res) {
        User.create(req.body)
            .then((dbUserData) => {
                res.json(dbUserData);
            })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },
    //update user
    updateUser(req,res) {
        User.findOneAndUpdate ({ _id: req.params.userId }, { $set:req.body }, { runValidators: true, new: true })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },
    //delete user
    deleteUser(req,res) {
        User.findOneAndRemove ({ _id: req.params.userId })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user with this id' });
            }
            return Thought.deleteMany({_id:{$in:dbUserData.thoughts}})
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    },
    //add friend
    addFriend(req,res) {
        User.findOneAndUpdate ({ _id: req.params.userId }, { $addToSet:{ friends: req.params.friendId }}, { runValidators: true, new: true })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user with this id' });
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    // remove friend
    removeFriend(req,res) {
        User.findOneAndUpdate ({ _id: req.params.userId }, { $pull:{ friends: req.params.friendId }}, { runValidators: true, new: true })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    }
}

module.exports = userController;