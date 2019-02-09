const express = require('express');
const router  = express.Router();

const Room = require('../models/room-model');
const User = require('../models/user-model');

const fileUploader = require('../config/upload-setup/cloudinary');

router.get('/rooms/add', isLoggedIn, (req, res, next) => {
  res.render('room-pages/addRoom');
});
// above, once it makes it to if isLoggedIn, then it runs the below function, and then jumps back to render the site addressed


                    // <input type="file" name="imageURL" id="">

router.post('/create-room', fileUploader.single('imageURL'), (req, res, next) => {
  // console.log('body: ', req.body);
  // console.log('- - - - -');
  // console.log('file: ', req.file);
  const { name, description } = req.body;
  Room.create({
    name,
    description,
    imageURL: req.file.secure_url,
    owner: req.user._id
  })
  .then( newRoom => {
    console.log('room created: ', newRoom);
    // res.redirect('/rooms');
  })
  .catch( err => next(err) )
})

router.get('/rooms', isLoggedIn, (req, res, next) => {
  Room.find()
  .then(roomsFromDB => {
    roomsFromDB.forEach(oneRoom => {
      if(oneRoom.owner.equals(req.user._id)){
        oneRoom.isOwner = true;
      }
    })
    res.render('room-pages/room-list', { roomsFromDB })
  })
})


function isLoggedIn(req, res, next){
  if(req.user){
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = router;