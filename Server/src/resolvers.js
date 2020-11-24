const { GraphQLScalarType } = require('graphql');
const authorizeWithGithub = require('./datasources/utils');
require('dotenv').config();

module.exports = {
    Query: {
        searchByISBN: async (_, { isbn13 }, { dataSources }) => {
            const book = await dataSources.bookAPI.getByISBN(isbn13);
            return book
        },
        searchByKeyword: async (_, { keyword, page }, { dataSources }) => {
            const books = await dataSources.bookAPI.getByKeyword(keyword, page);
            return books;
        },
        totalUsers: async (_, __, { dataSources}) => {
            const totalUsers = await dataSources.databaseAPI.getUsers();
            return totalUsers.total;
        },
        allUsers: async (_, __, { dataSources }) => {
            const totalUsers = await dataSources.databaseAPI.getUsers();
            return totalUsers.users;
        },
        user: async (_, { userID }, { dataSources }) => {
            const user = await dataSources.databaseAPI.getUser(userID);
            return user;
        },
        me: async (_, __, { currentUser }) => currentUser
    },
    Book: {
        reviews: async (parent, _, { dataSources }) => {
            const reviews = await dataSources.databaseAPI.getReviews(parent.isbn13);
            return reviews;
        }
    },

    Review: {
        reviewer: async (parent, _, { dataSources }) => {
            const reviewer = await dataSources.databaseAPI.getReviewer(parent.reviewID);
            return reviewer;
        },
        likes: async (parent, _, { dataSources }) => {
            const likes = await dataSources.databaseAPI.getlikes(parent.reviewID);
            return likes;
        },
        book: async (parent, _, { dataSources }) => {
            const isbn13 = await dataSources.databaseAPI.getISBN(parent.reviewID);
            const book = await dataSources.bookAPI.getByISBN(isbn13);
            return book;
        },
    },            

    User: {
        reviewdBooks: async (parent, _, { dataSources }) => {
            const reviewdBooks = await dataSources.databaseAPI.getReviewedBooks(parent.userID);
            return reviewdBooks;
        }, 
        likedReviews: async (parent, _, { dataSources }) => {
            const likedReviews = await dataSources.databaseAPI.getLikedReviews(parent.userID);
            return likedReviews;
        }, 
    },

    Mutation: {
        writeReview: async (_, { isbn13, text, category }, { dataSources }) => {
            const out = await dataSources.databaseAPI.setReview(isbn13, text, category);
            const review = await dataSources.databaseAPI.getReview(out.reviewID);
            return { success: out.success, message: out.message, review };
        },
        clickLike: async (_, { reviewID, like }, { dataSources }) => {
            const out = await dataSources.databaseAPI.setLike(reviewID, like);
            const review = await dataSources.databaseAPI.getReview(reviewID);
            return { success: out.success, message: out.message, review };
        },
        authLogin: async (_, { code }, { dataSources }) => {
            output = await authorizeWithGithub(code, process.env.CLIENT_ID, process.env.CLIENT_SECRET);
            if (output.message) {
                throw new Error(output.message)
            };
            let userInfo = {
                userID: output.login,
                name: output.name || output.login,
                token: output.access_token
            };
            const affectedrows = await dataSources.databaseAPI.setUser(userInfo);
            return {
                userID: output.login,
                name: output.name || output.login,
                token: output.access_token
            }
        }
    },

    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'A valid date time value.',
        parseValue: value => new Date(value),
        serialize: value => new Date(value).toISOString(),
        parseLiteral: ast => ast.value
    }),
}

