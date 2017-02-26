import firebase from 'firebase';
import { browserHistory } from 'react-router';


import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_NEW_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  SIGNIN,
  SIGNIN_ERROR,
  SIGNIN_SUCCESS,
  SIGNIN_NEW_USER_SUCCESS,
  SIGN_OUT_USER,
  AUTH_USER
} from './types';

const config = {
  apiKey: "AIzaSyCJxCW7ht2UzdP8d1JjYMLDQbkof-Jv5Y0",
  authDomain: "paddle-redux.firebaseapp.com",
  databaseURL: "https://paddle-redux.firebaseio.com",
  storageBucket: "paddle-redux.appspot.com",
  messagingSenderId: "261772544888"
};
firebase.initializeApp(config);

const authConfig = {
  facebookPermissions: ['public_profile', 'email']
};

function signInSuccess(uid) {
  return {
    type: SIGNIN_SUCCESS,
    uid
  }
}
// function signInNewUserSuccess(uid) {
//   return {
//     type: SIGNIN_NEW_USER_SUCCESS,
//     uid
//   }
// }

function signInInProgress() {
  return {
    type: SIGNIN
  }
}

function signInError(errorMessage) {
  return {
    type: SIGNIN_ERROR,
    errorMessage
  }
}

export function signIn() {
  return (dispatch) => {
    dispatch(signInInProgress());

    const provider = new firebase.auth.FacebookAuthProvider();
    authConfig.facebookPermissions.forEach(permission => provider.addScope(permission));

    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        const { user: { uid, displayName, photoURL, email } } = result;

        // firebase.database().ref(`users/${ uid }`).set({
        //   displayName,
        //   photoURL,
        //   email,
        //   lastTimeLoggedIn: firebase.database.ServerValue.TIMESTAMP
        // });

        dispatch(
          authUser()
        );
        browserHistory.push('/selected');
      })
      .catch((error) => {
        dispatch(signInError(error.message))
      });
  }
}

export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};

export const loginUser = ({ email, password }) => {
  return (dispatch) => {
    dispatch({ type: LOGIN_USER });

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => loginUserSuccess(dispatch, user))
      .catch(() => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(user => loginNewUserSuccess(dispatch, user))
          .catch(() => loginUserFail(dispatch));
      });
  };
};


const loginUserFail = (dispatch) => {
  dispatch({ type: LOGIN_USER_FAIL });
};

const loginUserSuccess = (dispatch, user) => {
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user
  });
};

const loginNewUserSuccess = (dispatch, user) => {
  dispatch({
    type: LOGIN_NEW_USER_SUCCESS,
    payload: user
  });
};

// export function verifyAuth(dispatch) {
//     return new Promise((resolve, reject) => {
//       const unsub = firebase.auth().onAuthStateChanged(
//         user => {
//           dispatch(authUser(user));
//           unsub();
//           resolve();
//         },
//         error => reject(error)
//       );
//     });
// }


export function authUser(user) {
  return {
    type: AUTH_USER,
    payload: user
  };
}

export function signOutUser() {
  browserHistory.push('/');

  return {
    type: SIGN_OUT_USER
  }
}

// function authenticate(provider) {
//   return dispatch => {
//     firebaseAuth.signInWithPopup(provider)
//       .then(result => dispatch(signInSuccess(result)))
//       .catch(error => dispatch(signInError(error)));
//   };
// }
// export function signInWithFacebook() {
//   return authenticate(new firebase.auth.FacebookAuthProvider());
// }
//
// firebase.auth().signInWithPopup(provider).then(function(result) {
//   // This gives you a Facebook Access Token. You can use it to access the Facebook API.
//   var token = result.credential.accessToken;
//   // The signed-in user info.
//   var user = result.user;
//   // ...
// }).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // The email of the user's account used.
//   var email = error.email;
//   // The firebase.auth.AuthCredential type that was used.
//   var credential = error.credential;
//   // ...
// });
