import './Gallery.css'
import React, { Component } from 'react';


class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = { slideIndex: 1 };
    }

    plusSlides = (n) => {
        let slideIndex = this.state.slideIndex + n;
        if (slideIndex > this.props.books.length) {
            this.setState({ slideIndex: 1 })
        }
        else if (slideIndex < 1) {
            this.setState({ slideIndex: this.props.books.length })
        }
        else {
            this.setState({ slideIndex })
        }
    };

    currentSlide = (n) => {
        this.setState({ slideIndex: n })
    };

    render() {
        return (
            <section>
                <div className="container">

                    <div className="mySlidesContainer">

                        <div className="textLeft">
                            <p style={{ textAlign: "left", fontWeight: "bold" }}> Welcome to Computer Science Book Review Application</p>
                            <p style={{ fontSize: "20px" }}>
                                How to use this application: <br /><br />
                                First, click on the sign in icon at the top left to sign in with your GitHub account. You also need OAuth Client-ID and Client-Secret that you can get them when you set up your GitHub OAuth for this app.<br />
                                After signing in, you can search for books, write review, read reviews written by other users and like their reviews. <br />
                                Finally, sign out and do not forget to go to your GitHub account and sign out there as well.
                            </p>
                        </div>

                        <div className="imageRight">
                            {this.props.books.map((book, index) => (
                                <div key={index} className="mySlides" style={(this.state.slideIndex !== index + 1) ? { display: "none" } : { display: "block" }}>
                                    <a className="prev" onClick={() => this.plusSlides(-1)}>❮</a>
                                    <img className="homeimage" src={book.image} alt={this.props.books[this.state.slideIndex - 1].title} />
                                    <a className="next" onClick={() => this.plusSlides(1)}>❯</a>
                                    <div className="numbertext">{index + 1} / 10</div>
                                </div>
                            )
                            )}
                            <div className="caption-container">
                                <p id="caption" style={{fontStyle:"italic"}}>
                                    Book title: {this.props.books[this.state.slideIndex - 1].title} <br />
                                    By: {this.props.books[this.state.slideIndex - 1].authors} <br />
                                    Publisher: {this.props.books[this.state.slideIndex - 1].publisher} <br /> Year: {this.props.books[this.state.slideIndex - 1].year} <br /> Number of Pages:  {this.props.books[this.state.slideIndex - 1].pages}
                                </p>
                            </div>
                        </div>
                    </div>


                    <div className="row">
                        {this.props.books.map((book, index) => (
                            < div key={index} className="column" >
                                <img className={(this.state.slideIndex !== index + 1) ? "demo cursor" : "demo cursor active"} src={book.image} style={{ width: "100%" }} onClick={() => this.currentSlide(index + 1)} alt={`Year:${book.year}, Pages:${book.pages}`} />
                            </div>
                        )
                        )}
                    </div>
                </div>
            </section>
        );
    }
}

export default Gallery;