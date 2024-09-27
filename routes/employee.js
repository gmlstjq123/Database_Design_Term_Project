import express from "express";
import { selectSql } from '../database/sql';
import { insertSql } from "../database/sql";
import { updateSql } from "../database/sql";
import { deleteSql } from "../database/sql";

const router = express.Router();

router.get('/', async function (req, res) {
    // TODO
    
    if (req.cookies.user) {
        const allExaminations = await selectSql.getExaminations();
        const allTreatments = await selectSql.getTreatments();
        console.log(allExaminations);
        res.render('employee', { 
            user: req.cookies.job + " " + req.cookies.user, 
            title: "직원 페이지",
            title1: "검진 정보",
            allExaminations,
            title2: "치료 정보",
            allTreatments
        });
    } else {
        res.render('/')
    }

});

router.post('/', async (req, res) => {
    const vars = req.body;
    if(vars.employee_type == 'doctor') {
        if(req.cookies.job != 'Doctor') {
            return res.send(`<script>
                                alert('의사만 입력할 수 있습니다.');
                                location.href='/employee';
                            </script>`);
        }
        if (!vars.examination_date_time || !vars.Doctor_doctor_id || !vars.Patient_patient_id) {
            return res.send(`<script>
                                alert('Examination Details를 제외한 모든 필드를 입력해야 합니다.');
                                location.href='/employee';
                            </script>`);
        }
        if(req.cookies.user != vars.Doctor_doctor_id) {
            return res.send(`<script>
                                alert('본인의 검진만 추가할 수 있습니다.');
                                location.href='/employee';
                            </script>`);
        }
        
        const data = {
            examination_date_time: vars.examination_date_time,
            examination_details: vars.examination_details,
            Doctor_doctor_id: vars.Doctor_doctor_id,
            Patient_patient_id: vars.Patient_patient_id,
        };
        const result = await insertSql.addExamination(data);
    
        if (result === "exist") {
            return res.send(`<script>
                                alert('한명의 환자에 대해서는 한번의 검진만 입력할 수 있습니다.');
                                location.href='/employee';
                            </script>`);
        } else if (result === "invalid"){
            return res.send(`<script>
                                alert('의사 ID 또는 환자 ID가 잘못되었습니다.');
                                location.href='/employee';
                            </script>`);
        } else if (result === "error"){
            return res.send(`<script>
                                alert('예기치 못한 에러가 발생했습니다. 다시 시도해주세요');
                                location.href='/employee';
                            </script>`);
        } else {
            return res.send(`<script>
                                alert('추가가 완료되었습니다.');
                                location.href='/employee';
                            </script>`);
        }
    } else if (vars.employee_type == 'nurse') {
        if(req.cookies.job != 'Nurse') {
            return res.send(`<script>
                                alert('간호사만 입력할 수 있습니다.');
                                location.href='/employee';
                            </script>`);
        }
        if (!vars.treatment_date_time || !vars.Nurse_nurse_id || !vars.Patient_patient_id) {
            console.log(vars);
            return res.send(`<script>
                                alert('Treatment Details를 제외한 모든 필드를 입력해야 합니다.');
                                location.href='/employee';
                            </script>`);
        }
        if(req.cookies.user != vars.Nurse_nurse_id) {
            return res.send(`<script>
                                alert('본인의 치료만 추가할 수 있습니다.');
                                location.href='/employee';
                            </script>`);
        }
        
        const data = {
            treatment_date_time: vars.treatment_date_time,
            treatment_details: vars.treatment_details,
            Nurse_nurse_id: vars.Nurse_nurse_id,
            Patient_patient_id: vars.Patient_patient_id,
        };
        console.log(data);
        const result = await insertSql.addTreatment(data);
    
        if (result === "exist") {
            return res.send(`<script>
                                alert('한명의 환자에 대해서는 한번의 치료만 입력할 수 있습니다.');
                                location.href='/employee';
                            </script>`);
        } else if (result === "invalid"){
            return res.send(`<script>
                                alert('간호사 ID 또는 환자 ID가 잘못되었습니다.');
                                location.href='/employee';
                            </script>`);
        } else if (result === "error"){
            return res.send(`<script>
                                alert('예기치 못한 에러가 발생했습니다. 다시 시도해주세요');
                                location.href='/employee';
                            </script>`);
        } else {
            return res.send(`<script>
                                alert('추가가 완료되었습니다.');
                                location.href='/employee';
                            </script>`);
        }
    }
});

router.post('/doctor', async (req, res) => {
    const vars = req.body;
    if(req.cookies.job != 'Doctor') {
        return res.send(`<script>
                            alert('의사만 수정할 수 있습니다.');
                            location.href='/employee';
                        </script>`);
    }
    if(req.cookies.user != vars.Doctor_doctor_id) {
        return res.send(`<script>
                            alert('본인의 검진 정보만 수정할 수 있습니다.');
                            location.href='/employee';
                        </script>`);
    }
    if (!vars.examination_date_time) {
        return res.send(`<script>
                            alert('Examination Date Time 필드는 반드시 입력해야 합니다.');
                            location.href='/employee';
                        </script>`);
    }

    const data = {
        examination_date_time: vars.examination_date_time,
        examination_details: vars.examination_details,
        Doctor_doctor_id: vars.Doctor_doctor_id,
        Patient_patient_id: vars.Patient_patient_id,
    }
    const result = await updateSql.updateExamination(data);
    if (result === "error"){
        return res.send(`<script>
                            alert('예기치 못한 에러가 발생했습니다. 다시 시도해주세요');
                            location.href='/employee';
                        </script>`);
    } else {
        return res.send(`<script>
                            alert('업데이트가 완료되었습니다.');
                            location.href='/employee';
                        </script>`);
    }
});

router.post('/nurse', async (req, res) => {
    const vars = req.body;
    console.log(vars);
    if(req.cookies.job != 'Nurse') {
        return res.send(`<script>
                            alert('간호사만 수정할 수 있습니다.');
                            location.href='/employee';
                        </script>`);
    }
    if(req.cookies.user != vars.Nurse_nurse_id) {
        return res.send(`<script>
                            alert('본인의 치료 정보만 수정할 수 있습니다.');
                            location.href='/employee';
                        </script>`);
    }
    if (!vars.treatment_date_time) {
        return res.send(`<script>
                            alert('Treatment Date Time 필드는 반드시 입력해야 합니다.');
                            location.href='/employee';
                        </script>`);
    }

    const data = {
        treatment_date_time: vars.treatment_date_time,
        treatment_details: vars.treatment_details,
        Nurse_nurse_id: vars.Nurse_nurse_id,
        Patient_patient_id: vars.Patient_patient_id,
    }
    const result = await updateSql.updateTreatment(data);
    if (result === "error"){
        return res.send(`<script>
                            alert('예기치 못한 에러가 발생했습니다. 다시 시도해주세요');
                            location.href='/employee';
                        </script>`);
    } else {
        return res.send(`<script>
                            alert('업데이트가 완료되었습니다.');
                            location.href='/employee';
                        </script>`);
    }
});

router.post('/delete/examination', async (req, res) => {
    const vars = req.body;
    if(req.cookies.job != 'Doctor') {
        return res.send(`<script>
                            alert('의사만 삭제할 수 있습니다.');
                            location.href='/employee';
                        </script>`);
    }
    if(req.cookies.user != vars.Doctor_doctor_id) {
        return res.send(`<script>
                            alert('본인의 검진만 삭제할 수 있습니다.');
                            location.href='/employee';
                        </script>`);
    }
    const data = {
        Doctor_doctor_id: vars.Doctor_doctor_id,
        Patient_patient_id: vars.Patient_patient_id,
    };
    const result = await deleteSql.deleteExamination(data);
    if (result === "error"){
        return res.send(`<script>
                            alert('예기치 못한 에러가 발생했습니다. 다시 시도해주세요');
                            location.href='/employee';
                        </script>`);
    } else {
        return res.send(`<script>
                            alert('삭제가 완료되었습니다.');
                            location.href='/employee';
                        </script>`);
    }
});

router.post('/delete/treatment', async (req, res) => {
    const vars = req.body;
    if(req.cookies.job != 'Nurse') {
        return res.send(`<script>
                            alert('간호사만 삭제할 수 있습니다.');
                            location.href='/employee';
                        </script>`);
    }
    if(req.cookies.user != vars.Nurse_nurse_id) {
        return res.send(`<script>
                            alert('본인의 치료만 삭제할 수 있습니다.');
                            location.href='/employee';
                        </script>`);
    }
    const data = {
        Nurse_nurse_id: vars.Nurse_nurse_id,
        Patient_patient_id: vars.Patient_patient_id,
    };
    console.log(vars)
    const result = await deleteSql.deleteTreatment(data);
    if (result === "error"){
        return res.send(`<script>
                            alert('예기치 못한 에러가 발생했습니다. 다시 시도해주세요');
                            location.href='/employee';
                        </script>`);
    } else {
        return res.send(`<script>
                            alert('삭제가 완료되었습니다.');
                            location.href='/employee';
                        </script>`);
    }
});

module.exports = router;