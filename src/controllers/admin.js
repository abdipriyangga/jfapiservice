const adminModel = require('../models/admin');
const userModel = require('../models/users');
const { response } = require('../helpers/response');
const path = require('path');
const argon2 = require('argon2');
const { APP_SECRET_KEY } = process.env;
const jwt = require('jsonwebtoken');
const fs = require("fs");
const PDFDocument = require("pdfkit-table");

exports.createUser = async (req, res) => {
  const data = req.body;
  try {
    data.pictures = path.join(process.env.APP_UPLOAD_ROUTE, req.file.filename);
    const password = data.password;
    const hash = await argon2.hash(password);
    await adminModel.createUser([data.fullname, data.role, data.pictures, hash]);
    return response(res, 200, 'Create user has been successfully!', data);
  } catch (error) {
    return response(res, 500, "An error occured!", error);
  }
};


exports.login = async (req, res) => {
  const data = req.body;
  console.log("DATA: ", data)
  const checkProfile = await adminModel.getUserProfile([data.fullname]);
  console.log("CEK: ", checkProfile.rows[0]);
  if (checkProfile.rowCount < 1) {
    return response(res, 404, "user not found!")
  } else {
    const hashPassword = checkProfile.rows[0].password;
    const compare = await argon2.verify(hashPassword, data.password);
    console.log("Compare: ", compare);
    if (compare) {
      const role = checkProfile.rows[0].role;
      const token = jwt.sign({ id: checkProfile.rows[0].id, fullname: checkProfile.rows[0].fullname, role: checkProfile.rows[0].role }, APP_SECRET_KEY, { expiresIn: '12h' });
      return response(res, 200, 'Login Admin Success!', { token, role });
    } else {
      return response(res, 401, 'Wrong email or password!');
    }
  }
  // try {

  // } catch (error) {
  //   console.log("why error: ", error);
  // }
};

exports.downloadPdf = async (req, res) => {
  // init document
  let doc = new PDFDocument({ margin: 10, size: 'A4' });
  // save document
  const time = new Date()
  let name = 'document' + '-' + time.getTime();
  const save = path.join(process.cwd(), "public", "documents");
  console.log(process.cwd())
  doc.pipe(fs.createWriteStream(`${save}/${name}.pdf`));
  const { dateDeparture } = req.body;
  const [month, day, year] = dateDeparture.split('/');
  const data = new Date(
    +year,
    +month - 1,
    +day,
  ).toLocaleDateString();
  console.log("DATA DATE: ", data);
  const getData = await userModel.getUserByDeparture([data], (err, dataUser, _fields) => {
    if (!err) {
      ; (async function () {
        // table 
        const data = dataUser.rows.map((x) => {
          return {
            name: x.fullname,
            paket: x.package_name,
            visaNumber: x.number_visa,
            outDate: x.out_date,
            validDate: x.until_date,
            stayDuration: x.stay_duration,
            visaType: x.visa_type,
            pasporNumber: x.paspor_number,
            nationality: x.nationality
          }
        })
        console.log("DATTA: ", data)
        const table = {
          title: { label: `DATA JAMAAH TANGGAL: ${dateDeparture}`, fontSize: 8 },
          headers: [
            { label: "Nama Lengkap", align: "center", headerColor: "#DCAF34", headerOpacity: 1, property: "name" },
            { label: "Paket", align: "center", headerColor: "#DCAF34", headerOpacity: 1, property: "paket" },
            { label: "Nomor Visa", align: "center", headerColor: "#DCAF34", headerOpacity: 1, property: "nomorVisa" },
            { label: "Tanggal Dikeluarkan", align: "center", headerColor: "#DCAF34", headerOpacity: 1, property: "outDate" },
            { label: "Berlaku Sampai", align: "center", headerColor: "#DCAF34", headerOpacity: 1, property: "validDate" },
            { label: "Durasi Tinggal", align: "center", headerColor: "#DCAF34", headerOpacity: 1, property: "stayDuration" },
            { label: "Tipe Visa", align: "center", headerColor: "#DCAF34", headerOpacity: 1, property: "visaType" },
            { label: "Nomor Paspor", align: "center", headerColor: "#DCAF34", headerOpacity: 1, property: "pasporNumber" },
            { label: "Negara", align: "center", headerColor: "#DCAF34", headerOpacity: 1, property: "nationality" }],
          datas: dataUser.rows.map((x) => {
            console.log(x)
            return {
              name: x.fullname,
              paket: x.package_name,
              nomorVisa: x.number_visa,
              outDate: x.out_date,
              validDate: x.until_date,
              stayDuration: x.stay_duration,
              visaType: x.visa_type,
              pasporNumber: x.paspor_number,
              nationality: x.nationality
            }
          })
        };
        // A4 595.28 x 841.89 (portrait) (about width sizes)
        await doc.table(table, {
          prepareHeader: () => {
            doc.font("Helvetica-Bold").fontSize(6)
          },
          prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
            doc.font("Helvetica").fontSize(8);
            indexColumn === 0 && doc.addBackground(rectRow, 'blue', 0.10);
          },
        });
        // done!
        doc.end();
      })();
      return response(res, 200, 'Get data successfully!', dataUser.rows);
    }
    else {
      return response(res, 400, 'Cannot get data!', err);
    }
  })
  console.log("getDAta: ", getData);


}