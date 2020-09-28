const _ = require('lodash');
const User = require('../models/user');
const Config = require('../models/config');
const Instagram = require('instagram-web-api');

exports.getFollowings = async function(req, res) {

  try {
    const user = await User.findById(req.params.id)
    .populate('add_users', { _id: true, username: true, userId: true })
    .exec();
    
    let addUsers = [];
    addUsers = user.add_users.map(each => each.userId);

    const client = new Instagram({ username: user.username , password: user.password });
    await client.login();
    const followings = await client.getFollowings({ userId: user.userId, first: 40 });

    // const followings = {
    //   count: 4,
    //   page_info: {
    //       "has_next_page": false,
    //       "end_cursor": null
    //   },
    //   data: [
    //     {
    //       "id": "38352913824",
    //       "username": "autoadtest2",
    //       "full_name": "",
    //       "profile_pic_url": "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_ohc=akoyQVDD660AX9upkDp&oh=95ab7e24ac2d79e3bf99c2bf7a818c41&oe=5F5ADD8F&ig_cache_key=YW5vbnltb3VzX3Byb2ZpbGVfcGlj.2",
    //       "is_verified": false,
    //       "followed_by_viewer": true,
    //       "requested_by_viewer": false
    //     },
    //     {
    //       "id": "1692820292",
    //       "username": "f1",
    //       "full_name": "FORMULA 1®",
    //       "profile_pic_url": "https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-19/s150x150/79376433_1449292608571231_2422030563289333760_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_ohc=eSANsmylQNoAX8flO6v&oh=d297ac35f1b4f28e80e15586c6f96e8c&oe=5F5B98E3",
    //       "is_verified": true,
    //       "followed_by_viewer": true,
    //       "requested_by_viewer": false
    //     },
    //     {
    //       "id": "7275042606",
    //       "username": "mrshinchhome",
    //       "full_name": "Sophie Hinchliffe",
    //       "profile_pic_url": "https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-19/s150x150/69941396_510944076338270_1562731749094457344_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_ohc=qm2dAtc8ySkAX-QImS1&oh=952e53d87b1cff9fb1c1e8bdaaa80b0a&oe=5F5BB867",
    //       "is_verified": true,
    //       "followed_by_viewer": true,
    //       "requested_by_viewer": false
    //     },
    //     {
    //       "id": "197503026",
    //       "username": "lewishamilton",
    //       "full_name": "Lewis Hamilton",
    //       "profile_pic_url": "https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-19/s150x150/103394286_345830786385631_4577704061380477078_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_ohc=6ehRmboCbXMAX9tt1Dq&oh=43b04e69323e562b33d4d719a152e5bb&oe=5F595CF2",
    //       "is_verified": true,
    //       "followed_by_viewer": true,
    //       "requested_by_viewer": false
    //     }
    //   ]
    // }

    res.status(200).json({
      success: true,
      data: {
        current: addUsers,
        total: followings.data
      },
    });

  } catch (error) {
    console.log(error)
    res.status(200).send({
      success: false,
      msg: 'get followings failed',
    });
  }
};

exports.getConfig = async function(req, res) {

  try {
    const config = await Config.find().exec();

    res.status(200).json({
      success: true,
      data: config[0],
    });

  } catch (error) {
    console.log(error)
    res.status(200).send({
      success: false,
      msg: 'get config failed',
    });
  }
};

exports.updateConfig = async function(req, res) {
  const id = req.params.id;
  const data = req.body.data;
  try {
    await Config.updateOne({ _id: id }, data).exec();
    const config = await Config.find().exec();
    res.status(200).json({
      success: true,
      data: config[0],
    });

  } catch (error) {
    console.log(error)
    res.status(200).send({
      success: false,
      msg: 'update config failed',
    });
  }
};

