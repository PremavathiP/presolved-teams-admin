const axios = require("axios");
const validate = require("validate-azure-ad-token").default;
const DynamoDB = require("./utils/ddb");

class MSTeams {
  constructor() {
    this.apiURL = process.env.CallManagerURL;
  }

  async getUsers(tenantId, displayName) {
    const url = `${this.apiURL}/api/users?tenantId=${tenantId}&displayName=${displayName}`;
    const response = await axios.get(url);
    return response.data;
  }

  /* Validate the MS Graph Idtoken */
  async validateIdToken(idToken, tenantId) {
    try {
      const decodedToken = await validate(idToken, {
        tenantId: tenantId,
        audience: "00000003-0000-0000-c000-000000000000",
        applicationId: "32c21b01-f645-4433-8726-456c9f46958e",
        scopes: ["User.Read"], // for example ["User.Read"]
      });

      const ddb = new DynamoDB();
      const data = {
        id: decodedToken.payload.oid,
        displayName: decodedToken.payload.name,
        tenantId: decodedToken.payload.tid,
        email: decodedToken.payload.preferred_username,
        roles: decodedToken.payload.roles,
        created: new Date().toISOString(),
      };
      await ddb.writeToAuditTable(data);


      //console.log("Decoded Token is ", decodedToken);
      //let expiryTime = decodedToken.payload.exp;
      //Convert Expiry time to Date Time Format
      //let expiryDate = new Date(0);
      //expiryDate.setUTCSeconds(expiryTime);
      //console.log("Expiry Date is ", expiryDate);
      return true;
    } catch (error) {
      // ALL ERRORS GONNA SHOW HERE AS A STRING VALUE
      console.log("Error validating the token ", error);
      return false;
    }
  }

  /* Check if the token is valid by calling MS Graph API */
  async validateAuthToken(token) {
    try {
      const url = `https://graph.microsoft.com/v1.0/me`;
      const response = await axios.get(url, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error validating the token ", error);
      return null;
    }
  }
}

module.exports = MSTeams;
