const GRAPHQL_ENDPOINT = process.env.API_PRESOLVEDTEAMSADMIN_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_PRESOLVEDTEAMSADMIN_GRAPHQLAPIKEYOUTPUT;

class CallRecords {
    constructor() {
        //this.graphql = require('graphql-request');
       // this.graphqlClient = new this.graphql.GraphQLClient(GRAPHQL_ENDPOINT, {
       //     headers: {
       //         'x-api-key': GRAPHQL_API_KEY
       //     }
        }
    

    async writeCallRecord(callRecord) {
        const createClientCallLogs = /* GraphQL */ `
        mutation CreateClientCallLogs(
          $input: CreateClientCallLogsInput!
          $condition: ModelClientCallLogsConditionInput
        ) {
          createClientCallLogs(input: $input, condition: $condition) {            
            tenantId
            callRecordId            
            callType            
            callStartTime
            callEndTime
            callDuration
            charge
            callerNumber
            calleeNumber
            createdAt
            updatedAt
          }
        }
      `;       
        const variables = {
            input: callRecord
        };
       // console.log('callrecord ------>>>>', callRecord);
        const options = {
            method: "POST",
            headers: {
              "x-api-key": GRAPHQL_API_KEY,
            },
            body: JSON.stringify({ query:createClientCallLogs, variables }),
          };

        const request = new Request(GRAPHQL_ENDPOINT, options); 

        try {
            const response = await fetch(request);            
            const json = await response.json();
            console.log("Response from the API:----->>> ", json);
            return json;
          } catch (error) {
            console.log("Error calling API: ", error);
            return error;
          }
        

        
        return response;    
    }
 // write a function to signature version 4 sign the aws api request
    async signRequest(request) {
        // get temporary credentials for lambda function
        const credentials = await this.getCredentials();       
        const signer = new AWS.Signers.V4(request, 'execute-api');
        signer.addAuthorization(credentials, new Date());
        return request;
    }

 
 
 
       
}
module.exports = CallRecords;
