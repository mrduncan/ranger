var Message = require("./message.js").Message,
    Upload = require("./upload.js").Upload;

/**
 * A chat room.
 * @constructor
 * @param {Connection} connection A server connection.
 * @param {Object} attrs The initial attributes of this room.
 */
exports.Room = function (connection, attrs) {
  var self, urlFor, get, post, put, sendMessage, listenConnection;

  self = this;
  this.id = attrs.id;
  this.name = attrs.name;
  this.topic = attrs.topic;
  this.membershipLimit = attrs.membership_limit;
  this.locked = attrs.locked;
  this.createdAt = new Date(attrs.created_at);
  this.updatedAt = new Date(attrs.updated_at);

  /**
   * Returns the url for the specified action.
   * @param {string} action The action to get the url for.
   * @return {string} The url for the specified action.
   */
  urlFor = function (action) {
    return "/room/" + self.id + "/" + action + ".json";
  };

  get = function (action, callback) {
    connection.get(urlFor(action), callback);
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
   * @param {function(Array.<Message>)} callback The callback to call with the array of messages.
   */
  this.recentMessages = function (callback) {
    get("recent", function (data) {
      var i, messages = [];
      for (i = 0; i < data.messages.length; i++) {
        messages.push(new Message(connection, data.messages[i]));
      }

      callback(messages);
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
};
