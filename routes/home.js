"use strict"
const HomeController = require("../controllers/homeController")
const express = require("express");
const router = express.Router();

router.get("/", HomeController.home);

router.use((req, res, next) => {
    // console.log(req.session)
    if(!req.session.iduser){
        let errors = 'Login dulu ya'
      return res.redirect(`/login?errors=${errors}`)
    } else {
      return next()
    }

})


router.get("/courses", Controller.courses);
router.get("/courses/add", Controller.addCourse);
router.post("/courses/add", HomeController.addToDB);
router.get("/courses/edit/:id", HomeController.editPage);
router.post("/courses/edit/:id", HomeController.editData);

router.get("/courses/buy/:id", HomeController.buy);
router.get("/courses/delete/:id", HomeController.delete);

module.exports = router;