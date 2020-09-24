import React, { Component } from 'react';
import ReviewForm from './ReviewForm';
import { withRouter } from 'react-router-dom';


class ReviewPage extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            reviewFormOpen: this.props.reviewFormOpen,
            reviewText: "",
            category: "TECHNICAL",
            isbn13: this.props.isbn13 || ""
        };
    }

    static getDerivedStateFromProps(props, state)
    {
        let newReviewFromOpen = props.reviewFormOpen;
        return { ...state, reviewFormOpen : newReviewFromOpen}
    }


    onReviewTextChangeHandler = (reviewText) =>
    {
        this.setState({ reviewText });
    }
    onCategoryChangeHandler = (category) =>
    {
        this.setState({ category });
    }
    onISBN13ChangeHandler = (isbn13) =>
    {
        this.setState({ isbn13 });
    }

    closeHandler =  () =>
    {
        this.setState({ reviewFormOpen: false });
    }
    submitHandler = () =>
    {
        this.props.closeOpenForm();
        this.setState({ reviewFormOpen: false });
    }

    render()
    {
        return (
            <ReviewForm
                open={this.state.reviewFormOpen}
                isbn13={this.state.isbn13}
                reviewText={this.state.reviewText}
                category={this.state.category}
                onReviewTextChangeHandler={this.onReviewTextChangeHandler}
                onCategoryChangeHandler={this.onCategoryChangeHandler}
                onISBN13ChangeHandler={this.onISBN13ChangeHandler}
                closeHandler={this.closeHandler}
                submitHandler={this.submitHandler}

            />
        );
    }
}

export default withRouter(ReviewPage);