require("dotenv").config({path: "./config/.env"});
const express = require ("express");
const mongoose = require ("mongoose");

const app = express()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

//create a person 

const personSchema = {
    name : {
        type : String,
        required : [true]
    },
    age : Number,
    favoriteFoods : [String]
}

const contactlist = mongoose.model("contactlist",personSchema)

// create and save a Record of a Model 

const personOne = new contactlist({
    name : "Mohamed",
    age : 27,
    favoriteFoods : ["pasta", "lazania", "burritos"]
})

personOne.save(function(e){
    if(!e){
        console.log("Success")
    }
})

//create Many Records

const people = [
    {
        name : "Ali",
        age : 32,
        favoriteFoods : ["pizza", "chicken","pasta"]
    },{
        name : "Aymen",
        age : 18,
        favoriteFoods : ["pizza"]
    },{
        name : "Ahmed",
        age : 5,
        favoriteFoods : ["couscous","fish"]
    },{
        name : "yesmine",
        age : 25,
        favoriteFoods : ["burritos", "pasta","banana"]
    },{
        name : "Maryem",
        age : 21,
        favoriteFoods : ["pasta", "pizza"]
    }
]

contactlist.create(people)

//Use model.find() to Search your Database

app.route("/findall").get(function(req,res){
    contactlist.find(function(e,data){
        if(!e){
            res.send(data)
        }else{
            res.send(e)
        }
    })
})

//use model.findOne()

app.route("/findone/:food").get(function(req,res){
    contactlist.findOne({ favoriteFoods : req.params.food}, function(e,data){
        if(!e){
            res.send(data)
        }else{
            res.send(e)
        }
    })
})


//use model.findbyId()

app.route("/findbyid/:id").get(function(req,res){
    contactlist.findOne({_id : req.params.id},function(e,data){
        if(!e){
            res.send(data)
        }else{
            res.send(e)
        }
    })
})

//Perform Classic Updates by Running Find ,Edit, Then save

app.route("/addhamburger/:id").patch(function(req,res){
    contactlist.findOne({ _id : req.params.id},function(e,data){
        if(!e){
            data.favoriteFoods.push("hamburger")
            data.save()
            res.send("hamburger added")
        }else{
            res.send(e)
        }
    })
})

//Perform New Updates on a document Using model.findOneAndUpdate()

app.route("/age20/:id").put(function(req,res){
    contactlist.findByIdAndUpdate({ _id : req.params.id},{$set : {age : 20}},function(e){
        if(!e){
            res.send("ok")
        }else{
            res.send(e)
        }
    })
})

//Delete One Document Using model.findByIdAndRemove

app.route("/remove/:id").delete(function(req,res){
    contactlist.findByIdAndRemove({ _id : req.params.id},function(e){
        if(!e){
            res.send("deleted")
        }else{
            res.send(e)
        }
    })
})

// MongoDB and Mongoose - Delete Many Documents with model.remove()

app.route("removebyname/:name").delete(function(req,res){
    contactlist.remove({name : req.params.name},function(e){
        if(!e){
            res.send("deleted by name")
        }else{
            res.send(e)
        }
    })
})

//Chain Search Query Helpers to Narrow Search Results

app.route("/siblings").get(function(req,res){
    contactlist.find({ favoriteFoods: "burritos"})
    .sort({ name : "asc"})
    .limit(2)
    .select("-age")
    .exec(function(e,data){
        if(!e){
            res.send(data)
        }else{
            res.send(e)
        }
    })
})



app.listen(process.env.port, function(){
    console.log("Server started on port" + process.env.port);
});

