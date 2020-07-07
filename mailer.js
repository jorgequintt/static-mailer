const sgMail = require('@sendgrid/mail');

// functions 
function capitalize(string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}

function replaceVariablesOnTemplate(html, form, lang) {
   let _value_not_set = ({
      "en": "Value not set",
      "es": "Valor no ingresado"
   })[lang];
   let parsedHtml = "";
   parsedHtml = html.replace(/%[\w-_]+%/g, (occ) => {
      const _occ = occ.replace(/^%|%$/g, '');
      return form[_occ] || `[${_value_not_set}]`;
   });
   return parsedHtml;
}

// mailer
function mailer(template, form) {
   return new Promise((resolve, reject) => {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const lang = template.lang;

      let _fromText = ({
         "en": "Message from",
         "es": "Mensaje de"
      })[lang];
      let _msgTitle = ({
         "en": [
            "Sent through the form",
            "in"
         ],
         "es": [
            "Enviado a traves del formulario de",
            "en"
         ]
      })[lang];

      const msg = {
         to: template.clientEmail,
         from: {
            name: form.name,
            email: `${template.type}@${template.clientHostname}`
         },
         replyTo: form.email,
         subject: `${capitalize(template.clientHostname)}: ${_fromText} ${form.name}`,
         html: `<h3>${_msgTitle[0]} ${capitalize(template.type)} ${_msgTitle[1]} ${capitalize(template.clientHostname)}</h3>${replaceVariablesOnTemplate(template.html, form, lang)}`,
      };

      // send the mail and we check if success
      sgMail.send(msg)
         .then(() => {
            resolve([200, ""]);
         })
         .catch((error) => {
            resolve([500, error.toString()]);
         });
   });
}

module.exports = mailer;