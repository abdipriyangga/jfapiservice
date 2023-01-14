const notif = {};
const admin = require('firebase-admin');
const key = require('../../private/jf-service-7a84a-firebase-adminsdk-ofi39-b720bd28d3.json')
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
      message: "notification sent",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};