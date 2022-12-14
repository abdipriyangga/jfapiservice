const userModel = require('../models/users');
const authModel = require('../models/auth');
const { response } = require('../helpers/response');
const jwt = require('jsonwebtoken');
const path = require('path');
const admin = require('firebase-admin');
const key = require('../../private/jf-service-7a84a-firebase-adminsdk-ofi39-2f9a6caf7d.json')
const keySec = require('../../private/jf-service-7a84a-firebase-adminsdk-ofi39-b1bae45a5a.json');
const fetch = (url) => import('node-fetch').then(({ default: fetch }) => fetch(url));
const { BASE_URL_LOCAL } = process.env


admin.initializeApp({
  credential: admin.credential.cert(keySec),
})

const Messaging = admin.messaging();


exports.createUser = async (req, res) => {
  const data = req.body;
  const str = data.departure;
  try {
    const groupName = data.groupName.replace(/\s/g, '_');
    const [month, day, year] = str.split('/');
    const dateDeparture = new Date(
      +year,
      +month - 1,
      +day,
    ).toLocaleDateString();

    data.pictures = path.join(process.env.APP_UPLOAD_ROUTE, req.file.filename);
    const checkNumberPasspor = await authModel.getUserByPassporNumber([data.pasporNumber]);

    if (checkNumberPasspor.rowCount > 0) {
      return response(res, 401, "Sorry your passport number already exist!")
    } else {
      await userModel.createUser([dateDeparture, data.pasporNumber, data.nationality, data.role, groupName, data.linkGrup, data.idCategory, data.pictures, data.hotel_mekkah, data.hotel_madinah, data.phone_number, data.packageName, data.fullname, data.email, data.gender]);
      return response(res, 200, 'Create user has been successfully!', data);
    }
  } catch (error) {
    console.error(error)
    if (error.code === '23505') {
      return response(res, 400, "Sorry fullname already exist!");
    }
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
          data.picture = `${data.picture}`;
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
  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
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
        return response(res, 200, 'Create memo has been successfully!', data);
      } else {
        return response(res, 400, "Sorry cannot create data!", err);
      }
    });
  } catch (error) {
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
    console.log("ada: ", req.headers.authorization)
    if (req.headers.authorization) {
      await userModel.logoutUsers(['false', req.authUser.id], (err, results, _fields) => {
        console.log(results)
        if (!err) {
          return response(res, 200, 'Logout succesfully!');
        } else {
          return response(res, 400, 'Sorry logout failed!');
        }
      })
    }
    else {
      return response(res, 400, 'Sorry cannot logout!');
    }

  } catch (error) {
    console.error(error)
    return response(res, 500, 'An error occured!', error);
  }
}

exports.deleteByDeparture = async (req, res) => {
  const data = req.body;
  try {
    await userModel.deleteByDeparture([data.dateDeparture], (err, results) => {
      if (!err) {
        return response(res, 200, 'Delete data succesfully!', results);
      } else {
        return response(res, 400, 'Delete data not succesfully!');
      }
    });
  } catch (error) {
    return response(res, 500, 'An error occured!');
  }
}

exports.getDataDepartureFromApiMarkeplace = async (req, res) => {
  try {
    const callData = await fetch(`${BASE_URL_LOCAL}/adm-ticketing/allDepartureDate`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    const result = await callData.json();
    return response(res, 200, "Get data success!", result);
  } catch (error) {
    return response(res, 500, 'An error occured!', error);
  }
}