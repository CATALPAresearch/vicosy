export const initializeFirePadApp = () => {
  if (!window.firebase.apps.length) {
    var config = {
      apiKey: "AIzaSyBK02Xl4yTK7SpOxTfup1jm4IYpsh8cEZ4",
      authDomain: "closeuptogether.firebaseapp.com",
      databaseURL: `https://closeuptogether.firebaseio.com`
    };
    return window.firebase.initializeApp(config);
  } else {
    return window.firebase.apps[0];
  }
};
