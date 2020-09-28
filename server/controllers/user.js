const User = require('../models/user');

exports.getAllUsers = async function (req, res) {

    try {
        const result = await User.find({ role: 2 }).exec();

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
        res.status(200).json({
            success: false,
            msg: 'bad request',
        });
    }
};

exports.getUser = async function (req, res) {
    try {
        const result = await User.findById(req.params.id).exec();

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
        res.status(200).json({
            success: false,
            msg: 'bad request',
        });
    }
};
