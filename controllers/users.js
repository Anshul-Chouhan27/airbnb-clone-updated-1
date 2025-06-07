const User=require("../model/user");

module.exports.sigupRender=(req,res)=>{
    res.render("../views/users/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser= new User({username,email});
        const registerUser=await User.register(newUser,password);
        console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success","Welcome to wanderlust");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
   
};

//login

module.exports.loginRender=(req,res)=>{
    res.render("../views/users/login.ejs");
}

module.exports.loginRoute=async(req,res)=>{
    req.flash("success","Welcome to wanderlust");
   let redirectUrl= res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);//we diretcly not access req session directUrl so we stor in the res.locals.redirectUrl 
  // res.send("welcome to wanderlust");
 }

 module.exports.loginDelete=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged you out");
        res.redirect("/listings");
    });
 };