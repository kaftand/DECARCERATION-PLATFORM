const AWS = require("aws-sdk");
AWS.config.update({region:"us-east-2"})
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getEvents = async event => {
  // Request body is passed in as a JSON encoded string in 'event.body'
  console.log(event)
  const params = {
    TableName: "calendar-events",
    // 'Item' contains the attributes of the item to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'noteId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    FilterExpression: "#v > :startDate AND #v<= :endDate",
    ExpressionAttributeNames: {"#v": "start\-time"},
    ExpressionAttributeValues: {":startDate": parseInt(event.queryStringParameters.startDate) ,
                              ":endDate": parseInt(event.queryStringParameters.endDate)},
    //AttributesToGet: [ "description", "start-time", "end-time", "location", "title" ],
  };
  console.log(params)
  const out = await dynamoDb.scan(params, (error, data) => {
    // Set response headers to enable CORS (Cross-Origin Resource Sharing)
  }).promise();
  const res =
  {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
    },
    body : JSON.stringify(out.Items)
  }
  return res
}