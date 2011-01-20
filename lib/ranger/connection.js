var http = require("http");

/**
 * Returns the base64 encoded string.
 * @param {string} str The string to base64 encode.
 * @return {string} The base64 encoded string.
 */
var base64Encode = function (str) {
  var buffer = new Buffer(str, "utf8");
  return buffer.toString("base64");
};

/**
 * A connection to the campfire server.
 * @constructor
 * @param {string} account The name of the account to connect to.
 * @param {string} token The api token to connect with.
 */
exports.Connection = function (account, token) {
  var authorization = "Basic " + base64Encode(token + ":X");

  /**
   * Performs a request on the connection.
   * @param {string} method The http request method.
   * @param {string} path The path to request.
   * @param {Object} body The object to send as the body of the request.
   * @param {function()=} callback The callback to call when the request completes.
   */
  this.request = function (method, path, body, callback) {
    var headers, jsonBody, client, request;

    headers = {
      "Authorization": authorization,
      "Host": account + ".campfirenow.com",
      "Content-Type": "application/json"
    };

    if (method === "POST" || method === "PUT" || method === "DELETE") {
      if (body) {
        jsonBody = JSON.stringify(body);
        headers["Content-Length"] = jsonBody.length;
      } else {
        headers["Content-Length"] = 0;
      }
    }

    client = http.createClient(443, headers.Host, true);
    request = client.request(method, path, headers);
    request.on("response", function (response) {
      var data = "";

      response.on("data", function (chunk) {
        data += chunk;
      });
      response.on("end", function () {
        var parsedObj;

        if (callback) {
          try {
            parsedObj = JSON.parse(data);
          } catch (err) {

          }

          if (parsedObj) {
            callback(parsedObj);
          } else {
            callback();
          }
        }
      });
    });

    if (jsonBody) {
      request.write(jsonBody);
    }

    request.end();
  };

  /**
   * Performs a get request on the specified path.
   * @param {string} path The request path.
   * @param {function()=} callback The function to call when the request completes.
   */
  this.get = function (path, callback) {
    this.request("GET", path, null, callback);
  };

  /**
   * Performs a post request on the specified path.
   * @param {string} path The request path.
   * @param {Object=} body The body of the request.
   * @param {function()=} callback The function to call when the request completes.
   */
  this.post = function (path, body, callback) {
    if (typeof body === "function") {
      callback = body;
      body = null;
    }

    this.request("POST", path, body, callback);
  };

  /**
   * Performs a put request on the specified path.
   * @param {string} path The request path.
   * @param {Object=} body The body of the request.
   * @param {function()=} callback The function to call when the request completes.
   */
  this.put = function (path, body, callback) {
    if (typeof body === "function") {
      callback = body;
      body = null;
    }

    this.request("PUT", path, body, callback);
  };

  /**
   * Performs a delete request on the specified path.
   * @param {string} path The request path.
   * @param {function()=} callback The function to call when the request completes.
   */
  this.del = function (path, callback) {
    this.request("DELETE", path, null, callback);
  };
};
