const userModel = require('../models/users');
const authModel = require('../models/auth');
const { response } = require('../helpers/response');
const path = require('path');

exports.createUser = async (req, res) => {
  const data = req.body;
  data.role = 'jamaah';
  const str = data.departure;
  const dataOutDate = data.outDate;
  const dataUntilDate = data.untilDate;
  data.pictures = path.join(process.env.APP_UPLOAD_ROUTE, req.file.filename);
  try {
    const [day, month, year] = str.split('/');
    const [outDay, outMonth, outYear] = dataOutDate.split('/');
    const [untilDay, untilMonth, untilYear] = dataUntilDate.split('/');
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
    console.log("DATE Depart: ", dateDeparture);
    console.log("DATE OUT: ", dateOut);
    console.log("DATE Until: ", dateUntil);
    const checkNumberVisa = await authModel.getUserByVisaNumber([data.numberVisa]);
    console.log(checkNumberVisa)
    if (checkNumberVisa.rowCount > 0) {
      return response(res, 401, "Sorry visa number already exist!")
    }
    await userModel.createUser([data.numberVisa, data.role, data.packageName, data.fullname, data.stayDuration, data.pasporNumber, data.nationality, dateDeparture, data.visaType, dateOut, dateUntil, data.linkGrup, data.idCategory, data.groupName, data.pictures]);
    return response(res, 200, 'Create user has been successfully!', data);
  } catch (error) {
    return response(res, 500, "An error occured!", error);
  }
  // if (data.numberVisa) {
  //   // data.numberVisa = await argon.hash(data.numberVisa);
  //   data.role = 'jamaah';
  //   await authModel.createUser([data.numberVisa, data.role]);
  //   return response(res, 200, 'Create user has been successfully!', data);
  // } else {
  //   return response(res, 401, 'Sorry visa number is not valid!');
  // }
};

exports.selectUserByDateDeparture = async (req, res) => {
  const { dateDeparture } = req.body;
  const [year, month, day] = dateDeparture.split('/');
  const data = new Date(
    +year,
    +month - 1,
    +day,
  ).toLocaleDateString();
  try {
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
        return response(res, 200, 'Get data successfully!', totalUser.rows);
      }
      else {
        return response(res, 400, 'Cannot get data!', err);
      }
    })
  } catch (error) {
    return response(res, 500, 'An error occured!', error);
  }
}
