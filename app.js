const express=require("express");
const app=express();
const port=8080;
const mongoose=require("mongoose");
const path=require("path");
//const { count } = require("console");
const methodOverride=require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./model/user.js");


const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/users.js")

// 

//const mongooseUrl="mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl=process.env.ATLASDB_URL;
const dbUrl="mongodb+srv://anshul:oSJiosf1PbXMTsqS@cluster0.jxiv0zq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"



main().then((res)=>{
    console.log("connect");
}).catch((err)=>{
    console.log(err);
}); 

async function main() {
    await mongoose.connect(dbUrl);
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret: process.env.SECRET,
      },
      touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("Error in mongo store session",err);
})

const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
       expires:Date.now()+7*24*60*60*1000,
       maxAge:7*24*60*60*1000,
       httpOnly:true
    },
};



//ROOT
// app.get("/",(req,res)=>{
//     res.send("root");
// });

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demo",async(req,res)=>{
//     let fakeuser=new User({
//         email:"anshul@gmail.com",
//         username:"anshul"
//     },
// )
//   let newuser=await User.register(fakeuser,"hello");
//   res.send(newuser);
// })


//flash route
app.use(((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user ;
    //console.log(res.locals.success);
    next();
}));

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get("/", (req, res) => {
    res.redirect("/listings");
});


app.use("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Could not found"}=err;
    res.status(statusCode).render("error.ejs",{message});
    //res.status(statusCode).send(message);
});

app.listen(port,()=>{
    console.log("listen");
});



// app.get("/testlisting",(req,res)=>{
//     let list=new Listing({
//         title:"Luxury Hotel",
//         description:"Best services",
//         price:10000,
//         location:"mumbai"
//     })
//     list.save().then((res)=>{
//         console.log("database created");
//     }).catch((err)=>{
//         console.log(err);
//     })
//     res.send("okie");
// });