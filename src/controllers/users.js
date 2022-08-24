const userModel = require('../models/users');
const authModel = require('../models/auth');
const { response } = require('../helpers/response');
const jwt = require('jsonwebtoken');
const path = require('path');
const admin = require('firebase-admin');
const key = require('../../private/jf-service-ede3e-firebase-adminsdk-aqxc6-b625e9d7cc.json')
admin.initializeApp({
  credential: admin.credential.cert(key),
})

const Messaging = admin.messaging();


exports.createUser = async (req, res) => {
  const data = req.body;
  const str = data.departure;
  const dataOutDate = data.outDate;
  const dataUntilDate = data.untilDate;
  try {
    const groupName = data.groupName.replace(/\s/g, '');
    const [month, day, year] = str.split('/');
    const [outMonth, outDay, outYear] = dataOutDate.split('/');
    const [untilMonth, untilDay, untilYear] = dataUntilDate.split('/');
    const dateDeparture = new Date(
      +year,
      +month - 1,
      +day,
    ).toLocaleDateString();
    const dateOut = new Date(
      +outYear,
      +outMonth - 1,
      +outDay,
    ).toLocaleDateString();
    const dateUntil = new Date(
      +untilYear,
      +untilMonth - 1,
      +untilDay,
    ).toLocaleDateString();
    data.pictures = path.join(process.env.APP_UPLOAD_ROUTE, req.file.filename);
    const checkNumberVisa = await authModel.getUserByVisaNumber([data.numberVisa]);
    console.log("GROUP NAME: ", groupName);
    if (checkNumberVisa.rowCount > 0) {
      return response(res, 401, "Sorry visa number already exist!")
    }
    await userModel.createUser([data.numberVisa, data.role, data.packageName, data.fullname, data.stayDuration, data.pasporNumber, data.nationality, dateDeparture, data.visaType, dateOut, dateUntil, data.linkGrup, data.idCategory, groupName, data.pictures, data.hotel_mekkah, data.hotel_madinah]);
    return response(res, 200, 'Create user has been successfully!', data);

  } catch (error) {
    return response(res, 500, "An error occured!", error);
  }
};

exports.selectUserByDateDeparture = async (req, res) => {
  const { dateDeparture } = req.body;
  try {
    const [month, day, year] = dateDeparture.split('/');
    const data = new Date(
      +year,
      +month - 1,
      +day,
    ).toLocaleDateString();
    console.log("DATA DATE: ", data);
    await userModel.getUserByDeparture([data], (err, dataUser, _fields) => {
      if (!err) {
        return response(res, 200, 'Get data successfully!', dataUser.rows);
      }
      else {
        return response(res, 400, 'Cannot get data!', err);
      }
    })
  } catch (error) {
    return response(res, 500, 'An error occured!', error);
  }
}

exports.countUserByDateDeparture = async (req, res) => {
  try {
    await userModel.countUserByDeparture((err, totalUser, _fields) => {
      if (!err) {
        const total = totalUser.rows;
        return response(res, 200, 'Get data successfully!', total);
      }
      else {
        return response(res, 400, 'Cannot get data!', err);
      }
    })
  } catch (error) {
    return response(res, 500, 'An error occured!', error);
  }
}
exports.getProfile = async (req, res) => {
  try {
    await userModel.getUserProfile([req.authUser.id], (err, results, _fields) => {
      if (!err) {
        const data = results.rows[0];
        if (data.picture !== null && !data.picture.startsWith('http')) {
          data.picture = `${process.env.APP_URL_ONLINE}${data.picture}`;
        }
        return response(res, 200, 'Get data successfully!', data);
      }
      else {
        return response(res, 400, 'Cannot get data!', err);
      }
    })
  } catch (error) {
    return response(res, 500, 'An error occured!', error);
  }
}

exports.addMemo = async (req, res) => {
  const data = req.body;
  const role = req.authUser.role;
  const topic = req.authUser.group_name;
  console.log("AUTHUSER: ", req.authUser);
  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  console.log(capitalize(role));
  try {
    await userModel.addMemo([data.memoMessage, role], (err, results, _fields) => {
      if (!err) {
        if (!err) {
          Messaging.send({
            topic: topic,
            notification: {
              title: capitalize(role),
              body: data.memoMessage,
            },
          });
          console.log("Notification Sent!");
        } else {
          return response(res, 400, 'Sorry notification cant sent!');
        }
        console.log("DATA: ", results);
        return response(res, 200, 'Create user has been successfully!', data);
      } else {
        return response(res, 400, "Sorry cannot create data!", err);
      }
    });
  } catch (error) {
    console.error("ERROR: ", error)
    return response(res, 500, "An error occured!", error);
  }
};

exports.getMemo = async (req, res) => {
  try {
    await userModel.getMemo((err, results, _fields) => {
      if (!err) {
        const data = results.rows;
        return response(res, 200, 'Get data successfully!', data);
      }
      else {
        return response(res, 400, 'Cannot get data!', err);
      }
    })
  } catch (error) {
    return response(res, 500, 'An error occured!', error);
  }
}

exports.logout = async (req, res) => {
  try {
    console.log("AUTHUSER: ", req.authUser);
    if (req.headers.authorization) {
      delete token;
      const token = req.headers["authorization"];
      console.log("TOKEN: ", token)
      return response(res, 200, 'Logout succesfully!');
    }
    else {
      return response(res, 400, 'Sorry cannot logout!');
    }

  } catch (error) {
    return response(res, 500, 'An error occured!', error);
  }
}