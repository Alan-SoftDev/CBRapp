const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const BookAPI = require('./datasources/bookapi');
const DatabaseAPI = require('./datasources/database');
const willCurrentUser = require('./datasources/lib');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        bookAPI: new BookAPI(),
        databaseAPI: new DatabaseAPI()
    }),
    context: async ({ req }) => {
        const token = req.headers.authorization;
        if (!token) 
        {
           let currentUser = { userID: 'NOuserID', name: '' };
           return {currentUser}
        }
        console.log("Normal token:" + token)
        let currentUser = await willCurrentUser(token);
        return { currentUser }
    }
});

server.listen().then(({ url }) => console.log(`Server is running at ${url} now!`));
