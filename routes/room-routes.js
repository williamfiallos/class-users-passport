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

router.get('/rooms', (req, res, next) => {
  Room.find().populate('owner') // .populate allows us to find a user other than by ._id, in this case 'owner'
  .then(roomsFromDB => {
    roomsFromDB.forEach(oneRoom => {
      // each room has the 'owner' property which is user's id
      // if owner (the id of the user who created a room) is the same as the currently logged in user
      // then create additional property in the oneRoom object (maybe isOwner is not the best one but ... 🤯)
      // and that will help you to allow that currently logged in user can edit and delete only the rooms they created
      
      // if there's a user in a session:
      if(req.user){
        if(oneRoom.owner.equals(req.user._id)){
          oneRoom.isOwner = true;
        }
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
