export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  STRIPE_KEY: "pk_test_51GxKZKCj77DIADOKg9k7qRz8el0pbDovgOKCiPXCgGUBt51HrgVCXNSQr21cxfRvSe2xJDwIXYPkL8nyBFOj0IDD00dI772GaY",
  s3: {
    REGION: "us-east-2",
    BUCKET: "lucas-notes-app-api-prod-serverlessdeploymentbuck-2xum7rvze07h"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://l3dw5okdd8.execute-api.us-east-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_d5pm40iuk",
    APP_CLIENT_ID: "3iopfdiuouqsfbel4c4799as2i",
    IDENTITY_POOL_ID: "us-east-2:e3c4687b-ca4a-43b8-baf4-ff13106c0c8a"
  }
};
