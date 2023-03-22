const userModel = require("../users/users-model")

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
const restricted = (req,res,next) => {
  if(req.session && req.session.user) { 
    next()
  }else{
    next({message: "You shall not pass!",status:401})
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
const checkUsernameFree = (req,res,next) => {
  const {username} = req.body
  userModel.findBy({username}).then(promise => {
    if(promise.length){
      next({message:"Username taken",status:422})
    }else{
      next()
    }
  })
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
const checkUsernameExists = async (req,res,next) => {
  const {username} = req.body
  userModel.findBy({username}).then(promise => {
    if(promise.length){
      next()
    }else{
      next({message: "Invalid credentials", status: 401})
    }
  })
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
const checkPasswordLength = (req,res,next) => {
  if(!req.body.password || req.body.password.length <= 3 ){
    next({message: "Password must be longer than 3 chars", status:422})
  }else{
    next()
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
  restricted
}
