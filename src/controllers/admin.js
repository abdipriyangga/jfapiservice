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
  try {
    // init document
    let doc = new PDFDocument({ margin: 10, size: 'A4', bufferPages: true });
    const { dateDeparture } = req.body;
    const [month, day, year] = dateDeparture.split('/');
    const data = new Date(
      +year,
      +month - 1,
      +day,
    ).toLocaleDateString();
    let date = new Date(dateDeparture).toLocaleDateString("en-GB", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    // save document
    let name = `DATA JAMAAH`;
    const saveOut = path.resolve(path.join(process.cwd(), 'public', 'documents'));

    await userModel.getUserByDeparture([data], async (err, dataUser, _fields) => {
      if (!err) {
        ; (async function () {
          // table 
          const table = {
            title: { label: `DATA JAMAAH KEBERANGKATAN ${dateDeparture}`, fontSize: 10 },
            headers: [
              { label: "No", align: "center", headerColor: "#DCAF34", headerOpacity: 1, property: "no" },
              { label: "Nama Lengkap", align: "center", headerColor: "#DCAF34", headerOpacity: 1, property: "fullname" },
              { label: "Paket", align: "center", headerColor: "#DCAF34", headerOpacity: 1, property: "package_name" },
              { label: "No Paspor", align: "center", headerColor: "#DCAF34", headerOpacity: 1, property: "passpor_number" },
              { label: "Nomor HP", align: "center", headerColor: "#DCAF34", headerOpacity: 1, property: "phone_number" },
              { label: "Jenis Kelamin", align: "center", headerColor: "#DCAF34", headerOpacity: 1, property: "gender" },
              { label: "Email", align: "center", headerColor: "#DCAF34", headerOpacity: 1, property: "email" }],
            datas: dataUser.rows.map((x, idx) => {
              return {
                no: idx + 1,
                fullname: x.fullname,
                package_name: x.package_name,
                passpor_number: x.passpor_number,
                phone_number: x.phone_number,
                gender: x.gender,
                email: x.email
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
              indexColumn === 0 && doc.addBackground(rectRow, 'white', 0.10);
            },
          });
        })();
        let nameFile = `${name} - ${date}.pdf`;
        res.setHeader('Access-Control-Expose-Headers', "Content-Disposition");
        res.setHeader('Content-Disposition', `attachment; filename=${nameFile}`);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(fs.createWriteStream(`${saveOut}/${nameFile}`));
        await doc.pipe(res);
        doc.end();
      }
      else {
        return response(res, 400, 'Cannot get data!', err);
      }
    })
  } catch (error) {
    console.error(error)
    return response(res, 500, 'An error occured!', error);
  }

}

exports.downloadFile = async (req, res) => {
  const { dateDeparture } = req.body;
  const [month, day, year] = dateDeparture.split('/');
  const data = new Date(
    +year,
    +month - 1,
    +day,
  ).toLocaleDateString();
  let date = new Date(dateDeparture).toLocaleDateString("en-GB", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const workbook = new excelJS.Workbook();  // Create a new workbook
  const worksheet = workbook.addWorksheet(`Data Group Keberangkatan ${date}`, { properties: { tabColor: { argb: 'FF00FF00' } }, headerFooter: { firstHeader: "Detail Data Group", firstFooter: "Hello" } }); // New Worksheet
  let name = 'Data Jamaah';
  await userModel.getUserByDeparture([data], async (err, results, _fields) => {
    if (!err) {
      // Column for data in excel. key must match data key
      worksheet.headerFooter = { firstFooter: "Hello" }
      worksheet.columns = [
        { header: "No", key: "s_no", width: 23, style: { alignment: { horizontal: 'center' } } },
        { header: "Nama Lengkap", key: "fullname", width: 23, style: { alignment: { horizontal: 'center' } } },
        { header: "Paket", key: "package_name", width: 23, style: { alignment: { horizontal: 'center' } } },
        { header: "No Paspor", key: "passpor_number", width: 23, style: { alignment: { horizontal: 'center' } } },
        { header: "Nomor HP", key: "phone_number", width: 23, style: { alignment: { horizontal: 'center' } } },
        { header: "Jenis Kelamin", key: "gender", width: 23, style: { alignment: { horizontal: 'center' } } },
        { header: "Email", key: "email", width: 23, style: { alignment: { horizontal: 'center' } } },
      ];
      // Looping through User data
      let counter = 1;
      results.rows.map((x) => {
        x.s_no = counter;
        worksheet.addRow(x); // Add data in worksheet
        counter++;
      });
      // Making first line in excel bold
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });
      let nameFile = `${name} - ${date}.xlsx`;
      res.setHeader('Access-Control-Expose-Headers', "Content-Disposition");
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=` + nameFile);
      await workbook.xlsx.write(res);
      res.end();
    } else {
      return response(res, 400, 'Cannot get data!', err);
    }
  })

}
