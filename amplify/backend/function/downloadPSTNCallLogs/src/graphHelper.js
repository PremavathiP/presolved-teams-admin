require("isomorphic-fetch");
const azure = require("@azure/identity");
const graph = require("@microsoft/microsoft-graph-client");
const authProviders = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");

let _settings = undefined;
let _deviceCodeCredential = undefined;
let _userClient = undefined;

// <AppOnyAuthConfigSnippet>
let _clientSecretCredential = undefined;
let _appClient = undefined;

class graphHelper {
  //constructor
  constructor() {
    //console.log('graphHelper constructor');
  }

  ensureGraphForAppOnlyAuth(forceRefresh = false) {
    // Ensure settings isn't null
    if (!_settings) {
      throw new Error("Settings cannot be undefined");
    }

    if (!_clientSecretCredential || forceRefresh) {
      _clientSecretCredential = new azure.ClientSecretCredential(
        _settings.tenantId,
        _settings.clientId,
        _settings.clientSecret
      );
    }

    if (!_appClient || forceRefresh) {
      const authProvider =
        new authProviders.TokenCredentialAuthenticationProvider(
          _clientSecretCredential,
          {
            scopes: ["https://graph.microsoft.com/.default"],
          }
        );

      _appClient = graph.Client.initWithMiddleware({
        authProvider: authProvider,
      });
    }
  }
  async getPSTNCallRecords(settings, fromDate, toDate) {
    // Ensure settings isn't null
    if (!settings) {
      throw new Error("Settings cannot be undefined");
    }

    _settings = settings;

    this.ensureGraphForAppOnlyAuth();

    // Ensure client isn't undefined
    if (!_appClient) {
      throw new Error("Graph has not been initialized for app-only auth");
    }

    let response = await _appClient
      .api(
        `/communications/callRecords/getPstnCalls(fromDateTime=${fromDate},toDateTime=${toDate})`
      )
      .get();
    return response;
  }
}

module.exports = graphHelper;
