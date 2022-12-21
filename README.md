# Firebase Showcase

## `Developed in React with Tailwind CSS`
## How to create a project

 - Create a project at https://console.firebase.google.com/
 - After the project is created you have to create an "Web" app for the project
 - In "Project settings" you can get the SDK setup and configuration, with the Firebase configuration keys


## How to setup Cloud Messaging

- You need to enable Cloud Messaging Legacy at https://console.cloud.google.com/apis/library
- Search for "Cloud Messaging", manage and enable the API
- After that in Project Settings->Cloud Messaging you can get your server key where "Cloud Messaging API (Legacy)" is
- In your .env file paste the server key for "REACT_APP_FCM_AUTHORIZATION" 

## Main packages

```bash
  npm install firebase
  npm install firestore
  npm install react-firebase-hooks
  npm install axios
```

### `Firebase authentication`

#### with google
https://firebase.google.com/docs/auth/web/google-signin

#### with password
https://firebase.google.com/docs/auth/web/password-auth

### `Firebase realtime database`

https://firebase.google.com/docs/database/web/start

### `Firestore`

https://firebase.google.com/docs/firestore

### `Cloud messaging`

https://firebase.google.com/docs/cloud-messaging


### `Hooks functions`

#### `package react-firebase-hooks`
\
`Example:` useCollection

- allows the user to monitor a collection value in Cloud Firestore (https://github.com/CSFrequency/react-firebase-hooks/tree/master/firestore#usecollection)




