# bionic backend

```
npm start
```

## example usage:

```
POST /api/bionic

body:
    url: "https://puersa.com/assets/sample.pdf"
```

Response json:

```json
{
  "url": "https://firebaseUrl/sample.pdf",
  "htmlUrl": "https://firebaseUrl/sample.html"
}
```

## env variables:
### For Firebase configuration
- `FIREBASE_API_KEY` 
- `FIREBASE_APP_ID`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_MEASUREMENT_ID`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`

### For Firebase Admin
- `FB_ADMIN_TYPE`
- `FB_ADMIN_TOKEN_URI`
- `FB_ADMIN_PROJECT_ID`
- `FB_ADMIN_PRIVATE_KEY_ID`
- `FB_ADMIN_PRIVATE_KEY`
- `FB_ADMIN_CLIENT_X509_CERT_URL`
- `FB_ADMIN_CLIENT_ID`
- `FB_ADMIN_CLIENT_EMAIL`
- `FB_ADMIN_AUTH_URI`
- `FB_ADMIN_AUTH_PROVIDER_X509_CERT_URL`

In the Elastic Beanstalk Deployment, these variables are set by `Go to your environment` > `Configuration` > `Software` > `Edit` then scroll all the way down.

# Deployment Notes
1. You can follow this guide to deploy the ExpressJS server to Elastic Beanstalk: https://www.honeybadger.io/blog/node-elastic-beanstalk/.
2. Make sure to do **manual deployment**. The pipeline deployment does not work.
3. When compressing/zipping your files, make sure to always exclude the `node_modules` folder.
4. If you're deploying in a all new Elastic Beanstalk environment, make sure to add the .platform folder in your zipped/compressed filed.
5. If you're updating an already existing environment, make sure to *exclude the .platform* folder.
6. The `.platform` folder contains scripts to run in the EC2 instance the server is being ran on. It is necessary to install specific linux dependencies for some of the npm packages to work.
