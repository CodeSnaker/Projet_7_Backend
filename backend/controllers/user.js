const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");

require("dotenv").config();

const passwordSchema = new passwordValidator();
passwordSchema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits(2) // Must have at least 2 digits
    .has()
    .not()
    .spaces() // Should not have spaces
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123", "User123"]); // Blacklist these values

exports.signup = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!passwordSchema.validate(password) || !emailValidator.validate(email)) {
        return res.status(401).json({
            message: "Please input a valid email and/or password.",
        });
    }

    bcrypt.hash(password, 10).then((hash) => {
        const user = new User({
            email: email,
            password: hash,
        });
        user.save()
            .then(() =>
                res.status(201).json({
                    message: "User added successfully",
                })
            )
            .catch((error) => res.status(400).json({ error }));
    });
};

exports.login = async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: "Must have email and password",
        });
    }

    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email }).exec();
    if (!user) {
        return res.status(404).json({
            message: "User doesn't exist",
        });
    }

    bcrypt
        .compare(password, user.password)
        .then((result) => {
            if (result) {
                const token = jwt.sign(
                    { userId: user._id },
                    process.env.JWT_ENCRYPT,
                    {
                        expiresIn: "24h",
                    }
                );

                return res.status(200).json({
                    userId: user._id,
                    token: token,
                });
            } else {
                return res.status(401).json({
                    error: "Wrong password",
                });
            }
        })
        .catch((error) => {
            return res.status(401).json({
                error: error,
            });
        });
};
