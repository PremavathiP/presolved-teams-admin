/* Amplify Params - DO NOT EDIT
	API_PRESOLVEDTEAMSADMIN_GRAPHQLAPIENDPOINTOUTPUT
	API_PRESOLVEDTEAMSADMIN_GRAPHQLAPIIDOUTPUT
	API_PRESOLVEDTEAMSADMIN_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const { downloadPSTNLogs} =require ('./downloadLogs');


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    let callRecords = await downloadPSTNLogs();
    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  }, 
        body: JSON.stringify('Downloaded call logs successfully'),
    };
};
