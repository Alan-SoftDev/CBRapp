const { gql } = require('apollo-server');

const typeDefs = gql`
scalar DateTime

enum ReviewCategory {
    TECHNICAL
    PRACTICAL
    ORGANIZATIONAL
}

enum LikeType {
    LIKE
    DISLIKE
}

type LoginPayload {
    token : String!
    userID : ID!
    name : String!
}

type BookPayload {
    page : Int
    maxPageNumber : Int
    books : [Book]
 }

type UserLike {
    userID:ID!
    liketick: LikeType
}

type User {
    userID : ID!
    name : String!
    reviewdBooks : [Review]!
    likedReviews : [Review]!
}

type Book {
    title : String
    description : String
    authors : String
    isbn10 : String
    isbn13 : String
    publisher : String
    pages : Int
    year : Int
    image : String
    url : String
    pdfs : [String]
    reviews : [Review]
}

type Review {
    reviewID : ID!
    created : DateTime
    text : String
    book : Book
    reviewer : User
    category : ReviewCategory
    likes : [UserLike]
}

type Query {
    searchByISBN(isbn13:String!) : Book
    searchByKeyword(keyword:String! page:Int=1) : BookPayload
    totalUsers : Int
    allUsers : [User]
    user(userID:ID!) : User
    me : User
}

type ReviewUpdate {
    success : Boolean!
    message : String
    review : Review
}

type Mutation {
    writeReview(isbn13:String! text:String! category:ReviewCategory): ReviewUpdate!
    clickLike(reviewID:ID! like:LikeType!): ReviewUpdate!
    authLogin(code: String! client_id: String! client_secret: String!): LoginPayload!
}

`;

module.exports = typeDefs;
