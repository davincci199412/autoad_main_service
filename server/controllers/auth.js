const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const PopularUser = require('../models/popularuser');
const config = require('../config/keys');
const isEmpty = require('../validations/is-empty');
const Instagram = require('instagram-web-api');
const setUserInfo = require('../helpers/utility').setUserInfo;

function generateToken(user) {
  return jwt.sign(user, config.secretOrKey, {
    expiresIn: 604800, // in seconds
  });
}

exports.signIn = async function(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).exec();
    if (!isEmpty(user)) {
      if (user.password === password) {
        res.status(200).json({
          success: true,
          data: user
        });
      } else {
        res.status(200).json({
          success: false,
          msg: 'Your login details are incorrect. Please try again.',
        });
      }
    } else {
      const client = new Instagram({ username , password });
      const login = await client.login();
      const profile = await client.getProfile();
      const { userId } = login;
      const { first_name, last_name, email, phone_number, birthday } = profile;
      const newUser = new User({
        username,
        password,
        email,
        userId,
        role: 2,
        first_name,
        last_name,
        birthday,
        phone_number
      });

      const result = await newUser.save();
      res.status(200).json({
        success: true,
        data: result
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      msg: 'bad request',
    });
  }
};

exports.signInFromWeb = async function(req, res) {
  const userInfo = setUserInfo(req.user);

  res.status(200).json({
    success: true,
    token: `JWT ${generateToken(userInfo)}`,
    user: userInfo,
  });
};

exports.viewProfile = async function(req, res) {
  try {
    const id = req.params.id;
    const result = await User
      .findById(id)
      .populate('add_users', { _id: true, username: true, userId: true })
      .exec();

    if (result) {
      res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      res.status(200).json({
        success: false,
        msg: 'no result',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      msg: 'bad request',
    });
  }
};

exports.viewProfileFromWeb = async function(req, res) {
  try {
    const user = req.user;
    const result = await User
      .findById(user._id).exec();

    if (result) {
      res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      res.status(200).json({
        success: false,
        msg: 'no result',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      msg: 'bad request',
    });
  }
};

exports.updateProfile = async function(req, res) {
  const { username, del_comment, new_comment, comment_index, selectedUsers, profile_limit, deletedUsers } = req.body;
  let set = {};

  const user = await User.findOne({ username }).exec();
  const addUsers = user.add_users;
  
  if (!isEmpty(profile_limit)) {
    set = Object.assign({}, set, { profile_limit });
  }
  
  const oldComments = user.auto_comment_text;
  if (!isEmpty(del_comment)) {
    oldComments.splice(del_comment, 1)
  }
  
  if (!isEmpty(new_comment)) {
    if (isEmpty(comment_index)) {
      oldComments.push(new_comment)
    } else {
      oldComments.splice(comment_index, 1, new_comment);
    }
  }

  set = Object.assign({}, set, { auto_comment_text: oldComments });

  if (!isEmpty(selectedUsers)) {
    for (let i=0; i<selectedUsers.length; i++) {
      const result = await PopularUser.findOne({ username: selectedUsers[i].username }).exec();
      if (result) {
        if (result.added_users.indexOf(user._id) === -1) {
          const added_users = result.added_users;
          added_users.push(user._id)
          await PopularUser.updateOne(
            { username: result.username },
            { added_users },
            { upsert: true, new: true })
            .exec();
            addUsers.push(result._id);
        }
      } else {
        const newPopularUser = new PopularUser({
          username: selectedUsers[i].username,
          userId: selectedUsers[i].id,
          full_name: selectedUsers[i].full_name,
          added_users: [user._id],
        });

        const result2 = await newPopularUser.save();
        addUsers.push(result2._id);
      }
    }
  }

  if (!isEmpty(deletedUsers)) {
    
    for (let i=0; i<deletedUsers.length; i++) {
      const result = await PopularUser.findOne({ username: deletedUsers[i].username }).exec();
      if (result) {
        if (result.added_users.indexOf(user._id) > -1) {
          const added_users = result.added_users;
          added_users.splice(added_users.indexOf(user._id), 1);
          await PopularUser.updateOne(
            { username: result.username },
            { added_users },
            { upsert: true, new: true })
            .exec();
        }
        if (addUsers.indexOf(result._id) > -1) {
          addUsers.splice(addUsers.indexOf(result._id), 1);
        }
      }
    }
  }
  
  
  set = Object.assign({}, set, { add_users: addUsers });

  try {
    const result = await User.updateOne({ username }, set).exec();

    if (result) {
      res.status(200).json({
        success: true,
        msg: 'user updated successfully',
      });
    } else {
      res.status(200).json({
        success: false,
        msg: 'user update failed',
      });
    }
  } catch (error) {
    res.status(200).send({
      success: false,
      msg: 'user update failed',
    });
  }
};
