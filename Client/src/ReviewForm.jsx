import React from 'react';
import './ReviewForm.css';
import { useMutation, gql } from '@apollo/client'
import { BOOK_SEARCH } from './Review';


const WRITE_REVIEW = gql`
mutation writeReviewUpdate($isbn13: String! $text: String! $category: ReviewCategory){
    writeReview(isbn13: $isbn13 text: $text category: $category) {
         success
         message
         review {
            reviewID
            created
            text
            reviewer{
                userID
                name
            }
            category
            likes{
                liketick
                userID
            }
         }

    }
}
`;


const ReviewForm = (props) =>
{
    const [track] = useMutation(WRITE_REVIEW);

    const onReviewTextChangehandler = (e) =>
    {
        props.onReviewTextChangeHandler(e.target.value);
    };
    const onCategoryChangehandler = (e) =>
    {
        props.onCategoryChangeHandler(e.target.value);
    };
    const onISBN13Changehandler = (e) =>
    {
        props.onISBN13ChangeHandler(e.target.value);
    };
    const closehandler = () =>
    {
        props.closeHandler();
    }
    const submithandler = () =>
    {
        track({ variables: { isbn13: props.isbn13, text: props.reviewText, category: props.category }, refetchQueries: [{ query: BOOK_SEARCH, variables: { isbn13: props.isbn13 } }] }); 
        props.submitHandler();
    }
    return (
        <div className={props.open ? "page-container review-visible" : "page-container"}>
            <button style={{ position: "absolute", top: "0", right: "0" }} onClick={closehandler}>X</button>
            <form id="form1" className="form-container" onSubmit={submithandler}>
                <div className="form-group">
                    <label htmlFor="isbn13" style={{ fontWeight: "bold" }}> Book's ISBN-13 </label>
                    <input id="isbn13" name="isbn13" type="text" placeholder="ISBN-13" required={true} value={props.isbn13} onChange={onISBN13Changehandler} />
                </div>
                <div className="form-group">
                    <label htmlFor="category" style={{ fontWeight: "bold" }}>Category:</label><br />
                    <input type="radio" id="ORGANIZATIONAL" name="category" value="ORGANIZATIONAL" checked={props.category === "ORGANIZATIONAL"} onChange={onCategoryChangehandler} />
                    <label htmlFor="ORGANIZATIONAL">Organizational</label><br />
                    <input type="radio" id="TECHNICAL" name="category" value="TECHNICAL" checked={props.category === "TECHNICAL"} onChange={onCategoryChangehandler} />
                    <label htmlFor="TECHNICAL">Technical</label><br />
                    <input type="radio" id="PRACTICAL" name="category" value="PRACTICAL" checked={props.category === "PRACTICAL"} onChange={onCategoryChangehandler} />
                    <label htmlFor="PRACTICAL">Practical</label><br />
                </div>
                <div className="form-group">
                    <label htmlFor="review" style={{ fontWeight: "bold" }}>Your review text:</label>
                    <textarea id="review" name="reviewText" rows="15" required={true} placeholder="This book ..." value={props.reviewText} onChange={onReviewTextChangehandler} />
                </div>
                <div className="form-group">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div >
    );
}

export default ReviewForm;