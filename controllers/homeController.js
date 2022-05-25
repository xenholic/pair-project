"use strict"
const { Op } = require("sequelize");
const {User, Course, UserCourse, UserProfile} = require("../models")
const convertToRupiah = require("../helpers/convertToRp");
const UserProfile = require("../models/useridentity");
class HomeController{
    static home(req, res){
        let id = req.session.iduser
        res.render("home", {id});
    }

    static courses(req, res){


        let options = {
            where: {}
        }
        if (req.query.searchName) {
            options.where = {
                ...options.where,
                name: {
                    [Op.iLike]: `%${req.query.searchName}%`
                }
            }

        }
        if (req.query.searchDesc) {
            options.where = {
                ...options.where,
                description: {
                    [Op.iLike]: `%${req.query.searchDesc}%`
                }

            }
        }
        const role = req.session.roleuser;
        const userid = req.session.iduser;
        let purchased;
        let output;
        Course.findAll(options)
            .then(data => {
                output = data;
                return Course.findAll({
                    attributes:  ["id"],
                    include: {
                        model: User,
                        where: {
                            id: userid
                        }
                    }
                })
            })
            .then((data) => {
                purchased=data
                return UserProfile.findAll({
                    where: {
                        id: userid
                    }
                })
            })
            .then((userprofile) => {
                console.log(userprofile);
                res.render("courses", {data: output, convertToRupiah, role, userid, purchased: purchased, userprofile});
            })
            .catch(err => {
                console.log(err);
                res.render(err);
            })
    }

    static buy(req, res){
        const CourseId = req.params.id
        UserCourse.create({
            CourseId: +CourseId,
            UserId: req.session.iduser
        })
        .then(() => {
            res.redirect("/home/courses")
        })
        .catch((err) => {
            res.render(err);
        })
    }

    static addCourse(req, res){
        let errors = req.query.errors
        res.render("addPage", {errors});
    }

    static addToDB(req, res){
        const body = req.body;
        const {name, imageURL, description, price} = body
        console.log(body);
        Course.create({
            name:name,
            imageURL: imageURL,
            description: description,
            price: +price
        })
        .then(() => {
            res.redirect("/home/courses")
        })
        .catch((err) => {
            let result = []
            if (err.name == "SequelizeValidationError") {
            err.errors.forEach(el=>{
                result.push(el.message)
            })
            return res.redirect(`/home/courses/add?errors=${result}`)
            } else {
                res.send(err)

            }
        })
    }

    static editPage(req, res){
        const id = req.params.id
        Course.findAll({
            where: {id: +id}
        })
        .then((data) => {
            let errors = req.query.errors
            res.render("editPage", {data, errors})
        })
        .catch((err) => {
            res.render(err);
        })
    }

    static editData(req, res){
        const body = req.body;
        const {name, imageURL, description, price} = body
        console.log(body);
        Course.update({
            name:name,
            imageURL: imageURL,
            description: description,
            price: +price
        },
        {
            where: {
                id: +req.params.id
            }
        })
        .then(() => {
            res.redirect("/home/courses")
        })
        .catch((err) => {
            let result = []
            if (err.name == "SequelizeValidationError") {
            err.errors.forEach(x=>{
                result.push(x.message)
            })
            return res.redirect(`/home/courses/edit/${req.params.id}?errors=${result}`)
            } else {
                res.send(err)
            }
        })
    }

    static delete(req, res){
        const CourseId = req.params.id
        Course.deleteCourse(CourseId)
        .then(() => res.redirect("/home/courses"))
        .catch(err => {
            res.render(err);
        })
    }
}

module.exports = HomeController