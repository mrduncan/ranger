Ranger
======

Ranger is a [node.js](http://nodejs.org/) library for interacting with [Campfire](http://campfirenow.com/).

Install
-------
Install ranger using [npm](http://npmjs.org/).

    npm install ranger

API
---
Create a new client with the following:

    var client = require("ranger").createClient("account", "api-key");

The createClient function takes two parameters:

1. The account name, which is the subdomain of your account url.  If your account url is `37signals.campfire.com` then your account name would be `37signals`.
2. The api key of the user to connect as.  You can get it from the "My info" link once logged into Campfire.

### Client
Get a room by id:

    client.room(12345, function (room) { console.log(room); });

Get an array of all rooms:

    client.rooms(function (rooms) { console.log(rooms); });

Get an array of all rooms the api user is in:

    client.presence(function (rooms) { console.log(rooms) });

Search for messages containing terms:

    client.search("party time", function (messages) { console.log(messages) });

Get a user by id:

    client.user(12345, function (user) { console.log(user); });

Get the api user:

    client.me(function (user) { console.log(user); });

### Room
Speak a message:

    room.speak("hello world");

Paste some text:

    room.paste("hello\nworld");

Play a sound:

    room.play("trombone");

Show a tweet:

    room.tweet("https://twitter.com/#!/jack/status/20");

Update the room:

    room.update({ name: "Lounge", topic: "Anything goes" });

Join the room:

    room.join();

Leave the room:

    room.leave();

Lock the room:

    room.lock();

Unlock the room:

    room.unlock();

Get an array of users in the room:

    room.users(function (users) { console.log(users); });

Get an array of up to 5 recent file uploads in the room:

    room.recentUploads(function (uploads) { console.log(uploads); });

Get an array of up to 100 recent messages in the room:

    room.recentMessages(function (messages) { console.log(messages); });

Listen for messages in the room:

    room.listen(function (message) { console.log(message); });

Get whether messages are being listened for:

    room.isListening();

Stop listening for messages in the room:

    room.stopListening();

Get an array of messages for a day:

    room.transcript(function (messages) { console.log(messages); });

    var newYears = new Date(2011, 0, 1);
    room.transcript(newYears, function (messages) { console.log(messages); });

### Message
Star the message:

    message.star();

Unstar the message:

    message.unstar();

Get the upload details for the message:

    message.upload(function (upload) { console.log(upload); });


Examples
--------
The following example joins room 123456 and plays the vuvuzela sound whenever
anyone uses the word "soccer".

    var client = require("ranger").createClient("account", "api-key");
    client.room(123456, function (room) {
      room.join(function () {
        room.listen(function (message) {
          if (message.type = "TextMessage" && message.body.match(/soccer/i)) {
            room.play("vuvuzela");
          }
        });
      });
    });

Contributing
------------

1. [Fork](http://help.github.com/fork-a-repo/) Ranger
2. Create a topic branch - git checkout -b mybranch
3. Push to your branch - git push origin mybranch
4. Create a new pull request

Author
------
Matt Duncan | [mattduncan.org](http://mattduncan.org) | [matt@mattduncan.org](mailto:matt@mattduncan.org)
