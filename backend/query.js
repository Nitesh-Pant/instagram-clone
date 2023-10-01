const { con } = require('./connection');
const Jwt = require("jsonwebtoken")

const jwtKey = 'instagram'

function getUsers(req, res) {
    con.query("'SELECT * FROM users", (err, result) => {
        if (err) {
            error(res, err);
        } else {
            res.status(200).json(result);
        }
    });
}

function searchUsers(req, res) {
    let name = req.query.name;

    con.query("SELECT * FROM users WHERE username LIKE '%" + name + "%'", (err, result) => {
        if (err) {
            error(res, err);
        } else {
            res.status(200).json(result);
        }
    });
}

function userProfilePost(req, res) {
    const userId = req.params.id;
    con.query("Select * from posts where userId = " + userId, (err, result) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(200).send(result)
        }
    })
}

function userProfileMe(req, res) {
    const id = req.params.id;
    const currentUserId = req.params.currentUserId;

    con.query("Select * from users where id = " + id, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send(err)
        }
        else {

            // total post posted by user
            let finalData = result[0]
            const sql = "Select count(*) as postCount from posts where userId = " + id + " group by userId"
            con.query(sql, (err, resu) => {
                if (err) {
                    console.log(err)
                    res.status(500).send(err)
                }
                else {
                    if (resu.length > 0) {
                        finalData.postCount = resu[0].postCount
                    }
                    else {
                        finalData.postCount = 0
                    }

                    // total followers
                    const sql = "Select count(*) as followers from follow where toId = " + id + " and follow = 1";
                    con.query(sql, (err, r) => {
                        if (err) {
                            console.log(err)
                            res.status(500).send(err)
                        }
                        else {
                            if (r.length > 0) {
                                finalData.followers = r[0].followers
                            }
                            else {
                                finalData.followers = 0
                            }
                            console.log(finalData)
                            // res.status(200).send(finalData)

                            // total following
                            const sqlCommand = "Select count(*) as following from follow where userId = " + id + " and follow = 1";
                            con.query(sqlCommand, (err, r) => {
                                if (err) {
                                    console.log(err)
                                    res.status(500).send(err)
                                }
                                else {
                                    if (r.length > 0) {
                                        finalData.following = r[0].following
                                    }
                                    else {
                                        finalData.following = 0
                                    }
                                    console.log(finalData)
                                    res.status(200).send(finalData)
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

function getFollowersFollowing(req, res) {
    const id = req.params.id;

    const type = req.query.type;

    if (type == 'followers') {
        // get followers
        const sql = "Select f.userId as id, u.username, u.avatarLink from follow f join Users u on f.userId = u.id where toId = " + id + " and follow = 1";
        con.query(sql, (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                res.status(500).send('Error inserting data');
            } else {
                res.status(200).send(result)
            }
        });
    }
    else {
        // get following
        const sql = "Select f.toId as id, u.username, u.avatarLink from follow f join Users u on f.toId = u.id where userId = " + id + " and follow = 1";
        con.query(sql, (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                res.status(500).send('Error inserting data');
            } else {
                res.status(200).send(result)
            }
        });
    }
}

async function getComments(req, res) {
    const postId = req.params.postId;

    // get comments by post id
    const sql = "Select i.*, u.username, u.avatarLink from interactions as i join users as u on i.userId = u.id where i.comment is not null and i.postId = " + postId;
    try {
        const results = await new Promise((resolve, reject) => {
            con.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        res.status(200).send(results)
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

function signUpStep1(req, res) {
    const userData = req.body;

    con.query('Select * from Users where username = ?', [userData.username], (err, result) => {
        if (err) {
            res.status(500).send(err); // Respond with an error status
        } else {
            if (result.length > 0) {
                res.send({ msg: 'Username already taken' }); // Respond with a success message
            } else {
                res.send({ msg: 'Successful' }); // Respond with a success message
            }
        }
    });
}

function signUpStep2(req, res) {
    const userData = req.body;

    con.query('INSERT INTO users SET ?', userData, (err, result) => {
        if (err) {
            res.status(500).send(err); // Respond with an error status
        } else {
            Jwt.sign({ result }, jwtKey, { expiresIn: '48h' }, (err, token) => {
                res.send({ msg: 'User signed up successfully' }, result, token); // Respond with a success message
            })
        }
    });
}

async function postComment(req, res) {
    const sql = "Insert into interactions set ?";
    const commentData = req.body;
    try {
        const results = await new Promise((resolve, reject) => {
            con.query(sql, commentData, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        res.status(200).send(results)
    }
    catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}

function login(req, res) {
    const data = req.body;

    con.query("Select * from users where username = '" + data.username + "'", (err, result, fields) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            if (result.length == 0) {
                console.error('No User Found', err);
                res.status(500).send({ msg: 'No User Found' });
            }
            else {
                con.query("Select * from users where username = '" + data.username + "' and password = '" + data.password + "'", (err, result, fields) => {
                    if (err) {
                        res.status(500).send(err);
                    }
                    else {
                        if (result.length == 0) {
                            console.error('Invalid Password', err);
                            res.status(500).send({ msg: 'Invalid Passowrd' });
                        }
                        else {
                            console.log('Data inserted:', result);
                            Jwt.sign({ result }, jwtKey, { expiresIn: '48h' }, (err, token) => {
                                res.status(200).send({ msg: 'User Loggedin successfully', 'result': result, token });
                            })
                        }
                    }
                })
            }
        }
    })
}

function likeUnlike(req, res) {
    const postId = req.params.postId;
    const currentUserId = req.params.currentUserId;

    const sql = "Select * from interactions where postId = " + postId + " and userId = " + currentUserId;
    con.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.length > 0) {
                let likeStatus = result[0].liked

                const sql = "Update interactions set liked = " + !likeStatus + " where userId = " + currentUserId + " and postId = " + postId;

                con.query(sql, (err, result) => {
                    if (err) {
                        res.status(500).send(err);
                    }
                    else {
                        console.log('successfully updae')
                        res.status(200).send({ msg: 'status updated' })
                    }
                })
            }
            else {
                const sql = "Insert into interactions (userId, postId, liked) values (" + currentUserId + "," + postId + "," + "1)"
                con.query(sql, (err, result) => {
                    if (err) {
                        res.status(500).send(err);
                    }
                    else {
                        console.log('successfully inserted')
                        res.status(200).send({ msg: 'status inserted' })
                    }
                })
            }
        }
    });
}

module.exports = {
    getUsers, searchUsers, userProfilePost, userProfileMe, getFollowersFollowing, getComments, signUpStep1, signUpStep2, postComment, login, likeUnlike
}