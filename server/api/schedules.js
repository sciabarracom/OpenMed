const config = require("../config.js")
const mailer = require("nodemailer").createTransport(config.mailer)

function sendmail(dest, subject, html) {
    mailer.sendMail({
      "to": dest,
      "subject": subject,
      "html": html
    }).then(console.log)
    .catch(console.error)
}

let message = `
<h1>Your appointment</h1>

<p>You have a scheduled visit on 15/10/2021 at 10.00</p>

<a href="https://openmed.noiopen.it:4444/app/conference?roomId=theRoom&peerId=patient">Click here to join the call</a>.
`

module.exports = function(app, db) {

    // Get all schedules
    app.get("/api/schedules/", async(req, res) => {
        console.log("get /api/schedules")
        //let out = { "id": "michele", "email": "michele@example.com" }
        let data = await db.collection("schedule").find( {"CF": "TTTTTT61C01W111T" }).toArray()
        res.send(data) 
    })

    // Get a single schedule
    app.get("/api/schedule/:role", async(req, res) => {
        console.log("get /api/schedule", req.params.role)
        //let out = { "id": "michele", "email": "michele@example.com" }
        let role = req.params.role
        let data = await db.collection("anagrafica").find( {"ruolo": role }).toArray()
        res.send(data)
    })


    // Create a new schedule
    app.post("/api/schedule", async(req, res) => {
        console.log("post /api/schedule ", req.body)
        let out = await db.collection("schedule").insertOne(req.body)
        sendmail("michele@sciabarra.com", "Your Medical Visit", message)
        res.send(out)
    })

    // Update a schedule
    app.put("/api/schedule", async(req, res)  => {
        console.log("post /api/schedule ", req.body)
        let out = await db.collection("schedule").insertOne(req.body)
        res.send(out)
    })

    // Delete a schedule
    app.delete("/api/schedule", (req, res) => {   
        let out = {"ok": true, "count": 1}
        res.send(out)
    }) 
}
