import * as admin from "firebase-admin"; //Libreria
const serviceAccount = {
  type: process.env.FIRESTORE_CRED_TYPE,
  project_id: process.env.FIRESTORE_CRED_PROYECT_ID,
  private_key_id: process.env.FIRESTORE_CRED_PRIVATE_KEY_ID,
  private_key: process.env.FIRESTORE_CRED_PRIVATE_KEY,
  client_email: process.env.FIRESTORE_CRED_CLIENT_EMAIL,
  client_id: process.env.FIRESTORE_CRED_CLIENT_ID,
  auth_uri: process.env.FIRESTORE_CRED_AUTH_URI,
  token_uri: process.env.FIRESTORE_CRED_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIRESTORE_CRED_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIRESTORE_CRED_CLIENT_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any), //Autentifico con mi key "serviceAccount"
  databaseURL: process.env.FIRESTORE_DB_URL, //Direccion de mi Proyecto "apx-dwf-m6"
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
