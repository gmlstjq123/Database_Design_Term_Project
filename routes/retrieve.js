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
        if (req.query.retrieve_type == 'patient_id') {
            const data = {
                patient_id: req.query.patient_id,
            };
            const selectedPatients = await selectSql.getPatientsById(data);
            res.render('retrieve', { 
                user: req.cookies.job + " " + req.cookies.user, 
                title: "환자 검색 페이지",
                title1: "환자 ID로 조회",
                selectedPatients,
            });
        }
        else if (req.query.retrieve_type == 'name') {
            const data = {
                name: req.query.name,
            };
            const selectedPatients = await selectSql.getPatientsByName(data);
            res.render('retrieve', { 
                user: req.cookies.job + " " + req.cookies.user, 
                title: "환자 검색 페이지",
                title1: "환자 이름으로 조회",
                selectedPatients,
            });
        }
        else if (req.query.retrieve_type == 'social_security_number') {
            const data = {
                social_security_number: req.query.social_security_number,
            };
            const selectedPatients = await selectSql.getPatientsBySSN(data);
            res.render('retrieve', { 
                user: req.cookies.job + " " + req.cookies.user, 
                title: "환자 검색 페이지",
                title1: "환자 SSN으로 조회",
                selectedPatients,
            });
        }
        else if (req.query.retrieve_type == 'gender') {
            const data = {
                gender: req.query.gender,
            };
            const selectedPatients = await selectSql.getPatientsByGender(data);
            res.render('retrieve', { 
                user: req.cookies.job + " " + req.cookies.user, 
                title: "환자 검색 페이지",
                title1: "환자 성별로 조회",
                selectedPatients,
            });
        }
        else if (req.query.retrieve_type == 'address') {
            const data = {
                address: req.query.address,
            };
            const selectedPatients = await selectSql.getPatientsByAddress(data);
            res.render('retrieve', { 
                user: req.cookies.job + " " + req.cookies.user, 
                title: "환자 검색 페이지",
                title1: "환자 주소로 조회",
                selectedPatients,
            });
        }
        else if (req.query.retrieve_type == 'blood_type') {
            const data = {
                blood_type: req.query.blood_type,
            };
            const selectedPatients = await selectSql.getPatientsByBloodType(data);
            res.render('retrieve', { 
                user: req.cookies.job + " " + req.cookies.user, 
                title: "환자 검색 페이지",
                title1: "환자 혈액형으로 조회",
                selectedPatients,
            });
        }
        else if (req.query.retrieve_type == 'height_weight') {
            const data = {
                height: req.query.height,
                weight: req.query.weight,
            };
            const selectedPatients = await selectSql.getPatientsByHeightWeight(data);
            res.render('retrieve', { 
                user: req.cookies.job + " " + req.cookies.user, 
                title: "환자 검색 페이지",
                title1: "환자 키/몸무게로 조회",
                selectedPatients,
            });
        }
        else if (req.query.retrieve_type == 'phone_number') {
            const data = {
                phone_number: req.query.phone_number,
            };
            const selectedPatients = await selectSql.getPatientsByPhoneNumber(data);
            res.render('retrieve', { 
                user: req.cookies.job + " " + req.cookies.user, 
                title: "환자 검색 페이지",
                title1: "환자 전화번호로 조회",
                selectedPatients,
            });
        }
        else if (req.query.retrieve_type == 'Doctor_doctor_id') {
            const data = {
                Doctor_doctor_id: req.query.Doctor_doctor_id,
            };
            const selectedPatients = await selectSql.getPatientsByDoctorId(data);
            res.render('retrieve', { 
                user: req.cookies.job + " " + req.cookies.user, 
                title: "환자 검색 페이지",
                title1: "환자 담당 의사로 조회",
                selectedPatients,
            });
        }
        else if (req.query.retrieve_type == 'Nurse_nurse_id') {
            const data = {
                Nurse_nurse_id: req.query.Nurse_nurse_id,
            };
            const selectedPatients = await selectSql.getPatientsByNurseId(data);
            res.render('retrieve', { 
                user: req.cookies.job + " " + req.cookies.user, 
                title: "환자 검색 페이지",
                title1: "환자 담당 간호사로 조회",
                selectedPatients,
            });
        }
        else if (req.query.retrieve_type == 'patient_examination_treatment') {
            const data = {
                patient_id: req.query.patient_id,
            };
            const selectedPatients = await selectSql.getPatientsExaminationTreatment(data);
            res.render('retrieve', { 
                user: req.cookies.job + " " + req.cookies.user, 
                title: "환자 검색 페이지",
                title1: "환자 정보 조회",
                selectedPatients,
            });
        }
        else if (req.query.retrieve_type == 'doctor_examination_treatment') {
            const data = {
                doctor_id: req.query.doctor_id,
            };
            const selectedPatients = await selectSql.getDoctorsExaminationTreatment(data);
            res.render('retrieve', { 
                user: req.cookies.job + " " + req.cookies.user, 
                title: "환자 검색 페이지",
                title1: "환자 정보 조회",
                selectedPatients,
            });
        }
        else if (req.query.retrieve_type == 'nurse_examination_treatment') {
            const data = {
                nurse_id: req.query.nurse_id,
            };
            const selectedPatients = await selectSql.getNursesExaminationTreatment(data);
            res.render('retrieve', { 
                user: req.cookies.job + " " + req.cookies.user, 
                title: "환자 검색 페이지",
                title1: "환자 정보 조회",
                selectedPatients,
            });
        }
        else {
            const selectedPatients = await selectSql.getPatients();
            res.render('retrieve', { 
                user: req.cookies.job + " " + req.cookies.user, 
                title: "환자 검색 페이지",
                title1: "환자 정보 조회",
                selectedPatients,
            });
        }
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
    await updateSql.updateExamination(data);
    return res.send(`<script>
        alert('업데이트가 완료되었습니다.');
        location.href='/employee';
    </script>`);

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
    await updateSql.updateTreatment(data);
    return res.send(`<script>
        alert('업데이트가 완료되었습니다.');
            location.href='/employee';
    </script>`);

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
    await deleteSql.deleteExamination(data);
    
    return res.send(`<script>
        alert('삭제가 완료되었습니다.');
        location.href='/employee';
    </script>`);
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
    await deleteSql.deleteTreatment(data);

    return res.send(`<script>
        alert('삭제가 완료되었습니다.');
        location.href='/employee';
    </script>`);
});

module.exports = router;