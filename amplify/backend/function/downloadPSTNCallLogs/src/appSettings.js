// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

// Load the AWS SDK

const {
    SecretsManagerClient,
    GetSecretValueCommand,
  } = require("@aws-sdk/client-secrets-manager");
  
  const secret_name = process.env.MSGraphSecretKeyName;
  
  const client = new SecretsManagerClient({
    region: process.env.REGION,
  });
  
  async function getSecret() {
    let response;
  
    try {
      response = await client.send(
        new GetSecretValueCommand({
          SecretId: secret_name,
          VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
        })
      );
      const secret = response.SecretString;
      let secretSettings = JSON.parse(secret);
  
      let settingsValue = JSON.parse(secretSettings["key"]);
      return settingsValue;
    } catch (error) {
      // For a list of exceptions thrown, see
      // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
      console.log("Error getting secret: ", error);
      throw error;
    }
  }
  
  async function getSettings() {
    let settings = await getSecret();
    //console.log("Settings: ", settings);
    return settings;
  }
  
  module.exports.getSettings = getSettings;