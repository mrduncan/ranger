/**
 * A Campfire user.
 * @param {Connection} connection A server connection.
 * @param {Object} attrs The initial attributes of this user.
 */
exports.User = function (connection, attrs) {
  this.id = attrs.id;
  this.name = attrs.name;
  this.emailAddress = attrs.email_address;
  this.type = attrs.type;
  this.admin = attrs.admin;
  this.createdAt = new Date(attrs.created_at);
};
