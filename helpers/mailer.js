const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_KEY,
  },
  tls: {
    rejectUnauthorized: false,
  },
});



exports.sendEmail = async function ({ toUser, type, data, qrCodePath }) {
  var subject, message;

  switch (type) {
    case 1:
      subject = "Hesap Oluşturma";
      message = `Hasan Ali Yücel Kültür Merkezine kaydolduğunuz için teşekkür ederiz. Hesabınız için kullanılacak olan QR kod ektedir. Bu kodu kimseyle paylaşmayınız. <br>
      Hasan Ali Yücel Kültür Merkezine kaydolmadıysanız lütfen bu e-postayı dikkate almayın.`;
      break;
    
    default:
      subject = "";
      message = "";
  }

  var template = '';

  if (data) {
    template += ``;
  }


  const mailOptions = {
    from: {
      name: 'Hasan Ali Yücel Kültür Merkezi',
      address: process.env.GMAIL_ACCOUNT
    },
    to: toUser,
    subject: subject,
    attachments: [
      {
        filename: 'qrcode.png',
        path: qrCodePath,
        cid: 'qrCode' // Content-ID for inline images
      }
    ],
    text: "Bu e-posta Hasan Ali Yücel Kültür Merkezi tarafından gönderilmiştir.",
    html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Hasan Ali Yücel Kültür Merkezi</title>
            <style>
              * {
                margin:0;
                padding:0;
              }

              * { font-family: Verdana, Geneva, Tahoma, sans-serif }

              img {
                max-width: 100%;
              }

              .collapse {
                margin:0;
                padding:0;
              }

              body {
                -webkit-font-smoothing:antialiased;
                -webkit-text-size-adjust:none;
                width: 100%!important;
                height: 100%;
              }

              a { color: #23c9cf; text-decoration: none;}

              .code {
                color: #FFF;
                background-color: #23c9cf;
                padding:10px 16px;
                font-weight:bold;
                text-align:center;
                font-size: 20px;
              }

              table.social {
                background-color: #F2F2F5;
              }

              .social .soc-btn {
                padding: 3px 7px;
                font-size:12px;
                margin-bottom:10px;
                text-decoration:none;
                color: #FFF;font-weight:bold;
                display:block;
                text-align:center;
                background-color: #6440FE;
              }

              table.head-wrap { width: 100%;}

              .header.container table td.logo { padding: 15px; }
              .header.container table td.label { padding: 15px; padding-left:0px;}

              table.body-wrap { width: 100%;}

              table.footer-wrap { width: 100%;	clear:both!important; }

              h1,h2,h3,h4,h5,h6 {
                line-height: 1.1; margin-bottom:15px; color:#000;
              }
              h1 small, h2 small, h3 small, h4 small, h5 small, h6 small { font-size: 60%; color: #6f6f6f; line-height: 0; text-transform: none; }

              h1 { font-weight:200; font-size: 44px;}
              h2 { font-weight:200; font-size: 37px;}
              h3 { font-weight:500; font-size: 27px;}
              h4 { font-weight:500; font-size: 23px;}
              h5 { font-weight:600; font-size: 15px;}
              h6 { font-weight:900; font-size: 14px; text-transform: uppercase; color:#444;}

              .collapse { margin:0!important;}

              p, ul {
                margin-bottom: 10px;
                font-weight: normal;
                font-size:14px;
                line-height:1.6;
              }
              p.lead { font-size:17px; }
              p.last { margin-bottom:0px;}

              ul li {
                margin-left:5px;
                list-style-position: inside;
              }

              .container {
                display:block!important;
                max-width:600px!important;
                margin:0 auto!important;
                clear:both!important;
              }

              .content {
                padding:15px;
                max-width:600px;
                margin:0 auto;
                display:block;
              }

              .content table { width: 100%; }

              .column {
                width: 300px;
                float:left;
              }
              .column tr td { padding: 15px; }
              .column-wrap {
                padding:0!important;
                margin:0 auto;
                max-width:600px!important;
              }
              .column table { width:100%;}
              .social .column {
                width: 280px;
                min-width: 279px;
                float:left;
              }

              .info {
                font-size: 11px;
              }

              .clear { display: block; clear: both; }

              .buttons {
                display: flex;
                align-items: center;
                width: 100%;
              }

              .download_btn {
                color: #FFF;
                background-color: #23c9cf;
                padding: 10px 16px;
                font-weight: bold;
                text-align: center;
                border: none;
                border-radius: 32px;
                margin-right: 10px;
                margin-top: 10px;
                width: 100%;
              }

              @media only screen and (max-width: 600px) {
                a[class="btn"] { display:block!important; margin-bottom:10px!important; background-image:none!important; margin-right:0!important;}
                div[class="column"] { width: auto!important; float:none!important;}
                table.social div[class="column"] {
                  width:auto!important;
                }
              }
            </style>
          </head>
          <body bgcolor="#FFFFFF">
            <table class="head-wrap" bgcolor="#F2F2F5">
              <tr>
              <td></td>
              <td class="header container">
                <div class="content">
                  <table>
                    <tr>
                      <td align="right"><h6 class="collapse">Hasan Ali Yücel Kültür Merkezi</h6></td>
                    </tr>
                  </table>
                </div>
              </td>
              <td></td>
              </tr>
            </table>
            <table class="body-wrap">
              <tr>
              <td></td>
              <td class="container" bgcolor="#FFFFFF">
                <div class="content">
                <table>
                <tr>
                  <td>
                  <br/>
                  <h3>Merhaba</h3>
                  <p class="lead">${message}</p>
                  <br/>
                  ${template}
                  <br/>
                  <br/>
                  <br/>
                  <table class="column social">
                      <tr>
                      <td>
                      <p class="info">
                          Bu e-postada ifade edilen görüş ve görüşler yalnızca yazara aittir ve Hasan Ali Yücel Kültür Merkezi'nin resmi politikasını veya konumunu yansıtmayabilir.
                          Bu e-posta ve ekleri yalnızca bilgilendirme amaçlıdır ve hukuki, mali veya başka türde profesyonel tavsiye olarak yorumlanmamalıdır.
                          Bu e-postanın alıcısı, burada yer alan bilgilerin doğrulanmasından yalnızca sorumludur.
                          Hasan Ali Yücel Kültür Merkezi, bu e-posta yoluyla iletilen herhangi bir virüsün neden olduğu herhangi bir hasardan veya bu e-postanın veya eklerinin içeriğindeki herhangi bir hata veya eksiklikten dolayı hiçbir sorumluluk kabul etmez.
                      </p>
                      </td>
                      </tr>
                  </table>
                  <span class="clear"></span>
                  </td>
                </tr>
                </table>
                </div>
              </td>
              <td></td>
              </tr>
            </table>
            <table class="footer-wrap">
              <tr>
              <td></td>
              <td class="container">
                <div class="content">
                <table>
                  <tr>
                  <td align="center">
                    <p>Hasan Ali Yücel Kültür Merkezi</p>
                  </td>
                  </tr>
                </table>
                </div>
              </td>
              <td></td>
              </tr>
            </table>
          </body>
          </html>
          `,
  };

  return new Promise((res, rej) => {
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) rej(err);
      else res(info);
    });
  });
};
