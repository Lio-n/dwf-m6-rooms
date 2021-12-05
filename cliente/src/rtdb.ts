import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "2N36rS2a8I4SQywe78ZbjQ2yFO5LLDRdNgYaGncR",
  databaseURL: "https://apx-dwf-m6-c29ec-default-rtdb.firebaseio.com",
  authDomain: "apx-dwf-m6-c29ec.firebaseapp.com",
});

const rtdb = firebase.database();
export { rtdb };
