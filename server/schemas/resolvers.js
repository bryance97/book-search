const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    //Handle Queries
    Query: {
        //get a single user by username
        me: async (parents, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user_id })
                    .select('-__v -password')
                    .populate('savedBooks')

                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
        //get all users
        users: async () => {
            return User.find()
                .select('-__v -password')
        },
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
        }
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            //checks if user email is in the system
            if (!user) {
                throw new AuthenticationError('Email not in the system')
            }

            //checks if password is correct for corresponding email
            const correctPW = await user.isCorrectPassword(password)
            if (!correctPW) {
                throw new AuthenticationError('Incorrect password')
            }

            //create jwt for user
            const token = signToken(user)

            return { token, user }
        },
        addUser: async (parent, args) => {
            //create user and assing in a jwt
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user }
        },
        saveBook: async (parent, args, context) => {
            //if user account exists...
            if (context.user) {
                const updateUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args.input } },
                    { new: true }
                )
                return updateUser
            }
            //if user account doesn't exist display message
            throw new AuthenticationError('You need to be logged in');
        },
        removeBook: async (parent, args, context) => {
            if (context.user) {
                const updateUser = await User.findByIdAndUpdate(
                    //identify the proper user based on the id
                    { _id: context.user._id },
                    //remove the book from 'savedbooks' based on the given by the user 
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true }
                )
                return updateUser
            }
            //if user account doesn't exist display message
            throw new AuthenticationError('You need to be logged in');
        }
    }

}

module.exports = resolvers;