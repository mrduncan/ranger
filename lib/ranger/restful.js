/**
 * Returns a path for the specified resource.
 * @param {string} resource The resource.
 * @param {string|number} id The id of the resource.
 * @param {string} action The action.
 */
exports.urlFor = function (resource, id, action) {
  var url = "/" + resource;
  if (id) {
    url += "/" + id;
  }

  if (action) {
    url += "/" + action;
  }

  return url + ".json";
};
