const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors")
const mysql = require('mysql');
const Jwt = require("jsonwebtoken")

const jwtKey = 'instagram'

const app = express();
const port = 3001;

app.use(cors())

// Configure bodyParser middleware to parse JSON
app.use(bodyParser.json());

// MySQL database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '#Inspiron17',
  database: 'instagram',
};

// Create a connection pool
const con = mysql.createConnection(dbConfig);

con.query("select * from users", (err, result) => {
  if (err) {
    console.warn("some error", err)
  }
  else {
    console.warn(result)
  }
})

// home posts api
app.get('/posts/:id', async (req, res) => {
  const id = req.params.id;

  // get following people id
  const sql = "Select toId from follow where userId = " + id + " and follow = 1";

  try {
    const results = await new Promise((resolve, reject) => {
      con.query(sql, (err, results) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    let toIdArray = [];
    if (results.length > 0) {
      for (var i = 0; i < results.length; i++) {
        toIdArray.push(results[i].toId);
      }
      console.log(toIdArray);
    } else {
      toIdArray.push(-1);
    }

    // Get uploaded posts along with user details
    const result = await new Promise((resolve, reject) => {
      con.query("Select p.id as postId, p.userId as userId, p.imageLink as imageLink, p.caption as caption, p.created_at as created_at, u.username as username, u.avatarLink as avatar from posts as p inner join users as u on p.userId = u.id where u.id in (" + toIdArray + ") order by p.created_at desc", (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    }); console.log('-------------------------------------------------->uploaded posts with user details', result)

    // Get like count for each post
    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        const resu = await new Promise((resolve, reject) => {
          con.query("SELECT COUNT(*) AS likeCount FROM interactions WHERE liked = 1 AND postId = ?", [result[i].postId], (err, resu) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve(resu);
            }
          });
        });
        result[i].likeCount = resu[0].likeCount || 0;
      }
    }

    // total comment count
    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        const resu = await new Promise((resolve, reject) => {
          con.query("SELECT COUNT(*) AS commentCount FROM interactions WHERE comment IS NOT NULL AND postId = ?", [result[i].postId], (err, resu) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve(resu);
            }
          });
        });
        result[i].commentCount = resu[0].commentCount || 0;
      }
    }

    // loggedin user has liked or not
    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        const resu = await new Promise((resolve, reject) => {
          con.query("SELECT * FROM interactions WHERE liked = 1 AND postId = ? AND userId = ?", [result[i].postId, id], (err, resu) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve(resu);
            }
          });
        });
        result[i].isLiked = resu.length > 0 ? 1 : 0;
      }
    }

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Get search screen posts
app.get('/search/posts/:id', async (req, res) => {
  const id = req.params.id
  const sql = "Select toId from follow where userId = " + id + " and follow = 1";
  con.query(sql, (err, results) => {
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    else {
      let toIdArray = []
      if (results.length > 0) {
        for (var i = 0; i < results.length; i++) {
          toIdArray.push(results[i].toId)
        }
        toIdArray.push(id)
        console.log(toIdArray)
      }
      else {
        toIdArray.push(-1)
      }


      con.query("Select p.*, u.username as username, u.avatarLink as avatar from posts as p inner join users as u on p.userId = u.id where u.id not in (" + toIdArray + ")", (err, result) => {
        if (err) {
          console.log(err)
          res.status(500).send(err)
        }
        else {
          res.status(200).send(result)
        }
      })
    }
  })
});

// User Profile
app.get('/profile/:id', async (req, res) => {
  const userId = req.params.id;
  con.query("Select * from posts where userId = " + userId, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    else {
      res.status(200).send(result)
    }
  })
});

// User me
app.get('/profile/me/:id/:currentUserId', tokenVerification, async (req, res) => {
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
});

// User Search
app.get('/search/', tokenVerification, async (req, res) => {
  let name = req.query.name;
  con.query("Select * from users where username like " + "'%" + name + "%'", (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    else {
      res.status(200).send(result)
    }
  })
});

// Follow and Unfollow API
app.put('/follow/:id/:currentUserId', async (req, res) => {
  const id = req.params.id;
  const currentUserId = req.params.currentUserId;

  const sql = "Select * from follow where userId = " + currentUserId + " and toId = " + id;
  con.query(sql, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
    } else {
      if (result.length > 0) {
        let followStatus = result[0].follow
        console.log('wprlsand222222222222222')

        const sql = "Update follow set follow = " + !followStatus + " where userId = " + currentUserId + " and toId = " + id;
        console.log('wprlsan33333333333d')

        con.query(sql, (err, result) => {
          if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error inserting data');
          }
          else {
            console.log('successfully')
            res.status(200).send({ msg: 'status changed' })
          }
        })
      }
      else {
        const sql = "Insert into follow (userId, toId) values (" + currentUserId + "," + id + ")"
        con.query(sql, (err, result) => {
          if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error inserting data');
          }
          else {
            console.log('successfully')
            res.status(200).send({ msg: 'status changed' })
          }
        })
      }
    }
  });
});

// Get Followers and Following API
app.get('/follow/:id', async (req, res) => {
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

});

// Like and UnLike API
app.put('/like/:postId/:currentUserId', async (req, res) => {
  const postId = req.params.postId;
  const currentUserId = req.params.currentUserId;

  const sql = "Select * from interactions where postId = " + postId + " and userId = " + currentUserId;
  con.query(sql, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error');
    } else {
      if (result.length > 0) {
        let likeStatus = result[0].liked

        const sql = "Update interactions set liked = " + !likeStatus + " where userId = " + currentUserId + " and postId = " + postId;

        con.query(sql, (err, result) => {
          if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error inserting data');
          }
          else {
            console.log('successfully updae')
            res.status(200).send({ msg: 'status updated' })
          }
        })
      }
      else {
        const sql = "Insert into interactions (userId, postId, liked) values (" + currentUserId + "," + postId + " + 1)"
        con.query(sql, (err, result) => {
          if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error inserting data');
          }
          else {
            console.log('successfully inserted')
            res.status(200).send({ msg: 'status inserted' })
          }
        })
      }
    }
  });
});

// Get comments and user details by postId API
app.get('/comments/:postId', async (req, res) => {
  const postId = req.params.postId;

  // get comments by post id
  const sql = "Select i.*, u.username, u.avatarLink from interactions as i join users as u on i.userId = u.id where i.comment is not null and i.postId = " + postId;
  try {
    const results = await new Promise((resolve, reject) => {
      con.query(sql, (err, results) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    res.status(200).send(results)
  }
  catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// post comments
app.post('/commentss', async (req, res) => {
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
});

// post comments alternate
app.post('/comment', async (req, res) => {
  const sql = "Insert into interactions set ?";
  const commentData = req.body;
  try {
    con.query(sql, commentData, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error inserting data');
      } else {
        console.log('Data inserted:', results);
        res.status(200).send({ msg: 'Successful' });
      }
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Add a new Post
app.post('/addPost', async (req, res) => {
  const postData = req.body;

  con.query('INSERT INTO posts SET ?', postData, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
    } else {
      console.log('Data inserted:', result);
      res.send({ msg: 'Successful' });
    }
  });
});


// Get all users
app.get('/users', async (req, res) => {
  con.query("Select * from users", (err, result) => {
    if (err) {
      res.send('error', err)
    }
    else {
      res.send(result)
    }
  })
});


// Signup api step 1
app.post('/signup/step1', async (req, res) => {
  const userData = req.body;

  con.query('Select * from Users where username = ?', [userData.username], (err, result) => {
    if (err) {
      console.error('Error selecting data:', err);
      res.status(500).send('Error selecting data'); // Respond with an error status
    } else {
      if (result.length > 0) {
        console.log('Data inserted:', result);
        res.send({ msg: 'Username already taken' }); // Respond with a success message
      } else {
        console.log('Data inserted:', result);
        res.send({ msg: 'Successful' }); // Respond with a success message
      }
    }
  });
});


// Signup api step 2
app.post('/signup/step2', async (req, res) => {
  const userData = req.body;

  con.query('INSERT INTO users SET ?', userData, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data'); // Respond with an error status
    } else {
      console.log('Data inserted:', result);
      Jwt.sign({ result }, jwtKey, { expiresIn: '48h' }, (err, token) => {
        res.send({ msg: 'User signed up successfully' }, result, token); // Respond with a success message
      })
    }
  });
});

// login api
app.post('/login', async (req, res) => {
  const data = req.body;

  con.query("Select * from users where username = '" + data.username + "'", (err, result, fields) => {
    if (err) {
      console.error('Error inserting data::', err);
      res.status(500).send('Error inserting data');
    }
    else {
      if (result.length == 0) {
        console.error('No User Found', err);
        res.status(500).send({ msg: 'No User Found' });
      }
      else {
        con.query("Select * from users where username = '" + data.username + "' and password = '" + data.password + "'", (err, result, fields) => {
          if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error inserting data');
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
});

// verify jwt token
function tokenVerification(req, res, next) {
  let token = req.headers['authorization']
  if (token) {
    Jwt.verify(token, jwtKey, (err, valid) => {
      if (err) res.status(401).send("Please provide valid token")
      else next()
    })
  }
  else {
    res.status(403).send("Please provide token")
  }
}

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
