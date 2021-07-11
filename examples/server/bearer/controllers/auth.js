// @ts-check

const path = require("path");
const jwt = require("jsonwebtoken");
const ms = require("ms");
const { Response, Request, NextFunction } = require("express");

const { AuthorizationError, DotEnvError } = require("@bariyer/server");
const { JsonDB } = require("../db");

const db = new JsonDB(path.resolve(__dirname, "../db/users.json"));

/**
 * Login Controller
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
function login(req, res, next) {
  /**
   * if username and password doesnt exist on request body
   * return Authorization Error with status code 400(Bad Request)
   */
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .json(AuthorizationError.response("username or password required"));
  }

  /**
   * @see {@link db.find} find user by username and password
   */
  const user = db.find(req.body.username, req.body.password);

  /**
   * If username and password exist on request body,
   * Check user authorization on json file.
   */
  if (!user) {
    res
      .status(401)
      .json(AuthorizationError.response("username or password incorrect"));
  } else {
    if (!process.env.JWT_SECRET_KEY) {
      throw new DotEnvError("JWT_SECRET_KEY");
    }

    const token = jwt.sign(user, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE || "1d",
    });

    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: false,
        expires: new Date(
          Date.now() + ms(process.env.JWT_COOKIE_EXPIRE || "2d")
        ),
        secure: process.env.NODE_ENV === "development" ? false : true,
      })
      .json({ access_token: token });
  }
}

/**
 * Register Controller
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
function register(req, res, next) {
  /**
   * if username and password doesnt exist on request body
   * return Authorization Error with status code 400(Bad Request)
   */
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .json(AuthorizationError.response("username and password required"));
  }

  /**
   * Else add user into json file
   * @see {@link db.add} add user into JSON file
   */
  const _user = db.add(req.body.username, req.body.password);

  if (!_user) {
    return res
      .status(401)
      .json(AuthorizationError.response("user already registered, go to login"))
      .redirect("/login");
  }
  return res.status(200).json(_user);
}

module.exports = {
  login,
  register,
};
