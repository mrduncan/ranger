/**
 * A chat message.
 * @constructor
 * @param {Connection} connection A server connection.
 * @param {Object} attrs The initial attributes of this message.
 */
exports.Message = function (connection, attrs) {
  var self, urlFor, post;

  self = this;
  this.type = attrs.type;
  this.id = attrs.id;
  this.roomId = attrs.room_id;
  this.body = attrs.body;
  this.userId = attrs.user_id;
  this.createdAt = new Date(attrs.created_at);

  /**
   * Returns the url for the specified action.
   * @param {string} action The action to get the url for.
   * @return {string} The url for the specified action.
   */
  urlFor = function (action) {
    return "/messages/" + self.id + "/" + action + ".json";
  };

  post = function (action, body, callback) {
    connection.post(urlFor(action), body, callback);
  };

  /**
   * Highlights this message.
   * @param {function()=} callback The optional callback to call when complete.
   */
  this.star = function (callback) {
    post("star", callback);
  };
};
