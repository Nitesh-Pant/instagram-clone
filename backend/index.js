const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors")
const { getUsers, searchUsers, userProfilePost, userProfileMe, getFollowersFollowing, getComments, signUpStep1, signUpStep2, postComment, login, likeUnlike } = require('./query');
const { con } = require('./connection');
const { tokenVerification } = require('./middleware')

const app = express();
const port = 3001;

app.use(cors())

// Configure bodyParser middleware to parse JSON
app.use(bodyParser.json());

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
      con.query("Select p.id as postId, p.userId as userId, p.postLink as postLink, p.type as type, p.caption as caption, p.created_at as created_at, u.username as username, u.avatarLink as avatar from posts as p inner join users as u on p.userId = u.id where u.id in (" + toIdArray + ") order by p.created_at desc", (err, result) => {
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

// User Profile Post
app.get('/profile/:id', async (req, res) => {
  userProfilePost(req, res)
});

// User me
app.get('/profile/me/:id/:currentUserId', tokenVerification, async (req, res) => {
  userProfileMe(req, res)
});

// User Search
app.get('/search/', tokenVerification, async (req, res) => {
  searchUsers(req, res);
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
  getFollowersFollowing(req, res)
});

// Like and UnLike API
app.put('/like/:postId/:currentUserId', async (req, res) => {
  likeUnlike(req, res)
});

// Get comments and user details by postId API
app.get('/comments/:postId', async (req, res) => {
  getComments(req, res)
});

// post comments
app.post('/commentss', async (req, res) => {
  postComment(req, res)
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
  getUsers(req, res)
});

// Signup api step 1
app.post('/signup/step1', async (req, res) => {
  signUpStep1(req, res)
});

// Signup api step 2
app.post('/signup/step2', async (req, res) => {
  signUpStep2(req, res)
});

// login api
app.post('/login', async (req, res) => {
  login(req, res)
});


// multer api

const multer = require('multer');
const fs = require('fs');

// Create the folder for uploads if it doesn't exist
const uploadImageFolder = 'uploads/images';
if (!fs.existsSync(uploadImageFolder)) {
  fs.mkdirSync(uploadImageFolder);
}

// Configure Multer for file uploads
const storageImage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadImageFolder);
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + '_' + file.originalname);
  },
});

// Define a custom file filter function to check file type/format
const fileFilter = (req, file, callback) => {
  // Check if the file type is an image (you can add more supported formats)
  if (file.mimetype.startsWith('image/')) {
    callback(null, true); // Accept the file
  } else {
    callback(new Error('Only image files are allowed.'), false); // Reject the file
  }
};

const upload = multer({ storage: storageImage, fileFilter });

// Serve uploaded images statically (optional)
app.use('/uploads/images', express.static('uploads/images'));

// Body parsing middleware to handle form data
app.use(express.urlencoded({ extended: true }));

// Image Upload
app.post('/upload/image', upload.single('image'), (req, res) => {
  const { userId, caption, type } = req.body;
  console.log('Received form fields:', req.body);
  console.log('Received files:', req.files);
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // Save image URL and other data to MySQL database
  const imageUrl = req.file.path;
  // Implement your MySQL logic here to store imageUrl

  const imageInsertQuery = 'INSERT INTO posts (userId, postLink, caption, type) VALUES (?, ?, ?, ?)';
  con.query(imageInsertQuery, [userId, imageUrl, caption, type], (err, result) => {
    if (err) {
      console.error('Database error: ' + err.message);
      return res.status(500).json({ message: 'Error saving data to the database.' });
    }
    // Respond with a success message and the inserted user data
    res.status(200).json({ message: 'User data and image uploaded successfully.', user: { userId, imageUrl, caption } });
  });
});


// Create the folder for uploads if it doesn't exist
const uploadVideoFolder = 'uploads/videos';
if (!fs.existsSync(uploadVideoFolder)) {
  fs.mkdirSync(uploadVideoFolder);
}

// Configure Multer for file uploads
const storageVideo = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadVideoFolder);
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + '_' + file.originalname);
  },
});

// Define a custom file filter function to check file type/format
const fileFilterVideo = (req, file, callback) => {
  // Check if the file type is an image (you can add more supported formats)
  if (file.mimetype.startsWith('video/')) {
    callback(null, true); // Accept the file
  } else {
    callback(new Error('Only video files are allowed.'), false); // Reject the file
  }
};

const uploadVideo = multer({ storage: storageVideo, fileFilterVideo });

// Serve uploaded images statically (optional)
app.use('/uploads/videos', express.static('uploads/videos'));

// Body parsing middleware to handle form data
app.use(express.urlencoded({ extended: true }));

// Video Upload
app.post('/upload/video', uploadVideo.single('video'), (req, res) => {
  const { userId, caption, type } = req.body;
  console.log('Received form fields:', req.body);
  console.log('Received files:', req.file); 
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // Save video URL and other data to MySQL database
  const videoUrl = req.file.path;
  console.log('video files:', videoUrl); 

  // Implement your MySQL logic here to store imageUrl

  const videoInsertQuery = 'INSERT INTO posts (userId, postLink, caption, type) VALUES (?, ?, ?, ?)';
  con.query(videoInsertQuery, [userId, videoUrl, caption, type], (err, result) => {
    if (err) {
      console.error('Database error: ' + err.message);
      return res.status(500).json({ message: 'Error saving data to the database.' });
    }
    // Respond with a success message and the inserted user data
    res.status(200).json({ message: 'User data and image uploaded successfully.', user: { userId, videoUrl, caption, type } });
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
