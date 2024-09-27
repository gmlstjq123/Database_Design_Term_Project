import express from "express";
import { selectSql } from '../database/sql';
import { insertSql } from "../database/sql";
import { updateSql } from "../database/sql";
import { deleteSql } from "../database/sql";

const router = express.Router();

router.get('/', async function (req, res) {
    // TODO
    if (req.cookies.user) {
        console.log(req.query);
        const data = {
            patient_id: req.cookies.user,
        };
        const patientReservations = await selectSql.getPatientsReservation(data);
        res.render('patient', { 
            user: req.cookies.job + " " + req.cookies.user, 
            patientReservations,
        });
    } else {
        res.render('/')
    }
});

router.post('/', async (req, res) => {
    const vars = req.body;
    if (!vars.reservation_date_time || !vars.Medical_Speciality_department_id) {
        return res.send(`<script>
                            alert('모든 필드를 입력해야 합니다.');
                            location.href='/patient';
                        </script>`);
    }
        
    const data = {
        reservation_date_time: vars.reservation_date_time,
        Patient_patient_id: req.cookies.user,
        Medical_Speciality_department_id : vars.Medical_Speciality_department_id,
    };
    console.log(data);
    const result = await insertSql.addReservation(data);
    
    if (result === "invalid"){
        return res.send(`<script>
                            alert('부서 ID가 잘못되었습니다.');
                            location.href='/patient';
                        </script>`);
    } else if(result === "exist") {
        return res.send(`<script>
                            alert('해당 시간에는 이미 예약이 존재합니다.');
                            location.href='/patient';
                        </script>`);
    } else if(result === "another") {
        return res.send(`<script>
                            alert('한 명의 환자가 같은 시간에 두 번 예약할 수 없습니다.');
                            location.href='/patient';
                        </script>`);
    } else if (result === "error"){
        return res.send(`<script>
                            alert('예기치 못한 에러가 발생했습니다. 다시 시도해주세요');
                            location.href='/patient';
                        </script>`);
    } else {
        return res.send(`<script>
                            alert('예약이 완료되었습니다.');
                            location.href='/patient';
                        </script>`);
    }
});

router.post('/cancel', async (req, res) => {
    const vars = req.body;
    console.log(vars);
    const data = {
        reservation_number: vars.reservation_number,
    };
    const result = await deleteSql.deleteReservation(data);
    if (result === "error"){
        return res.send(`<script>
                            alert('예기치 못한 에러가 발생했습니다. 다시 시도해주세요');
                            location.href='/patient';
                        </script>`);
    } else {
        return res.send(`<script>
                            alert('예약이 취소되었습니다.');
                            location.href='/patient';
                        </script>`);
    }
});

module.exports = router;