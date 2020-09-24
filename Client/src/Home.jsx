import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Gallery from './Gallery';

const BOOKS_HOME = gql`
query {
    searchByKeyword(keyword:"React"){
        books{
            title
            authors
            image
            publisher
            year
            pages
        }
    }
}`;

const Home = () =>
{
    const { loading, error, data } = useQuery(BOOKS_HOME);
    if (loading) return <div className="loader"></div>;
    if (error) return null; 
    return (
        <React.Fragment>
            <Gallery books={data.searchByKeyword.books} />
        </React.Fragment>

    );
}

export default Home;