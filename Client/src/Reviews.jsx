import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Review from './Review';


class Reviews extends Component
{
    changedISBN = "";
    constructor(props)
    {
        super(props);
        this.state = {
            isbn13: "",
        };
    }

    componentDidMount()
    {
        if (!this.state.isbn13)
        {
            let isbn13 = 9780134843551;
            this.props.history.push(`/Reviews?isbn13=${isbn13}`);
        }
    }

    static getDerivedStateFromProps(props, state)
    {
        let searchParams = new URLSearchParams(props.location.search);
        let isbn13 = searchParams.get("isbn13") || "";
        return { isbn13 }
    }

    changeHandler = (e) =>
    {
        this.changedISBN = e.target.value;
    }

    searchClickHandler = () =>
    {
        this.props.history.push(`/Reviews?isbn13=${this.changedISBN}`);
    }

    render()
    {
        return (
            <React.Fragment>
                <div className="search-container">
                    <input type="search" placeholder="Please type in the ISBN-13 of the book" autoFocus={true} required={true} onChange={this.changeHandler} />
                    <button className="search-button" onClick={this.searchClickHandler}>Go</button>
                </div>
                <Review isbn13={this.state.isbn13} />
            </React.Fragment>
        );
    }
}

export default withRouter(Reviews);