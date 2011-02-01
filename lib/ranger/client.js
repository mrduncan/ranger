var Connection = require("./connection").Connection,
    Message = require("./message").Message,
    Room = require("./room").Room,
    User = require("./user").User,
    urlFor = require("./restful").urlFor;

/**
 * A campfire client for a specific account.
 * @constructor
 * @param {string} account The name of the account to connect to.
 * @param {string} token The api token to connect with.
 */
exports.Client = function (account, token) {
  /**
   * Convert the specified response data into an array of Rooms.
   * @param {Object} data The server response data.
   * @return {Array.<Room>} An array of Rooms.
   */
  function toRooms(data) {
    var i, rooms;

    rooms = [];
    for (i = 0; i < data.rooms.length; i++) {
      rooms.push(new Room(connection, data.rooms[i]));
    }

    return rooms;
  }

  var connection = new Connection(account, token);

  /**
   * Gets the room with the specified id.
   * @param {number} id The id of the room.
   * @param {function(Room)} callback The callback to call with the room result.
   */
  this.room = function (id, callback) {
    connection.get(urlFor("room", id), function (data) {
      callback(new Room(connection, data.room));
    });
  };

  /**
   * Gets an array of all rooms.
   * @param {function(Array.<Room>)} callback The callback to call with results.
   */
  this.rooms = function (callback) {
    connection.get(urlFor("rooms"), function (data) {
      callback(toRooms(data));
    });
  };

  /**
   * Gets an array of all rooms which the api user is present in.
   * @param {function(Array.<Room>)} callback The callback to call with results.
   */
  this.presence = function (callback) {
    connection.get(urlFor("presence"), function (data) {
      callback(toRooms(data));
    });
  };

  /**
   * Gets an array of messages which match the specified term.
   * @param {string} term The search term.
   * @param {function(Array.<Message>)} callback The callback to call with results.
   */
  this.search = function (term, callback) {
    connection.get(urlFor("search", term), function (data) {
      var i, messages = [];
      for (i = 0; i < data.messages.length; i++) {
        messages.push(new Message(connection, data.messages[i]));
      }

      callback(messages);
    });
  };

  /**
   * Gets the user with the specified id.
   * @param {number} id The id of the user.
   * @param {function(User)} callback The callback to call with the user result.
   */
  this.user = function (id, callback) {
    connection.get(urlFor("users", id), function (data) {
      callback(new User(connection, data.user));
    });
  };

  /**
   * Gets the current api user.
   * @param {function(User)} callback The callback to call with the user result.
   */
  this.me = function (callback) {
    connection.get(urlFor("users", "me"), function (data) {
      callback(new User(connection, data.user));
    });
  };
};
