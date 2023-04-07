/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateClientIntergrations = /* GraphQL */ `
  subscription OnCreateClientIntergrations($tenantId: String) {
    onCreateClientIntergrations(tenantId: $tenantId) {
      id
      tenantId
      mstenantId
      loginMS
      consentMS
      attributes
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateClientIntergrations = /* GraphQL */ `
  subscription OnUpdateClientIntergrations($tenantId: String) {
    onUpdateClientIntergrations(tenantId: $tenantId) {
      id
      tenantId
      mstenantId
      loginMS
      consentMS
      attributes
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteClientIntergrations = /* GraphQL */ `
  subscription OnDeleteClientIntergrations($tenantId: String) {
    onDeleteClientIntergrations(tenantId: $tenantId) {
      id
      tenantId
      mstenantId
      loginMS
      consentMS
      attributes
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClientUserWhitelisting = /* GraphQL */ `
  subscription OnCreateClientUserWhitelisting($tenantId: String) {
    onCreateClientUserWhitelisting(tenantId: $tenantId) {
      id
      tenantId
      displayName
      businessPhones
      givenName
      jobTitle
      mail
      mobilePhone
      officeLocation
      preferredLanguage
      surname
      userPrincipalName
      uid
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateClientUserWhitelisting = /* GraphQL */ `
  subscription OnUpdateClientUserWhitelisting($tenantId: String) {
    onUpdateClientUserWhitelisting(tenantId: $tenantId) {
      id
      tenantId
      displayName
      businessPhones
      givenName
      jobTitle
      mail
      mobilePhone
      officeLocation
      preferredLanguage
      surname
      userPrincipalName
      uid
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteClientUserWhitelisting = /* GraphQL */ `
  subscription OnDeleteClientUserWhitelisting($tenantId: String) {
    onDeleteClientUserWhitelisting(tenantId: $tenantId) {
      id
      tenantId
      displayName
      businessPhones
      givenName
      jobTitle
      mail
      mobilePhone
      officeLocation
      preferredLanguage
      surname
      userPrincipalName
      uid
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePresolvedAudit = /* GraphQL */ `
  subscription OnCreatePresolvedAudit($tenantId: String) {
    onCreatePresolvedAudit(tenantId: $tenantId) {
      id
      tenantId
      resource
      action
      byUser
      byDateTime
      changesMade
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePresolvedAudit = /* GraphQL */ `
  subscription OnUpdatePresolvedAudit($tenantId: String) {
    onUpdatePresolvedAudit(tenantId: $tenantId) {
      id
      tenantId
      resource
      action
      byUser
      byDateTime
      changesMade
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePresolvedAudit = /* GraphQL */ `
  subscription OnDeletePresolvedAudit($tenantId: String) {
    onDeletePresolvedAudit(tenantId: $tenantId) {
      id
      tenantId
      resource
      action
      byUser
      byDateTime
      changesMade
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClientSignup = /* GraphQL */ `
  subscription OnCreateClientSignup($id: String) {
    onCreateClientSignup(id: $id) {
      id
      name
      email
      phone
      company
      address
      city
      state
      zip
      country
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateClientSignup = /* GraphQL */ `
  subscription OnUpdateClientSignup($id: String) {
    onUpdateClientSignup(id: $id) {
      id
      name
      email
      phone
      company
      address
      city
      state
      zip
      country
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteClientSignup = /* GraphQL */ `
  subscription OnDeleteClientSignup($id: String) {
    onDeleteClientSignup(id: $id) {
      id
      name
      email
      phone
      company
      address
      city
      state
      zip
      country
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClientUsers = /* GraphQL */ `
  subscription OnCreateClientUsers($tenantId: String) {
    onCreateClientUsers(tenantId: $tenantId) {
      id
      tenantId
      name
      email
      role
      status
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateClientUsers = /* GraphQL */ `
  subscription OnUpdateClientUsers($tenantId: String) {
    onUpdateClientUsers(tenantId: $tenantId) {
      id
      tenantId
      name
      email
      role
      status
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteClientUsers = /* GraphQL */ `
  subscription OnDeleteClientUsers($tenantId: String) {
    onDeleteClientUsers(tenantId: $tenantId) {
      id
      tenantId
      name
      email
      role
      status
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClientCallLogs = /* GraphQL */ `
  subscription OnCreateClientCallLogs($tenantId: String) {
    onCreateClientCallLogs(tenantId: $tenantId) {
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
export const onUpdateClientCallLogs = /* GraphQL */ `
  subscription OnUpdateClientCallLogs($tenantId: String) {
    onUpdateClientCallLogs(tenantId: $tenantId) {
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
export const onDeleteClientCallLogs = /* GraphQL */ `
  subscription OnDeleteClientCallLogs($tenantId: String) {
    onDeleteClientCallLogs(tenantId: $tenantId) {
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
