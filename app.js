let express = require("express")
let app = express();
let bodyparser = require("body-parser");
let mongoose = require("mongoose")


mongoose.connect('mongodb://localhost:27017/user', { useNewUrlParser: true });
/*// mongoose.connect("mongodb+srv://wulforr:wulfor8397@cluster0-rpwjk.mongodb.net/test?retryWrites=true&w=majority" ,{useNewUrlParser: true, useCreateIndex: true})
// .then(()=>{
//     console.log("connected to db");
// })
// .catch((err)=>{
//     console.log("error:",err);
// })
*/
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("public"));



let userSchema = new mongoose.Schema({
    name: String,
})

let product = mongoose.model("User",userSchema);



// app.use((res) => {
//     res.status(200).json({
//         message:"hi well done"
//     })
// })

app.post("/name" ,(req,res) => {
    let prodname = req.query.name
    product.create({
        "name" : prodname
    },function(err,respon){
        if (err)
        console.log(err)
        else
        res.send("created")
    })
})

app.get("/",(req,res) => {
    res.send("Not a valid path");
})

// eslint-disable-next-line no-console
app.listen(process.env.PORT || 3000 , () => console.log("server started"));