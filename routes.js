const { Router } = require("express");
const router = Router();
const mailer = require("./mailer");
const validator = require('email-validator');

// Abuse blocker
const dnsbl = require('dnsbl');
const dns_blacklists = ["dnsbl.dronebl.org", "rbl.efnet.org"];

// Data
const hosts_templates = require('./hosts_templates');

router.post('/:type', async (req, res) => {
   const remote_ip = req.connection.remoteAddress;

   // check if ip is trusted
   const listed_obj = await dnsbl.batch(remote_ip, dns_blacklists, { timeout: 5000 });
   let bl_count = 0;
   for (let i = 0; i < listed_obj.length; i++) {
      const bl = listed_obj[i];
      bl.listed && bl_count++;
   }
   
   // if not, we stop
   if (bl_count >= 1) {
      res.status(400).json({ msg: "COULD_NOT_SEND" });
      return;
   }
   
   const type = req.params["type"];
   const host = req.get("origin");
   // console.log(host);

   if ((host in hosts_templates) && (type in hosts_templates[host])) {
      const formData = req.body;
      
      // if some of these fields is missing, we abort the process
      const is_email = !!formData.email && validator.validate(formData.email);
      if(!is_email){
         res.status(400).json({ msg: "INVALID_EMAIL" });
         return;
      }
      if (!formData.name || !formData.message) {
         res.status(400).json({ msg: "INCOMPLETE_FORM" });
         return;
      }

      const template = hosts_templates[host][type];
      const status = await mailer(template, formData);
      switch (status[0]) {
         case 200: res.status(200).json({ msg: "SUCCESS" }); break;
         case 500: res.status(400).json({ msg: "COULD_NOT_SEND" }); break;
      }
   } else {
      res.status(500).send("");
   }
});

module.exports = router;