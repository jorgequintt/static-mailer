const express = require("express");
const app = express();
const wakeUpDyno = require("./wakeUpDyno");

// Settings
app.set("port", process.env.PORT || 5000);
app.set("json spaces", 2);

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

// routes
app.use("/api/form/", require("./routes"));

app.listen(app.get("port"), () => {
   console.log("Server started");
   // wakeUpDyno("https://floating-forest-99048.herokuapp.com/");
})