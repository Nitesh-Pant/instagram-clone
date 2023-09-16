const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3001;
const bodyParser = require('body-parser');
const cors = require("cors")

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

con.query("select * from users",(err,result)=>{
    if(err)
    {
      console.warn("some error", err)
    }
    else{
      console.warn(result)
    }
  })

// Get home screen posts
app.get('/posts/:id', async (req, res) => {
  const id = req.params.id
  const sql = "Select toId from follow where userId = " + id + " and follow = 1";
  con.query(sql, (err, results) => {
    if(err){
      console.log(err)
      res.status(500).send(err)
    }
    else{
      let toIdArray = []
      if(results.length > 0){
        for(var i=0; i<results.length; i++){
          toIdArray.push(results[i].toId)
        }
        console.log(toIdArray)
      }
      else{
        toIdArray.push(-1)
      }
      

      con.query("Select p.*, u.username as username, u.avatarLink as avatar from posts as p inner join users as u on p.userId = u.id where u.id in (" + toIdArray + ") order by created_at desc", (err, result)=> {
        if(err){
          console.log(err)
          res.status(500).send(err)
        }
        else{
          res.status(200).send(result)
        }
      })
    }
  })
});

// User Profile
app.get('/profile/:id', async (req, res) => {
  const userId = req.params.id;
  con.query("Select * from posts where userId = " + userId, (err, result)=> {
      if(err){
        console.log(err)
        res.status(500).send(err)
      }
      else{
        res.status(200).send(result)
      }
  })
});

// User me
app.get('/profile/me/:id/:currentUserId', async (req, res) => {
  const id = req.params.id;
  const currentUserId = req.params.currentUserId;

  con.query("Select * from users where id = " + id, (err, result)=> {
      if(err){
        console.log(err)
        res.status(500).send(err)
      }
      else{
        let finalData = result[0]
        const sql = "Select count(*) as postCount from posts where userId = " + id + " group by userId"
        con.query(sql, (err, resu)=> {
          if(err){
            console.log(err)
            res.status(500).send(err)
          }
          else{
            if(resu.length > 0){
              finalData.postCount = resu[0].postCount
            }
            else{
              finalData.postCount = 0
            }
            const sql = "Select follow from follow where userId = " + currentUserId + " and toId = " + id;
            con.query(sql, (err, r)=>{
              if(err){
                console.log(err)
                res.status(500).send(err)
              }
              else{
                console.log(r)
                if(r.length > 0){
                  finalData.follow = r[0].follow
                }
                else{
                  finalData.follow = 0
                }
                console.log(finalData)
                res.status(200).send(finalData)
              }
            }) 
          }
      })
      }
  })
});

// User Search
app.get('/search/', async (req, res) => {
  let name = req.query.name;
  con.query("Select * from users where username like " + "'%" + name + "%'", (err, result)=> {
      if(err){
        console.log(err)
        res.status(500).send(err)
      }
      else{
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
      if(result.length > 0){
        let followStatus = result[0].follow
  console.log('wprlsand222222222222222')

        const sql = "Update follow set follow = " + !followStatus + " where userId = " + currentUserId + " and toId = " + id;
  console.log('wprlsan33333333333d')

        con.query(sql, (err, result) => {
          if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error inserting data'); 
          }
          else{
            console.log('successfully')
            res.status(200).send({msg: 'status changed'})
          }
        })
      }
      else{
        const sql = "Insert into follow (userId, toId) values (" + currentUserId + "," + id + ")"
        con.query(sql, (err, result) => {
          if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error inserting data'); 
          }
          else{
            console.log('successfully')
            res.status(200).send({msg: 'status changed'})
          }
        })
      }
    }
  });
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
        res.send({msg: 'Successful'});
      }
    });
});


// Get all users
app.get('/users', async (req, res) => {
    con.query("Select * from users", (err, result)=> {
        if(err){
            res.send('error', err)
        }
        else{
            res.send(result)
        }
    })
});


// Signup api
app.post('/signup', async (req, res) => {
    const userData = req.body; 
  
    con.query('INSERT INTO users SET ?', userData, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Error inserting data'); // Respond with an error status
      } else {
        console.log('Data inserted:', result);
        res.send('User signed up successfully'); // Respond with a success message
      }
    });
  });


// login api
app.post('/login', async (req, res) => {
    const data = req.body;

    con.query("Select * from users where username = '" + data.username + "'", (err, result, fields)=> {
        if(err){
            console.error('Error inserting data::', err);
            res.status(500).send('Error inserting data');
        }
        else{
            if(result.length == 0){
                console.error('No User Found', err);
                res.status(500).send({msg: 'No User Found'});
            }
            else{
                con.query("Select * from users where username = '" + data.username + "' and password = '" + data.password + "'", (err, result, fields)=> {
                    if(err){
                        console.error('Error inserting data:', err);
                        res.status(500).send('Error inserting data');
                    }
                    else{
                        if(result.length == 0){
                            console.error('Invalid Password', err);
                            res.status(500).send({msg: 'Invalid Passowrd'});
                        }
                        else{
                            console.log('Data inserted:', result);
                            res.status(200).send({msg: 'User Loggedin successfully', 'result': result});
                        }         
                    }
                })
            }
        }
    })    
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
