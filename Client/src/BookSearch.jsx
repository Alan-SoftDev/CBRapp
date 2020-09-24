import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Books from './Books';


class BookSearch extends Component
{
    changedKeyword = "";

    constructor(props)
    {
        super(props);
        this.state = {
            keyword: "",
            page: 1,
        };
    }

    componentDidMount()
    {
        let keyword = "reactive";
        let page = 1;
        this.props.history.push(`/BookSearch?keyword=${keyword}&page=${page}`);
    }

    static getDerivedStateFromProps(props, state)
    {
        let searchParams = new URLSearchParams(props.location.search);
        let keyword = searchParams.get("keyword") || "";
        let page = parseInt(searchParams.get("page") || "");
        return { keyword, page }
    }

    changeHandler = (e) =>
    {
        this.changedKeyword = e.target.value;
    }

    searchClickHandler = () =>
    {
            this.props.history.push(`/BookSearch?keyword=${this.changedKeyword}&page=1`);
    }

    render()
    {
        return (
            <React.Fragment>
                <div className="search-container">
                    <input type="search" placeholder="Search books by title, author, ISBN-13 or any keywords"  autoFocus={true} required={true} onChange={this.changeHandler.bind(this)} />
                    <button className="search-button" onClick={this.searchClickHandler}>Go</button>
                </div>
                <Books keyword={this.state.keyword} page={this.state.page}/>
            </React.Fragment>
        );
    }
}

export default withRouter(BookSearch);