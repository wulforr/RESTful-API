let express = require("express")
let app = express();
let mongoose = require("mongoose")
let morgan = require("morgan")


mongoose.connect('mongodb://localhost:27017/shaurya', { useNewUrlParser: true });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(morgan('dev'))

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type:String, required:true},
    price: {type:Number, required:true}
})

let product = mongoose.model("User",userSchema);


app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers","*")

    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods","POST,GET,PUT,PATCH,DELETE")
        return res.status(200).json({})
    }

    next()
})


//Add a product


app.post("/addprod" ,(req,res) => {
    let prodname = req.body.name
    let price = req.body.price
    product.create({
        "_id" : mongoose.Types.ObjectId(),
        "name" : prodname,
        "price":price
    })
    .then(item => {
        console.log(item)
        res.json({
            _id:item._id,
            name:item.name,
            price:item.price,
            request:{
                method:"GET",
                url: "localhost:3000/prod?name=" + item.name 
            }
        })
    }
    )
    .catch(err => res.json({
         message1:err
     }))
})


// Fetch the productsrs

app.get("/prod",(req,res) => {
    let prodname = req.query.name
    if(prodname == undefined)
    {
        product.find({})
        .select("name price _id")
        .exec()
        .then(data => {
            if(data.length == 0)
            res.send("Not Found")
            else
            {
            const response = {
                count: data.length,
                products : data
            }
            res.send(response)
            }
        })
        .catch(err => res.json({"message":err})
        )
    }
    else{
        product.find({name:prodname})
        .select("name price _id")
        .exec()
        .then(data => {
            if(data.length == 0)
            res.send("Not Found")
            else
            {
            const response = {
                count: data.length,
                products : data
            }
            res.send(response)
            }
        })
        .catch(err => res.json({"message":err})
        )
        
    }
})


// Update a product


app.patch("/:prodId",(req,res) => {
    let prodid = req.params.prodId
    console.log(prodid)
    const updateOps = {}
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }
    console.log(prodid)
    product.updateOne({ _id: prodid} , {$set: updateOps}, {upsert: true})
    .exec()
    .then(result => res.send(result))
    .catch(err => res.send(err))
})



// delete a product

app.delete("/:prodId",(req,res) => {
    let prodid = req.params.prodId
    product.deleteOne({ _id: prodid})
    .exec()
    .then(result => 
            res.send(result)
    )
    .catch(err => console.log(err))
})

app.use(function(req,res,next){
    const error  =  new Error("Path not found")
    error.status = 404;
    next(error)
})

app.use((error,req,res) => {
    res.status(error.status || 500)
    res.json({
        error:{
            message : error.message
        }
    })
})



// eslint-disable-next-line no-console
app.listen(process.env.PORT || 3000 , () => console.log("server started"));