import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { withRouter } from 'react-router-dom';



const BOOKS_SEARCH = gql`
query searchedBooks($keyword:String! $page:Int){
    searchByKeyword(keyword:$keyword page:$page){
        page
        maxPageNumber
        books{
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
                reviewer {
                    userID
                    name
                }       
                category
                likes {
                   userID
                    liketick
                }
            }
        }
    }
}`;

const Books = (props) =>
{
    const decrementHandler = () =>
    {
        let newPage = props.page - 1;
        if (newPage < 1) newPage = 1; 
        props.history.push(`/BookSearch?keyword=${props.keyword}&page=${newPage}`);
    }
    const incrementHandler = (maxPage) =>
    {
        let newPage = props.page + 1;
        if (newPage > maxPage) newPage = maxPage; 
        props.history.push(`/BookSearch?keyword=${props.keyword}&page=${newPage}`);
    }

    const selectHandler = (aPage) =>
    {
        props.history.push(`/BookSearch?keyword=${props.keyword}&page=${aPage}`);
    }

    const btnClickHandler = (isbn13) =>
    {
        props.history.push(`/Reviews?isbn13=${isbn13}`);
    }

    const { loading, error, data } = useQuery(BOOKS_SEARCH, { variables: { keyword:props.keyword, page:props.page } });

    if (loading) return <div className="loader"></div>;
    if (!error)
    {
        let books = data.searchByKeyword.books;
        let maxPageNumber = data.searchByKeyword.maxPageNumber;
        let activePage = data.searchByKeyword.page;
        let second = (activePage < maxPageNumber - 2 && activePage > 2) ? activePage - 1 : (activePage < 3 ? 2 : maxPageNumber - 4);
        if (maxPageNumber < 7) second = 2;
        let third = (activePage < maxPageNumber - 2 && activePage > 2) ? activePage : (activePage < 3 ? 3 : maxPageNumber - 3);
        if (maxPageNumber < 7) third = 3;
        let fourth = (activePage < maxPageNumber - 2 && activePage > 2) ? activePage + 1 : (activePage < 3 ? 4 : maxPageNumber - 2);
        if (maxPageNumber < 7) fourth = 4;
        let fifth = (activePage < maxPageNumber - 2 && activePage > 2) ? activePage + 2 : (activePage < 3 ? 5 : maxPageNumber - 1);
        if (maxPageNumber < 7) fifth = 5;

        return (
            <div className="list-container">
                <div className="pagination">
                    <div> Pages: </div> 
                    <a onClick={decrementHandler} style={(maxPageNumber > 1) ? { visibility: "visible" } : { display: "none" }}>&laquo; Prev</a>
                    <div> | </div> 
                    <a onClick={() => selectHandler(1)} className={(activePage === 1) ? "active" : "null"}>1</a>
                    <a style={(activePage > 3 && maxPageNumber > 6) ? { visibility: "visible" } : { display: "none" }}>...</a>
                    <a onClick={() => selectHandler(second)} className={(activePage === second) ? "active" : "null"} style={(maxPageNumber > 2) ? { visibility: "visible" } : { display: "none" }}>{second}</a>
                    <a onClick={() => selectHandler(third)} className={(activePage === third) ? "active" : "null"} style={(maxPageNumber > 3) ? { visibility: "visible" } : { display: "none" }}>{third}</a>
                    <a onClick={() => selectHandler(fourth)} className={(activePage === fourth) ? "active" : "null"} style={(maxPageNumber > 4) ? { visibility: "visible" } : { display: "none" }}>{fourth}</a>
                    <a onClick={() => selectHandler(fifth)} className={(activePage === fifth) ? "active" : "null"} style={(maxPageNumber > 5) ? { visibility: "visible" } : { display: "none" }}>{fifth}</a>
                    <a style={(activePage < maxPageNumber - 3 && maxPageNumber > 6) ? { visibility: "visible" } : { display: "none" }}>...</a>
                    <a onClick={() => selectHandler(maxPageNumber)} className={(activePage === maxPageNumber) ? "active" : "null"} style={(maxPageNumber > 1) ? { visibility: "visible" } : { display: "none" }}>{maxPageNumber}</a>
                    <div> | </div> 
                    <a onClick={() => incrementHandler(maxPageNumber)} style={(maxPageNumber > 1) ? { visibility: "visible" } : { display: "none" }}>Next &raquo;</a>
                </div>
                <div>
                    {books.map(book =>
                        <div className="book-container" key={book.isbn13}>
                            <img src={book.image} alt="The selected book" />
                            <div className="book-content">
                                <p style={{ fontWeight: "bold", fontSize: "18px" }}>{book.title}</p>
                                <p style={{ fontWeight: "bold", fontSize: "18px" }}>by: {book.authors}</p>
                                <p style={{ fontSize: "16px" }}>{book.description}</p>
                                <pre style={{ fontFamily: "inherit" }}>
                                    <p style={{ fontSize: "16px" }}><b>Publisher:</b> {book.publisher}    |    <b>Year:</b> {book.year}    |    <b>ISBN-13:</b> {book.isbn13}    |    <b>Pages:</b> {book.pages}</p>
                                </pre>
                                <div><button onClick={() => btnClickHandler(book.isbn13)}>See reviews for this book ({(!!book.reviews?book.reviews.length:0)})</button></div>
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

export default withRouter(Books);

