const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require('bcrypt');


// Registering Users.

router.post("/register", async(req,res)=>{
    try {
        // Generating a secure Password.
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(req.body.password,salt);
        // Creating a new User.

         const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
         })
        // Save user and send Response.

        const user = await newUser.save();
        res.status(200).json(user._id)
    } catch (error) {
        res.status(500).json(error);
    }
})

// Login.

router.post("/login", async(req,res)=>{
    try {
        // Finding User.
        const user = await User.findOne({username:req.body.username});
        !user && res.status(400).json("Wrong Credentials!");
        // Validating Password.
         const validPassword = await bcrypt.compare(
             req.body.password,
             user.password
         );
         !validPassword && res.status(400).json("Wrong Credentials!");
        // Sending Response.

        res.status(200).json({user:user._id,username:user.username})
    } catch (error) {
        res.status(500).json(error)
        
    }
})

module.exports = router;