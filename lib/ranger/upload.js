/**
 * A file uploaded to a room.
 * @param {Connection} connection A server connection.
 * @param {Object} attrs The initial attributes of this upload.
 */
exports.Upload = function (connection, attrs) {
  this.id = attrs.id;
  this.name = attrs.name;
  this.byteSize = attrs.byte_size;
  this.contentType = attrs.content_type;
  this.fullUrl = attrs.full_url;
  this.roomId = attrs.room_id;
  this.userId = attrs.user_id;
  this.createdAt = new Date(attrs.created_at);
};
