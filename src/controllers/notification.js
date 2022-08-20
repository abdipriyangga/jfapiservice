const admin = require('firebase-admin');
const key = require('../../private/jf-service-ede3e-firebase-adminsdk-aqxc6-e3deaa059f.json');

admin.initializeApp({
  credential: admin.credential.cert(key),
})

const Messaging = admin.messaging