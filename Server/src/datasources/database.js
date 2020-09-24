const mysql = require('mysql');
const { DataSource } = require('apollo-datasource');
require('dotenv').config();

class DatabaseAPI extends DataSource {
    constructor() {
        super();
    };

    initialize(config) {
        this.context = config.context;
    }

    reviewsReducer(revs) {
        const reviews = revs.map(rev => ({
            reviewID: rev.idr,
            created: rev.created,
            text: rev.reviewtext,
            category: rev.category
        }));
        return reviews;
    }; 
    
    async conn() {
        let dbase = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB
        });
        return dbase;
    }

    async getReviews(isbn13) {
        let db = await this.conn();
        const revs = await new Promise(resolve => {
            db.connect(async (err) => {
                if (err) throw err;
                let sql = "SELECT * FROM review WHERE isbn13=" + mysql.escape(isbn13);
                let result = await new Promise(resolve => {
                    db.query(sql, (err, result) => {
                        if (err) throw err;
                        return resolve(result);
                    })
                })
                return resolve(result);
            })
        })
        db.end();
        return this.reviewsReducer(revs);
    };

    async getReviewer(reviewID) {
        let db = await this.conn();
        const {idu, name } = await new Promise(resolve => {
            db.connect(async (err) => {
                if (err) throw err;
                let sql = "SELECT idu, name FROM user WHERE idu = (SELECT idu FROM review WHERE idr=?);";
                let result = await new Promise(resolve => {
                    db.query(sql, [reviewID], (err, result) => {
                        if (err) throw err;
                        return resolve(result);
                    })
                })
                return resolve(result[0]);
            })
        })
        db.end();
        return { userID:idu, name };
    }

    async getlikes(reviewID) {
        let db = await this.conn();
        const output = await new Promise(resolve => {
            db.connect(async (err) => {
                if (err) throw err;
                let sql = "SELECT idu, liked FROM likedbyuser WHERE idr = ?";
                let result = await new Promise(resolve => {
                    db.query(sql, [reviewID], (err, result) => {
                        if (err) throw err;
                        return resolve(result);
                    })
                })
                return resolve(result);
            })
        })
        db.end();
        let likes = output.map(like => {
            let userID = like.idu;
            let liketick = like.liked==='y'? "LIKE" : "DISLIKE";
            return { userID, liketick };
        });
        return likes;
    }

    async getReviewedBooks(userID) {
        let db = await this.conn();
        const revs = await new Promise(resolve => {
            db.connect(async (err) => {
                if (err) throw err;
                let sql = "SELECT * FROM review WHERE idu=" + mysql.escape(userID);
                let result = await new Promise(resolve => {
                    db.query(sql, (err, result) => {
                        if (err) throw err;
                        return resolve(result);
                    })
                })
                return resolve(result);
            })
        })
        db.end();
        return this.reviewsReducer(revs);
    }

    async getLikedReviews(userID) {
        let db = await this.conn();
        const output = await new Promise(resolve => {
            db.connect(async (err) => {
                if (err) throw err;
                let sql = "SELECT idr, liked FROM likedbyuser WHERE idu=" + mysql.escape(userID);
                let result = await new Promise(resolve => {
                    db.query(sql, (err, result) => {
                        if (err) throw err;
                        return resolve(result);
                    })
                })
                return resolve(result);
            })
        })
        db.end();
        let likedReviews = output.map(like => {
            let reviewID = like.idr;
            let liketick = like.liked === 'y' ? "LIKE" : "DISLIKE";
            return { reviewID, liketick };
        });
        return likedReviews;
    }

    async getISBN(reviewID) {
        let db = await this.conn();
        const isbn13 = await new Promise(resolve => {
            db.connect(async (err) => {
                if (err) throw err;
                let sql = "SELECT isbn13 FROM review WHERE idr=" + mysql.escape(reviewID);
                let result = await new Promise(resolve => {
                    db.query(sql, (err, result) => {
                        if (err) throw err;
                        return resolve(result);
                    })
                })
                return resolve(result[0].isbn13);
            })
        })
        db.end();
        return isbn13;
    }

    async getUsers() {
        let db = await this.conn();
        const output = await new Promise(resolve => {
            db.connect(async (err) => {
                if (err) throw err;
                let sql = "SELECT idu, name FROM user";
                let result = await new Promise(resolve => {
                    db.query(sql, (err, result) => {
                        if (err) throw err;
                        return resolve(result);
                    })
                })
                return resolve(result);
            })
        })
        db.end();
        let users = output.map(user => ({ userID: user.idu, name: user.name }));
        let total = users.length;
        return { users, total};
    }

    async getUser(userID) {
        let db = await this.conn();
        const output = await new Promise(resolve => {
            db.connect(async (err) => {
                if (err) throw err;
                let sql = "SELECT idu, name FROM user WHERE idu=" + mysql.escape(userID);
                let result = await new Promise(resolve => {
                    db.query(sql, (err, result) => {
                        if (err) throw err;
                        return resolve(result);
                    })
                })
                return resolve(result[0]);
            })
        })
        db.end();
        let user = { userID: output.idu, name: output.name };
        return user;
    }

    async setReview(isbn13, text, category) {
        if (!this.context.currentUser.userID) {
            throw new Error('only an authorized user can write a review')
        }
        let userID = this.context.currentUser.userID;
        let categ = ["TECHNICAL", "PRACTICAL", "ORGANIZATIONAL"];
        let cat = (!category) ? "TECHNICAL" : ((category == "ORGANIZATIONAL") ? "ORGANIZATIONAL" : "PRACTICAL");
        let db = await this.conn();
        const output = await new Promise(resolve => {
            db.connect(async (err) => {
                if (err) throw err;
                let sql = "INSERT INTO review (isbn13, idu, reviewtext, category, created) VALUES (?,?,?,?,NOW())";
                let result = await new Promise(resolve => {
                    db.query(sql, [isbn13, userID, text, cat], (err, result) => {
                        if (err) throw err;
                        return resolve(result);
                    })
                })
                return resolve(result);
            })
        })
        db.end();
        let reviewID = output.insertId;
        let success = !!reviewID ? true : false;
        let message = success ? "Your review was added suceessfully" : "Failed! Something is wrong with your submission. Try again!";
        return { success, message, reviewID };
    }

    async getReview(reviewID) {
        let db = await this.conn();
        const revs = await new Promise(resolve => {
            db.connect(async (err) => {
                if (err) throw err;
                let sql = "SELECT * FROM review WHERE idr=" + mysql.escape(reviewID);
                let result = await new Promise(resolve => {
                    db.query(sql, (err, result) => {
                        if (err) throw err;
                        return resolve(result);
                    })
                })
                return resolve(result);
            })
        })
        db.end();
        let review = this.reviewsReducer(revs)
        return review[0];
    }

    async setLike(reviewID, like) {
        if (!this.context.currentUser.userID) {
            throw new Error('only an authorized user can like reviews')
        }
        let userID = this.context.currentUser.userID;
        let liked = (like === 'LIKE') ? 'y' : 'n';
        let db = await this.conn();
        const output = await new Promise(resolve => {
            db.connect(async (err) => {
                if (err) throw err;
                let sql = "INSERT INTO likedbyuser (idr, idu, liked) SELECT ?,?,? WHERE NOT EXISTS (SELECT * FROM review WHERE review.idr=? AND review.idu=?) ON DUPLICATE KEY UPDATE liked=?";
                let result = await new Promise(resolve => {
                    db.query(sql, [reviewID, userID, liked, reviewID, userID, liked], (err, result) => {
                        if (err) throw err;
                        return resolve(result);
                    })
                })
                return resolve(result);
            })
        })
        db.end();
        let affectedrows = output.affectedRows;
        let success = !affectedrows ? false : true;
        let message = !affectedrows ? "No change with likes!" : (affectedrows == 1 ? "Your like was added successfully." : "Your last like was updated");
        return { success, message };
    };


    async setUser(userInfo) {
        let db = await this.conn();
        const output = await new Promise(resolve => {
            db.connect(async (err) => {
                if (err) throw err;
                let sql = "INSERT INTO user (idu, name, token) VALUES (?,?,?) ON DUPLICATE KEY UPDATE name=?, token=?" ;
                let result = await new Promise(resolve => {
                    db.query(sql, [userInfo.userID, userInfo.name, userInfo.token, userInfo.name, userInfo.token], (err, result) => {
                        if (err) throw err;
                        return resolve(result);
                    })
                })
                return resolve(result);
            })
        })
        db.end();
        return output.affectedRows;
    };

};

module.exports = DatabaseAPI;