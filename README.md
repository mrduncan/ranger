Ranger
======

Ranger is a [node.js](http://nodejs.org/) library for interacting with [Campfire](http://campfirenow.com/).

Usage
-----
Install ranger using [npm](http://npmjs.org/).

    npm install ranger

The following example gets an array of rooms which the user is present in and then plays the `vuvuzela` sound and says "vuvuzela time!" in the first one.

    var client = require("ranger").createClient("account", "api-key");
    client.presence(function (rooms) {
      rooms[0].play("vuvuzela");
      rooms[0].speak("vuvuzela time!");
    });

The createClient function takes two parameters:

1. The account name, which is the subdomain of your account url.  If your account url is `37signals.campfire.com` then your account name would be `37signals`.
2. The api key of the user to connect as.  You can get it from the "My info" link once logged into Campfire.

Contributing
------------

1. [Fork](http://help.github.com/forking/) Ranger
2. Create a topic branch - git checkout -b mybranch
3. Push to your branch - git push origin mybranch
4. Create a new pull request

Author
------
Matt Duncan | [mattduncan.org](http://mattduncan.org) | [matt@mattduncan.org](mailto:matt@mattduncan.org)
