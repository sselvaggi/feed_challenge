# Solution instructions

Run:```
npm install; npm run start
```
Use the REST API with a single method
GET http://localhost:8080/api/feed

or

Use the GraphQL API at http://localhost:8080/graphql
```
query consumeFeed($filterFeedByOwnerId: Int,) {
    feed(filterFeedByOwnerId: $filterFeedByOwnerId) {
        text,
        createdAt,
        owner {
    		id,
            username
        },
    	comments {
    		id,
            text,
            owner {
                id,
                username
            } 
    	}
    }
}
```

If is defined "filterFeedByOwnerId" the feed will be filtered by Owner's id 
variables:
```
{
  "filterFeedByOwnerId": 1
}
```


# Feed Challenge
A Coding Challenge for developer candidates

Instructions:

Using nodejs, create an API that will have a feed, similar to Twitter and Facebook.

A FeedItem (similar to a Tweet), will have text posted by a User.
A Comment has commentText posted by a User and is associated with a FeedItem.

The data is provided as json files.

The API should have a method to list all of the feedItems, with their associated 
comments and user names in a single request.

If any of the data is missing on either a user, comment, or feedItem, 
the element with missing data should not be returned by the API.
For example, if the username of a commenter is missing, the comment should not be displayed at all.


Example data of the complete feed can be found in MOCK_DATA.json.

Any version of node may be used.  
Any libraries may be used.
The API could be REST, graphQL, or any other type.

Only a single "getter" endpoint will need to be created.

Please includes any tests that would be appropriate.

Also, please add something of your own choice to the API that will enhance it in some way.

The goal should be to write in a clean, maintainable style, and should be reasonably performant.


### Schemas

##### FeedItems:
userId (of the feedItem creator)\
feedText\
feedId\
createdAt (date)

##### Users:
userId\
username\
createAt (date)

##### Comments:
feedId\
userId\
commentText\
createdAt (date)

