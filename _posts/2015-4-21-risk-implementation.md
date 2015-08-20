---
category: articles
layout: post
title: Risk Implementation

---

In my third year at university, I completed an implementation of the game Risk. The finished report has the following abstract.

*The project specification was to create a program to simulate a world domination board game.  More specifically this implementation would be a  peer to peer multi-player game, playable by both a human player and by an AI computer opponent. Agreed amongst the class was the implementation of the Risk board game. The class negotiated a standard set of rules based upon the Risk manual and also agreed upon a protocol for inter group communication. The  risk implementation described by this report adheres to this specification and implements some extensions. This includes, multiple classes of AI with varying performance; a flexible, threaded risk game engine; a peer to peer TCP protocol implementation; a centralised websockets-based lobby server; a web-based user interface.*

To try out the game, [download the build](/assets/files/risk.zip) and run `java -jar risk-lobby.jar`. You should be able to access the game through a web browser on port 8080. The source is hosted in [a github repository](https://github.com/billytrend/risk-backend).