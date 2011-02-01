var Upload = require("./upload").Upload,
    urlFor = require("./restful").urlFor;

/**
 * A chat message.
 * @constructor
 * @param {Connection} connection A server connection.
 * @param {Object} attrs The initial attributes of this message.
 */
exports.Message = function (connection, attrs) {
  var self, post;

  self = this;
  this.type = attrs.type;
  this.id = attrs.id;
  this.roomId = attrs.room_id;
  this.body = attrs.body;
  this.userId = attrs.user_id;
  this.createdAt = new Date(attrs.created_at);

  post = function (action, body, callback) {
    connection.post(urlFor("messages", self.id, action), body, callback);
  };

  del = function (action, callback) {
    connection.del(urlFor("messages", self.id, action), callback);
  };

  /**
   * Gets the file upload for this message.
   * @param {function(Upload)} callback The callback to call with the upload.
   */
  this.upload = function (callback) {
    var path = "/room/" + this.roomId + "/messages/" + this.id + "/upload.json";
    connection.get(path, function (data) {
      callback(new Upload(connection, data.upload));
    });
  };

  /**
   * Highlights this message.
   * @param {function()=} callback The optional callback to call when complete.
   */
  this.star = function (callback) {
    post("star", callback);
  };

  /**
   * Removes the highlight from this message.
   * @param {function()=} callback The optional callback to call when complete.
   */
  this.unstar = function (callback) {
    del("star", callback);
  };
};
