const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const cors = require("cors");
var multer = require("multer");
const path = require("path");
// API call required Libraries
const request = require("request");
const fetch = require("node-fetch");
require("dotenv").config();
app.use(cors());
app.options("*", cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
// ++++++++++++++++++++     SAP API Handling   +++++++++++++++++++++++++++++++++++++++++++++
//app.use(express.static(path.join(__dirname, 'build')));

//app.get('/*', function (req, res) {
// res.sendFile(path.join(__dirname, 'build', 'index.html'));
//});
// const both = window.localStorage.getItem("CompanyDB") ? localStorage.getItem("CompanyDB") : null;
// console.log(both)
// const Server = process.env.EEPLSERVER;
const Server = process.env.EEPLLIVESERVER;
const Server2 = process.env.EEPLSERVER2;
const ReportServer = process.env.EEPLREPORTSERVER;
let CompanyDB = process.env.EEPLCOMPANYDBTEST;
const SecondCompanyDB = process.env.EEPLCOMPANYDBTEST;
// let CompanyDB = process.env.EEPLCOMPANYDBLIVE;
// const SecondCompanyDB = process.env.EEPLCOMPANYDBLIVE;
var filePath;
const databaseslist = [
  { CName: "Al Arqab Trading", DName: "AATLIVE" },
  { CName: "Daneen Buksh Foodstuff Trading LLC", DName: "DBLIVE" },
  { CName: "DBTEST", DName: "DBTEST" },
  { CName: "EEPLTESTT", DName: "EEPLTESTT" },
  { CName: "Elite Engineering Live", DName: "EEPLLIVE" },
  { CName: "Ever Fresh Foodstuff Trading", DName: "EFLIVE" },
  { CName: "GO Live", DName: "GOLIVE" },
  { CName: "GO Test", DName: "GOTEST" },
  { CName: "Gulf Riders Delivery Services Co. L.L.C", DName: "GRLIVE" },
  { CName: "Kinan Ocean Foodstuff Company", DName: "KOLIVE" },
];
let sessionid = null;
const port = process.env.PORT;
const mailsender = async (cookie) => {
  console.log("Executing myFunction at");
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log("cookie", cookie);
  let sessionid = `B1SESSION=${cookie};;Secure;SameSite=NoneROUTEID=.node2; path=/;Secure;SameSite=None`;
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let FMonth = month >= 10 ? month : "0" + month;
  let day = new Date().getDate();
  let fday = day >= 10 ? day : "0" + day;
  let data = year + "-" + FMonth;
  let belowdate = year + "-" + FMonth + "-" + fday;
  let SAPapi = `VendorPayments?$filter=CardCode eq 'L20501001' and startswith(DocDate,'${data}') and DocDate eq '${belowdate}'`;
  console.log("API", SAPapi);
  var SapGetApi = Server + SAPapi;
  await fetch(SapGetApi, {
    method: "GET",
    headers: { Cookie: sessionid },
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      if (json.value && json.value.length > 0) {
        console.log("AAAA");
        sendemail();
      } else if (json.value && json.value.length === 0) {
        console.log("BBBB");
      } else if (json.error.code == 301) {
        getsession();
      } else {
        console.log("mail");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

// Call the function immediately
//mailsender();

// Schedule the function to run every 10 minutes (10 * 60 * 1000 milliseconds)
//setInterval(mailsender, 60 * 1000);

const getsession = () => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  var LoginApi = Server + "Login";
  let data = {
    CompanyDB: "EEPLLIVE",
    Password: "S@pee2021",
    UserName: "manager",
  };
  console.log(data);
  // request post request
  request(
    { url: LoginApi, method: "POST", json: data },
    function (err, response) {
      if (err) {
        console.log("it did not work: " + err);
      } else {
        if (response.body.SessionId) {
          console.log("response.body.SessionId", response.body.SessionId);
          mailsender(response.body.SessionId);
        }
      }
    }
  );
};
// ------------------------------ Mail Sender Code ---------------------------------------------------------
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "saqlain.mushtaq@eliteengineering.com.pk",
    pass: "Saq@2022",
  },
});
const sendemail = () => {
  const mailOptions = {
    from: "saqlain.mushtaq@eliteengineering.com.pk",
    to: "saqlain.mushtaq@eliteengineering.com.pk;zeeshan@eepl.com.pk;abbas.alvi@eliteengineering.com.pk",
    subject: "Salary Checker Developed By NITSEL",
    text: `Respected Sir,
             Congratulations , Salary Booked Into SAP. `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      // res.status(500).send('Error sending email');
    } else {
      console.log("Email sent: " + info.response);
      // res.status(200).send('Email sent successfully');
    }
  });
};
app.post("/sendemail", (req, res) => {
  const mailOptions = {
    from: "saqlain.mushtaq@eliteengineering.com.pk",
    to: "saqlain.mushtaq@eliteengineering.com.pk;zeeshan@eepl.com.pk;abbas.alvi@eliteengineering.com.pk",
    subject: "Salary Checker Developed By NITSEL",
    text: `Respected Sir,
             Congratulations , Salary Booked Into SAP. `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Comment", info.response);
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});
// ------------------------------End Mail Sender Code ---------------------------------------------------------

require("tls").DEFAULT_MIN_VERSION = "TLSv1";
app.get("/", async (req, res) => {
  res.json(`AIOT UI Node Server is running at port at ${port}`);
});

app.post("/changecompanydb", async (req, res) => {
  let dbname = req.body.data;
  CompanyDB = dbname;
  console.log(CompanyDB);
});
// -----------------------     Login API       -----------------------
app.post("/Login", async (req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  process.env.UserName = req.body.UserName;
  process.env.Password = req.body.Password;
  var LoginApi = Server + "Login";
  let data = {
    CompanyDB: req.body.companyDB,
    Password: req.body.Password,
    UserName: req.body.UserName,
  };
  console.log("data", data);
  // request post request
  request(
    { url: LoginApi, method: "POST", json: data },
    function (err, response) {
      if (err) {
        console.log("it did not work: " + err);
      }
      cookie = response?.headers["set-cookie"];
      console.log("heres the cookie: " + cookie); //returns cookie in correct format

      res.json(response);
    }
  );
});
// -----------------------     Login SecondDB API       -----------------------
app.post("/SecondDBLogin", async (req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  process.env.UserName = req.body.UserName;
  process.env.Password = req.body.Password;
  var LoginApi = Server + "Login";
  let data = {
    CompanyDB: req.body.companyDB,
    Password: req.body.Password,
    UserName: req.body.UserName,
  };
  console.log("data", data);
  // request post request
  request(
    { url: LoginApi, method: "POST", json: data },
    function (err, response) {
      if (err) {
        console.log("it did not work: " + err);
      }
      console.log(response); //logs as 201 sucess
      secondcookie = response?.headers["set-cookie"];
      console.log("heres the cookie: " + secondcookie); //returns cookie in correct format

      res.json(response);
    }
  );
});
// -----------------------     PreViewLogin API       -----------------------

app.post("/PreviewLogin", async (req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  process.env.UserName = req.body.UserName;
  process.env.Password = req.body.Password;

  var LoginApi = Server2 + "login";
  let data = {
    CompanyDB: req.body.companyDB,
    Password: req.body.Password,
    UserName: req.body.UserName,
  };
  console.log("LoginApi", LoginApi);
  console.log("data", data);
  // request post request
  request(
    { url: LoginApi, method: "POST", json: data },
    function (err, response) {
      if (err) {
        console.log("it did not work: " + err);
      }
      console.log(response?.headers); //logs as 201 sucess
      cookie2 = response.headers["set-cookie"];
      console.log("heres the cookiee: " + cookie2); //returns cookie in correct format

      res.json(response);
    }
  );
});
// -----------------------     Logout API      -----------------------
app.post("/Logout", async (req, res) => {
  var LogoutApi = Server + "Logout";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  await fetch(LogoutApi, { method: "POST" });
  console.log("Logout");
});
// -----------------------     SAP LicenceGet API     -----------------------
app.post("/GetLicenseApi", async (req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log();
  console.log("-------------------    SAP Get API CALL     ------------------");
  var SapGetApi = Server + req.body.api;
  var cookie = req.body.cookie;
  console.log("test", SapGetApi);
  await fetch(SapGetApi, {
    method: "GET",
    headers: { Cookie: cookie },
  })
    .then((res) => res.text()) // expecting a json response
    .then((json) => {
      res.json(json);
    })
    .catch(function (error) {
      console.log("error", error);
    });
});
app.use(express.static(path.join(__dirname, "build")));
// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });
// -----------------------     SAP Get API     -----------------------
app.post("/GetApi", async (req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log();
  console.log("-------------------    SAP Get API CALL     ------------------");
  var SapGetApi = Server + req.body.api;
  var cookie = req.body.cookie;
  await fetch(SapGetApi, {
    method: "GET",
    headers: { Cookie: cookie },
  })
    .then((res) => res.json()) // expecting a json response
    .then((json) => {
      res.json(json);
    })
    .catch(function (error) {
      console.log(error);
      res.json({ error: error });
    });
});
// -----------------------     Passing Values     -----------------------
app.post("/PassValue", async (req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log();
  console.log("-------------------    SAP Get API CALL     ------------------");
  var SapGetApi = Server + req.body.api;
  var cookie = req.body.cookie;
  await fetch(SapGetApi, {
    method: "GET",
    headers: { Cookie: cookie },
  })
    .then((res) => res.json()) // expecting a json response
    .then((json) => {
      res.json(CompanyDB);
    })
    .catch(function (error) {
      console.log(error);
    });
});
// -----------------------     SAP POST API    -----------------------
app.post("/GetCompanyDB", async (req, res) => {
  res.send(CompanyDB);
});
app.post("/GetCompanyDBList", async (req, res) => {
  res.send(databaseslist);
});
// -----------------------     SAP POST API    -----------------------
app.post("/POSTApi", async (req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log("-------------------      SAP POST API CALL  ------------------");
  var SapPOSTApi = Server + req.body.api;
  var cookie = req.body.cookie;
  var postData = req.body.body;
  await fetch(SapPOSTApi, {
    method: "POST",
    headers: { Cookie: cookie },
    body: req.body.body,
  })
    .then((res) => res.json()) // expecting a json response
    .then((json) => {
      res.json(json);
    })
    .catch(function (error) {
      console.log(error);
      res.json({ error: error });
    });
});

// -----------------------     SAP POST SetDafualt Preview API    -----------------------
app.post("/DefaulPreviewApi", async (req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log("-------------------      SAP POST API CALL  ------------------");
  var SapPOSTApi = Server + req.body.api;
  var cookie = req.body.cookie;
  var postData = req.body.body;
  await fetch(SapPOSTApi, {
    method: "POST",
    headers: { Cookie: cookie },
    body: req.body.body,
  })
    .then((res) => res.text()) // expecting a json response
    .then((json) => {
      if (json) {
        res.json(json);
      } else {
        res.json("Updated");
      }
    })
    .catch(function (error) {
      console.log(error);
      res.json({ error: error });
    });
});
// -----------------------     SAP 2nd DB POST API    -----------------------
app.post("/SecondDBPOSTApi", async (req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log();
  console.log(
    "-------------------      SAP 2nd DB POST API CALL  ------------------"
  );
  var SapPOSTApi = Server + req.body.api;
  var seconddbcookie = req.body.cookie;
  var postData = req.body.body;
  await fetch(SapPOSTApi, {
    method: "POST",
    headers: { Cookie: seconddbcookie },
    body: req.body.body,
  })
    .then((res) => res.json()) // expecting a json response
    .then((json) => {
      res.json(json);
    })
    .catch(function (error) {
      console.log(error);
    });
});
// -----------------------     SAP POST Report  API    -----------------------
app.post("/ReportPOSTApi", async (req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log();
  console.log("-------------------      SAP POST API CALL  ------------------");
  var SapPOSTApi = ReportServer + req.body.api;
  var cookiee = req.body.cookie;
  var postData = req.body.body;
  console.log("SapPOSTApi", SapPOSTApi);
  await fetch(SapPOSTApi, {
    method: "POST",
    headers: { Cookie: cookiee },
    body: req.body.body,
  })
    .then((res) => res.text()) // expecting a json response
    .then((json) => {
      console.log(json);
      res.json(json);
    })
    .catch(function (error) {
      console.log(error);
    });
});

// -----------------------     SAP PATCH API    -----------------------
app.post("/PATCHApi", async (req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log();
  console.log(
    "-------------------      SAP PATCH API CALL  ------------------"
  );
  var SapPOSTApi = Server + req.body.api;
  var cookie = req.body.cookie;
  var postData = req.body.body;
  console.log("postData", postData);
  console.log("SapPOSTApi", SapPOSTApi);
  await fetch(SapPOSTApi, {
    method: "PATCH",
    headers: { Cookie: cookie, "B1S-ReplaceCollectionsOnPatch": true },
    body: postData,
  })
    .then((res) => res.text()) // expecting a json response
    .then((json) => {
      console.log(json);
      if (json) {
        res.json("You Are Not Permited To Perform This Action");
      } else {
        res.json("update");
      }
    })
    .catch(function (error) {
      console.log(error);
      res.json({ error: error });
    });
});

// -----------------------     SAP Delete API    -----------------------
app.post("/DeleteApi", async (req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log();
  console.log(
    "-------------------      SAP Delete API CALL  ------------------"
  );
  var SapPOSTApi = Server + req.body.api;
  var cookie = req.body.cookie;
  await fetch(SapPOSTApi, {
    method: "DELETE",
    headers: { Cookie: cookie },
  })
    .then((res) => res.text()) // expecting a json response
    .then((json) => {
      console.log(json);
      res.json(json);
    });
});
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.listen(port, () => {
  console.log(`AIOT UI Node Server is running at port at ${port}`);
});
// -----------------------     SAP Attachments   -----------------------
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "D:Testing");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// var upload = multer({ storage: storage }).array("file");
// app.post("/upload", function (req, res) {
//   console.log(req)
//   upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       return res.status(500).json(err);
//     } else if (err) {
//       return res.status(500).json(err);
//     }
//     return res.status(200).send(req.file);
//   });
// });

// -----------------------     SAP Attachments   -----------------------

var DynamicStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    console.log("44444444444", JSON.parse(req.body.filepath));
    const filedir = JSON.parse(req.body.filepath);
    const dir = await `${filedir}`;
    console.log("3", dir);
    // const dir =  await`${filePath}`;
    cb(null, dir);
    if (dir === "undefined" || dir === "") {
      cb(null, "D:Testing");
    } else {
      cb(null, dir);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: DynamicStorage }).array("file");
app.post("/upload", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    console.log("3", res.status);
    return res.status(200).send(req.file);
  });
});
//...............................Path Posting .......................
app.post("/Path", async function (req, res) {
  filePath = await req.body.Pathname;
  console.log("sffsssfsfs", filePath);
});
