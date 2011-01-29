var Message = require("./message.js").Message,
    Upload = require("./upload.js").Upload,
    User = require("./user.js").User;

/**
 * A chat room.
 * @constructor
 * @param {Connection} connection A server connection.
 * @param {Object} attrs The initial attributes of this room.
 */
exports.Room = function (connection, attrs) {
  var self, resultToMessages, urlFor, get, post, put, sendMessage, listenConnection;

  self = this;
  this.id = attrs.id;
  this.name = attrs.name;
  this.topic = attrs.topic;
  this.membershipLimit = attrs.membership_limit;
  this.locked = attrs.locked;
  this.createdAt = new Date(attrs.created_at);
  this.updatedAt = new Date(attrs.updated_at);

  /**
   * Returns an array of message objects given the server response.
   * @param {Object} result The server result.
   * @return {Array.<Message>} The resulting messages.
   */
  resultToMessages = function (result) {
    var i, messages = [];
    for (i = 0; i < result.messages.length; i++) {
      messages.push(new Message(connection, result.messages[i]));
    }

    return messages;
  }

  /**
   * Returns the url for the specified action.
   * @param {string} action The action to get the url for.
   * @return {string} The url for the specified action.
   */
  urlFor = function (action) {
    var url = "/room/" + self.id;
    if (action) {
      url += "/" + action;
    }

    return url + ".json";
  };

  get = function (action, params, callback) {
    connection.get(urlFor(action), params, callback);
  };

  post = function (action, body, callback) {
    connection.post(urlFor(action), body, callback);
  };

  put = function (body, callback) {
    connection.put("/room/" + self.id + ".json", body, callback);
  };

  /**
   * Sends the specified message.
   * @param {string} message The message to send.
   * @param {string} type The type of message.
   * @param {function()=} callback The optional callback to call when complete.
   */
  sendMessage = function (message, type, callback) {
    post("speak", {
      message: {
        body: message,
        type: type
      }
    }, callback);
  };

  /**
   * Sends the specified message.
   * @param {string} message The message to send.
   * @param {function()=} callback The optional callback to call when complete.
   */
  this.speak = function (message, callback) {
    sendMessage(message, "TextMessage", callback);
  };

  /**
   * Sends the specified pre-formatted message.
   * @param {string} message The message to send.
   * @param {function()=} callback The optional callback to call when complete.
   */
  this.paste = function (message, callback) {
    sendMessage(message, "PasteMessage", callback);
  };

  /**
   * Plays the sound with the specified name.
   * @param {string} name The name of the sound to play.
   * @param {function()=} callback The optional callback to call when complete.
   */
  this.play = function (name, callback) {
    sendMessage(name, "SoundMessage", callback);
  };

  /**
   * Updates the specified room attributes.
   * @param {Object} attributes The attributes to update.
   * @param {function()=} callback The optional callback to call when comlete.
   */
  this.update = function (attributes, callback) {
    // TODO: Update the name and topic of the room after complete
    put({ room: attributes }, callback);
  };

  /**
   * Join this room.
   * @param {function()=} callback The optional callback to call when complete.
   */
  this.join = function (callback) {
    post("join", callback);
  };

  /**
   * Leave this room.
   * @param {function()=} callback The optional callback to call when complete.
   */
  this.leave = function (callback) {
    post("leave", callback);
  };

  /**
   * Lock this room. You must be in a room to lock it.
   * @param {function()=} callback The optional callback to call when complete.
   */
  this.lock = function (callback) {
    post("lock", callback);
  };

  /**
   * Unlock this room.
   * @param {function()=} callback The optional callback to call when complete.
   */
  this.unlock = function (callback) {
    post("unlock", callback);
  };

  /**
   * Gets an array of users currently in this room.
   * @param {function(Array.<User>)} callback The callback to call with the array of users.
   */
  this.users = function (callback) {
    get(null, function (data) {
      var i, users = [];
      for (i = 0; i < data.room.users.length; i++) {
        users.push(new User(connection, data.room.users[i]));
      }

      callback(users);
    });
  };

  /**
   * Gets the file upload with the specified message id.
   * @param {number} messageId The id of the message to get the upload from.
   * @param {function(Upload)} callback The callback to call with the upload.
   */
  this.upload = function (messageId, callback) {
    get("messages/" + messageId + "/upload", function (data) {
      callback(new Upload(connection, data.upload));
    });
  };

  /**
   * Gets up to 5 recent file uploads in the room.
   * @param {function(Array.<Upload>)} callback The callback to call with the array of uploads.
   */
  this.recentUploads = function (callback) {
    get("uploads", function (data) {
      var i, uploads = [];
      for (i = 0; i < data.uploads.length; i++) {
        uploads.push(new Upload(connection, data.uploads[i]));
      }

      callback(uploads);
    });
  };

  /**
   * Gets up to 100 recent messages in the room.
   * The following options are valid:
   * limit - Limits the number of results (a max of 100 will be returned).
   * sinceMessageId - Only retrieve messages after this message id.
   * @param {Object=} options The optional options to use.
   * @param {function(Array.<Message>)} callback The callback to call with the array of messages.
   */
  this.recentMessages = function (options, callback) {
    // Change case to what Campfire expects
    if (options && options.sinceMessageId) {
      options.since_message_id = options.sinceMessageId;
      delete options.sinceMessageId;
    }

    get("recent", options, function (data) {
      callback(resultToMessages(data));
    });
  };

  /**
   * Listen for messages in the room. Currently only one listener is supported,
   * subsequent listeners will be ignored.
   * @param {function(Message)} callback The callback to call with each message.
   */
  this.listen = function (callback) {
    if (self.isListening()) {
      return;
    }

    connection.stream(urlFor("live"), function (streamConnection) {
      listenConnection = streamConnection;
    }, function (data) {
      callback(new Message(connection, data));
    });
  };

  /**
   * Stops listening for messages in this room.
   */
  this.stopListening = function () {
    if (self.isListening()) {
      listenConnection.destroy();
      listenConnection = null;
    }
  };

  /**
   * Returns whether there is currently a connection listening on this room.
   * @return {boolean} Whether there is currently a connection listening.
   */
  this.isListening = function () {
    return !!(listenConnection);
  };

  /**
   * Gets all messages for a specified date.
   * @param {Date=} date The date to get messages for (defaults to today).
   * @param {function(Array.<Message>)} callback The callback to call with the array of messages.
   */
  this.transcript = function (date, callback) {
    var action = "transcript";

    if (typeof date === "function") {
      callback = date;
      date = null;
    }

    if (date) {
      action += "/" + date.getFullYear();
      action += "/" + (date.getMonth() + 1);
      action += "/" + date.getDate();
    }

    get(action, function (data) {
      callback(resultToMessages(data));
    });
  };
};
