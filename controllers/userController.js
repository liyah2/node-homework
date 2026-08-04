const crypto = require("crypto");
const util = require("util");
const { userSchema } = require("../validation/userSchema");
const pool = require("../db/pg-pool");
const scrypt = util.promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);

  return `${salt}:${derivedKey.toString("hex")}`;
}

async function comparePassword(inputPassword, storedHash) {
  const [salt, key] = storedHash.split(":");
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = await scrypt(inputPassword, salt, 64);

  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

async function register(req, res, next) {
  if (!req.body) {
    req.body = {};
  }

  const { error, value } = userSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      details: error.details,
    });
  }

  value.hashed_password = await hashPassword(value.password);

  let user = null;

  try {
    user = await pool.query(
      `INSERT INTO users (email, name, hashed_password)
        VALUES ($1, $2, $3)
        RETURNING id, email, name`,
      [value.email, value.name, value.hashed_password]
    );
  } catch (e) {
    if (e.code === "23505") {
      return res.status(400).json({
        message: "Email already registered.",
      });
    }

    return next(e);
  }

  global.user_id = user.rows[0].id;
  return res.status(201).json({
    name: user.rows[0].name,
    email: user.rows[0].email,
  });
}

async function logon(req, res) {
  const { email, password } = req.body;

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (result.rows.length === 0) {
    return res.sendStatus(401);
  }

  const user = result.rows[0];

  const goodCredentials = await comparePassword(password, user.hashed_password);

  if (!goodCredentials) {
    return res.sendStatus(401);
  }

  global.user_id = user.id;

  return res.status(200).json({
    name: user.name,
    email: user.email,
  });
}

function logoff(req, res) {
  global.user_id = null;

  return res.sendStatus(200);
}

module.exports = {
  register,
  logon,
  logoff,
};
