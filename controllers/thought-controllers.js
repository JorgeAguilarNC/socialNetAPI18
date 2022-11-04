const { Thought, User } = require('../models');

const thoughtController = {
    //get thoughts
    getThoughts(req, res) {
        Thought.find()
            .sort({ createdAt: -1 })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
// get one user
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    createThought(req,res) {
        Thought.create(req.body)
            .then((dbThoughtData) => {
                return User.findOneAndUpdate(
                    {_id: req.body.userId},
                    {$push: { thoughts: dbThoughtData._id }},
                    {new: true}
                );
            })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //update thought
    updateThought(req,res) {
        Thought.findOneAndUpdate ({ _id: req.params.thoughtId }, { $set:req.body }, { runValidators: true, new: true })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    //remove thought
    deleteThought(req,res) {
        Thought.findOneAndRemove ({ _id: req.params.thoughtId })
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought with this id' });
            }
            return User.findOneAndUpdate(
                {thoughts: req.params.thoughtId},
                {$pull: { thoughts: req.params.thoughtId }},
                {new: true}
            );
        })
        . then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    // add reaction
    addReaction(req,res) {
        Thought.findOneAndUpdate ({ _id: req.params.thoughtId }, { $addToSet:{ reactions: req.body }}, { runValidators: true, new: true })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    //remove reaction
    removeReaction(req,res) {
        Thought.findOneAndUpdate ({ _id: req.params.thoughtId }, { $pull:{ reactions: {reactionId: req.params.reactionId } }}, { runValidators: true, new: true })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    }
};

module.exports = thoughtController;