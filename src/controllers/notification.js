const notif = {};
const admin = require('firebase-admin');
const key = require('../../private/jf-service-ede3e-firebase-adminsdk-aqxc6-b625e9d7cc.json')
admin.initializeApp({
  credential: admin.credential.cert(key),
})

const Messaging = admin.messaging();

exports.notification = async (req, res) => {
  try {
    const { body } = req;
    await Messaging.send({
      topic: body.topic,
      notification: {
        title: body.title,
        body: body.message,
      },
    });
    return res.status(200).json({
      pesan: "notification sent",
    });
  } catch (error) {
    return res.status(500).json({
      pesan: "internal server error firebase",
      error,
    });
  }
};