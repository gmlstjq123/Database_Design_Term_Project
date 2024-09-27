import cookieParser from "cookie-parser";
import express from "express";
import expressSession from 'express-session';
import { selectSql } from "../database/sql";

const router = express.Router();

router.use(cookieParser());
router.use(expressSession({
    secret: 'dilab',
    resave: true,
    saveUninitialized: true,
}))

router.get('/', (req, res) => {
    if (req.cookies.user) {
        res.render('main', { 
            'user': req.cookies.job + " " + req.cookies.user,
        });
    } else {
        res.render('login');
    }
});

router.get('/logout', (req, res) => {
    if (req.cookies.user) {
        res.clearCookie('user')
        res.clearCookie('job');
        res.redirect("/");
    } else {
        res.redirect("/");
    }
})

router.post('/', async (req, res) => {
    const vars = req.body;
    const doctors = await selectSql.getDoctors();
    const nurses = await selectSql.getNurses();
    const patients = await selectSql.getPatients();
    var job = "";
    var whoAmI = 1;
    let checkLogin = false; 

    doctors.map((doctor) => {
        if (vars.id == doctor.doctor_id && vars.password === doctor.password) {
            checkLogin = true;
            job = 'Doctor'
            whoAmI = doctor.doctor_id;
        }
    })

    nurses.map((nurse) => {
        if (vars.id == nurse.nurse_id && vars.password === nurse.password) {
            checkLogin = true;
            job = 'Nurse'
            whoAmI = nurse.nurse_id;
        }
    })

    patients.map((patient) => {
        if (vars.id == patient.patient_id && vars.password === patient.password) {
            checkLogin = true;
            job = 'Patient'
            whoAmI = patient.patient_id;
        }
    })

    if(vars.id == 'admin' && vars.password == 'admin1') {
        checkLogin = true;
        whoAmI = 1
        job = 'Admin'
    }

    if (checkLogin) {
        res.cookie('user', whoAmI, {
            expires: new Date(Date.now() + 3600000), // ms 단위 (3600000: 1시간 유효)
            httpOnly: true
        })
        res.cookie('job', job, {
            expires: new Date(Date.now() + 3600000), // ms 단위 (3600000: 1시간 유효)
            httpOnly: true
        })
        console.log(`job: ${job}`);

        if (job === 'Admin') {
            res.redirect('/admin')
        } else if(job === 'Doctor' || job === 'Nurse') {
            res.redirect('/employee');
        } else if (job === 'Patient') {
            res.redirect('/patient')
        } else {
            res.redirect('/');
        }
        
    } else {
        res.redirect('/');
    }
})

module.exports = router;