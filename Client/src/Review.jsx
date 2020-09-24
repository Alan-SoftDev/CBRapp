import React from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { withApollo } from '@apollo/react-hoc';
import ReviewPage from './ReviewPage';

export const BOOK_SEARCH = gql`
query searchedBook($isbn13:String!){
    searchByISBN(isbn13:$isbn13){
            image
            isbn13
            title
            authors
            description
            year
            publisher
            pages
            reviews {
                reviewID
                created
                text
                category
                reviewer {
                    userID
                    name
                }       
                likes {
                   userID
                    liketick
                }
            }
    }
}`;

const LIKE_UPDATE = gql`
mutation click($reviewID:ID! $like:LikeType!){
    clickLike(reviewID:$reviewID like:$like){
         success
         message
         review {
            reviewID
            likes{
                liketick
                userID
            }
         }
    }
}
`;

const Review = (props) =>
{
    const [submitted, setSubmitted] = React.useState(false);
    const [reviewPermit, setReviewPermit] = React.useState(false);
    const [buttonPermit, setButtonPermit] = React.useState(false);

    const closeOpenForm = () =>
    {
        setSubmitted(true);
        setReviewPermit(false);
        setButtonPermit(false);
    }

    const [clickLike] = useMutation(LIKE_UPDATE);
    const { loading, error, data } = useQuery(BOOK_SEARCH, { variables: { isbn13: props.isbn13 } });
    if (loading) return <div className="loader"></div>;
    if (!error)
    {
        let book = data.searchByISBN;
        let { me } = props.client.readQuery({ query: gql`{ me { name } }` });
        let output = book.reviews.map(review => review.reviewer.name);
        let out = output.filter(name => name === me.name);
        if (out.length === 0 && !buttonPermit && !submitted) setButtonPermit(true);
        return (
            <div className="list-container">
                <div className="reviewBook-container">
                    <img src={book.image} alt="The selected book" />
                    <div className="book-content">
                        <p style={{ fontWeight: "bold", fontSize: "18px" }}>{book.title}</p>
                        <p style={{ fontWeight: "bold", fontSize: "18px" }}>by: {book.authors}</p>
                        <p style={{ fontSize: "16px" }}>{book.description}</p>
                        <pre style={{ fontFamily: "inherit" }}>
                            <p style={{ fontSize: "16px" }}><b>Publisher:</b> {book.publisher}    |    <b>Year:</b> {book.year}    |    <b>ISBN-13:</b> {book.isbn13}    |    <b>Pages:</b> {book.pages}</p>
                        </pre>
                    </div>
                </div>
                {(buttonPermit) ? <div><button style={{ position: "relative", textAlign: "center", backgroundColor: "#318FB5", color: "white", cursor: "pointer", borderRadius: "5px", left: "25%", margin: "2px 0 20px 0", fontSize: "18px", width: "50%" }} onClick={() => setReviewPermit(true)}> Click to write a review for this book! </button></div> : <p style={{ padding: "10px 0", fontFamily: "inherit", fontSize: "18px", textAlign: "center", backgroundColor: "#0F4C75", color: "white" }}>You have alredy written a review for this book!</p>}
                {reviewPermit && <ReviewPage isbn13={props.isbn13} reviewFormOpen={reviewPermit} closeOpenForm={closeOpenForm} />}
                <div>
                    {book.reviews.map(review =>
                        <div className="review-container" key={review.reviewID}>
                            <div className="review-content">
                                <pre style={{ fontFamily: "inherit" }}>
                                    <p style={{ fontSize: "16px" }}><b>Reviewer:</b> {review.reviewer.name}    |    <b>Created:</b> {review.created}    |    <b>Category:</b> {review.category}</p>
                                </pre>
                                <p style={{ fontSize: "18px" }}>{review.text}</p>
                                <p>
                                    <button onClick={() => clickLike({ variables: { reviewID: review.reviewID, like: "LIKE" }, refetchQueries: [{ query: BOOK_SEARCH, variables: { isbn13: props.isbn13 } }] })} style={{ fontSize: "20px", borderRadius: "5px" }}><i className="fa fa-thumbs-up">({review.likes.filter(like => like.liketick === "LIKE").length})</i></button>
                                    <button onClick={() => clickLike({ variables: { reviewID: review.reviewID, like: "DISLIKE" }, refetchQueries: [{ query: BOOK_SEARCH, variables: { isbn13: props.isbn13 } }] })} style={{ fontSize: "20px", borderRadius: "5px" }}><i className="fa fa-thumbs-down">({review.likes.filter(like => like.liketick === "DISLIKE").length})</i></button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    else
    {
        return null;
    }
}

export default withApollo(Review);

