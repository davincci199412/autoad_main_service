const Comment = require('../models/comment');
const Post = require('../models/post');

exports.getUserComments = async function (req, res) {
    const userId = req.params.userId;

    try {
        const result = await Comment.find({ user: userId })
            .sort({ createdAt: -1 })
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
        console.log(error)
        res.status(200).json({
            success: false,
            msg: 'bad request',
        });
    }
};
