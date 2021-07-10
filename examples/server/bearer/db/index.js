// @ts-check

const fs = require("fs");
const nanoid = require("./_id");
const bcrypt = require("bcrypt");

class JsonDB {
  /** Destination path to write & read JSON file
   * @type {fs.PathLike}
   */
  destination;

  /** All users array
   * @typedef {{id: String, username: String, password: string}} User
   * @type {Array<User>}
   */
  users;

  /**
   *
   * @param {fs.PathLike} destination
   */
  constructor(destination) {
    this.destination = destination;

    this.read();
  }

  /**
   * @private
   */
  createFileIfNotExist() {
    if (!fs.existsSync(this.destination)) {
      fs.writeFileSync(this.destination, JSON.stringify([]), {
        encoding: "utf-8",
      });
    }
  }

  /**
   *
   * @returns {boolean}
   */
  write() {
    this.createFileIfNotExist();

    fs.writeFileSync(this.destination, JSON.stringify(this.users, null, 2), {
      encoding: "utf-8",
    });
    return true;
  }

  /**
   * Read JSON data from destination file
   * Create file if not exist
   *
   * @returns {void}
   */
  read() {
    this.createFileIfNotExist();

    this.users = JSON.parse(
      fs.readFileSync(this.destination, { encoding: "utf-8" })
    );
  }

  /**
   * Find user by `usename` and `password`
   *
   * @param {string} username
   * @param {string} password
   * @return {User | undefined}
   */
  find(username, password) {
    if (this.users.length <= 0) {
      return undefined;
    }

    return this.users.find(
      (user) =>
        user.username === username &&
        bcrypt.compareSync(password, user.password)
    );
  }

  /**
   * Add user into users array and write into destination JSON file
   * @param {string} username
   * @param {string} password
   *
   * @returns {User | null}
   */
  add(username, password) {
    const hash = bcrypt.hashSync(password, 10);

    /**
     * @type {User}
     */
    const _user = {
      id: nanoid(),
      username,
      password: hash,
    };

    if (!this.find(username, password)) {
      this.users.push(_user);
      this.write();
      return _user;
    } else {
      return null;
    }
  }
}

module.exports = { JsonDB };
