const adminModel = require('../models/admin');
const userModel = require('../models/users');
const { response } = require('../helpers/response');
const path = require('path');
const argon2 = require('argon2');
const { APP_SECRET_KEY } = process.env;
const jwt = require('jsonwebtoken');
const fs = require("fs");
const PDFDocument = require("pdfkit-table");
const excelJS = require("exceljs");

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
  try {
    const checkProfile = await adminModel.getUserProfile([data.fullname]);
    if (checkProfile.rowCount < 1) {
      return response(res, 404, "user not found!")
    } else {
      const hashPassword = checkProfile.rows[0].password;
      const compare = await argon2.verify(hashPassword, data.password);
      if (compare) {
        const role = checkProfile.rows[0].role;
        const token = jwt.sign({ id: checkProfile.rows[0].id, fullname: checkProfile.rows[0].fullname, role: checkProfile.rows[0].role }, APP_SECRET_KEY, { expiresIn: '12h' });
        return response(res, 200, 'Login Admin Success!', { token, role });
      } else {
        return response(res, 401, 'Wrong email or password!');
      }
    }
  } catch (error) {
    return response(res, 500, 'An error occured!');
  }
};

exports.downloadPdf = async (req, res) => {
  // init document
  let doc = new PDFDocument({ margin: 10, size: 'A4', bufferPages: true });
  const { dateDeparture } = req.body;
  const [month, day, year] = dateDeparture.split('/');
  const data = new Date(
    +year,
    +month - 1,
    +day,
  ).toLocaleDateString();
  // save document
  const time = new Date();
  let name = 'document' + '-' + time.getTime();
  // process.chdir('../../');
  const saveOut = path.resolve(path.join(process.cwd(), 'public', 'documents'));
  doc.pipe(fs.createWriteStream(`${saveOut}/${name}`));
  await userModel.getUserByDeparture([data], (err, dataUser, _fields) => {
    if (!err) {
      ; (async function () {
        // table 
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
      })();
      // let file = fs.createReadStream(`${saveOut}/${name}`);
      // let stat = fs.statSync(`${saveOut}/${name}`);
      // res.setHeader('Content-Length', stat.size);
      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader('Content-Disposition', `attachment; filename=dataJamaah.pdf`);
      // file.pipe(res)
      doc.end();
      return response(res, 200, 'Get data successfully!', dataUser.rows);
    }
    else {
      return response(res, 400, 'Cannot get data!', err);
    }
  })

}

exports.downloadFile = async (req, res) => {
  const workbook = new excelJS.Workbook();  // Create a new workbook
  const worksheet = workbook.addWorksheet("Data Jamaah", { properties: { tabColor: { argb: 'FF00FF00' } }, headerFooter: { firstHeader: "Data Jamaah", firstFooter: "Hello" } }); // New Worksheet
  const saves = path.join(process.cwd(), 'public', 'documents');  // Path to download excel
  const { dateDeparture } = req.body;
  const [month, day, year] = dateDeparture.split('/');
  const data = new Date(
    +year,
    +month - 1,
    +day,
  ).toLocaleDateString();
  let name = 'DataJamaah';
  const time = new Date();
  await userModel.getUserByDeparture([data], (err, results, _fields) => {
    if (!err) {
      // Column for data in excel. key must match data key
      worksheet.headerFooter = { firstFooter: "Hello" }
      worksheet.columns = [
        { header: "No", key: "s_no", width: 23, style: { alignment: { horizontal: 'center' } } },
        { header: "Nama Lengkap", key: "fullname", width: 23, style: { alignment: { horizontal: 'center' } } },
        { header: "Paket", key: "package_name", width: 23, style: { alignment: { horizontal: 'center' } } },
        { header: "Nomor Visa", key: "number_visa", width: 23, style: { alignment: { horizontal: 'center' } } },
        { header: "Tanggal Dikeluarkan", key: "out_date", width: 23, style: { alignment: { horizontal: 'center' } } },
        { header: "Berlaku Sampai", key: "until_date", width: 23, style: { alignment: { horizontal: 'center' } } },
        { header: "Durasi Tinggal", key: "stay_duration", width: 23, style: { alignment: { horizontal: 'center' } } },
        { header: "Tipe Visa", key: "visa_type", width: 23, style: { alignment: { horizontal: 'center' } } },
        { header: "Nomor Passport", key: "paspor_number", width: 23, style: { alignment: { horizontal: 'center' } } },
        { header: "Negara", key: "nationality", width: 23, style: { alignment: { horizontal: 'center' } } },
      ];
      // Looping through User data
      let counter = 1;
      results.rows.map((x) => {
        x.s_no = counter;
        worksheet.addRow(x); // Add data in worksheet
        counter++;
      });
      console.log(results)
      // Making first line in excel bold
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });
      const data = workbook.xlsx.writeFile(`${saves}/${name}-${time.getTime()}.xlsx`)
      return response(res, 200, 'Get data successfully!', data);
    } else {
      return response(res, 400, 'Cannot get data!', err);
    }
  })

  // try {
  //   const data = await workbook.xlsx.writeFile(`${saves}/users.xlsx`)
  //     .then(() => {
  //       res.send({
  //         status: "success",
  //         message: "file successfully downloaded",
  //         path: `${saves}/users.xlsx`,
  //         results: data
  //       });
  //     });
  // } catch (err) {
  //   res.send({
  //     status: "error",
  //     message: "Something went wrong",
  //   });
  // }
}