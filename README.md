# Feed Challenge
A Coding Challenge for developer candidates

Instructions:

Using nodejs, create an API that will have a feed, similar to Twitter and Facebook.

A FeedItem (similar to a Tweet), will have text posted by a User.
A Comment has commentText posted by a User and is associated with a FeedItem.

The data is provided as json files.

The API should have a method to list all of the feedItems, with their associated 
comments and user names in a single request.

Example data of the complete feed can be found in MOCK_DATA.json.

Any version of node may be used.  
Any libraries may be used.
The API could be REST, graphQL, or any other type.

Please includes any tests that would be appropriate.

Also, please add something of your own choice to the API that will enhance it in some way.

The goal should be to write in a clean, maintainable style. and should be reasonably performant.


### Schemas

##### FeedItems:
userId (of the feedItem creator)
feedText
feedId
createdAt (date)

##### Users:
userId
username
createAt (date)

##### Comments:
feedId
userId
commentText
createdAt (date)

