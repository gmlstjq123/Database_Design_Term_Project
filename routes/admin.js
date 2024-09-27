import express from "express";
import { selectSql } from '../database/sql';
import { insertSql } from "../database/sql";
import { updateSql } from "../database/sql";
import { deleteSql } from "../database/sql";

const router = express.Router();

router.get('/', async function (req, res) {
    // TODO
    
    if (req.cookies.user) {
        const allDoctors = await selectSql.getDoctors();
        const allNurses = await selectSql.getNurses();
        res.render('admin', { 
            user: 'Admin', 
            title: "관리자 페이지",
            title1: "의사 정보",
            allDoctors,
            title2: "간호사 정보",
            allNurses
        });
    } else {
        res.render('/')
    }

});

router.post('/', async (req, res) => {
    const vars = req.body;
    if(vars.employee_type == 'doctor') {
        if (!vars.doctor_id || !vars.name || !vars.address || !vars.phone_number || !vars.password || !vars.Department_department_id) {
            return res.send(`<script>
                                alert('모든 필드를 입력해야 합니다.');
                                location.href='/admin';
                            </script>`);
        }
        
        const data = {
            doctor_id: vars.doctor_id,
            name: vars.name,
            address: vars.address,
            phone_number: vars.phone_number,
            password: vars.password,
            Department_department_id: vars.Department_department_id,
        };
        const result = await insertSql.addDoctor(data);
    
        if (result === "exist") {
            return res.send(`<script>
                                alert('이미 존재하는 값입니다.');
                                location.href='/admin';
                            </script>`);
        } else if (result === "invalid"){
            return res.send(`<script>
                                alert('유효하지 않은 부서 번호입니다.');
                                location.href='/admin';
                            </script>`);
        } else if (result === "error"){
            return res.send(`<script>
                                alert('예기치 못한 에러가 발생했습니다. 다시 시도해주세요');
                                location.href='/admin';
                            </script>`);
        } else {
            return res.send(`<script>
                                alert('추가가 완료되었습니다.');
                                location.href='/admin';
                            </script>`);
        }
    } else if (vars.employee_type == 'nurse') {
        if (!vars.nurse_id || !vars.name || !vars.address || !vars.phone_number || !vars.password || !vars.Department_department_id) {
            return res.send(`<script>
                                alert('모든 필드를 입력해야 합니다.');
                                location.href='/admin';
                            </script>`);
        }
        
        const data = {
            nurse_id: vars.nurse_id,
            name: vars.name,
            address: vars.address,
            phone_number: vars.phone_number,
            password: vars.password,
            Department_department_id: vars.Department_department_id,
        };
        const result = await insertSql.addNurse(data);
    
        if (result === "exist") {
            return res.send(`<script>
                                alert('이미 존재하는 값입니다.');
                                location.href='/admin';
                            </script>`);
        } else if (result === "invalid"){
            return res.send(`<script>
                                alert('유효하지 않은 부서 번호입니다.');
                                location.href='/admin';
                            </script>`);
        } else if (result === "error"){
            return res.send(`<script>
                                alert('예기치 못한 에러가 발생했습니다. 다시 시도해주세요');
                                location.href='/admin';
                            </script>`);
        } else {
            return res.send(`<script>
                                alert('추가가 완료되었습니다.');
                                location.href='/admin';
                            </script>`);
        }
    }
});

router.post('/doctor', async (req, res) => {
    const vars = req.body;
    if (!vars.name || !vars.address || !vars.phone_number || !vars.password || !vars.Department_department_id) {
        return res.send(`<script>
                            alert('모든 필드를 입력해야 합니다.');
                            location.href='/admin';
                        </script>`);
    }

    const data = {
        doctor_id: vars.doctor_id,
        name: vars.name,
        address: vars.address,
        phone_number: vars.phone_number,
        password: vars.password,
        Department_department_id: vars.Department_department_id,
    }
    const result = await updateSql.updateDoctor(data);
    if (result === "exist") {
        return res.send(`<script>
                            alert('이미 존재하는 전화번호입니다.');
                            location.href='/admin';
                        </script>`);
    } else if (result === "invalid"){
        return res.send(`<script>
                            alert('유효하지 않은 부서 번호입니다.');
                            location.href='/admin';
                        </script>`);
    } else if (result === "error"){
        return res.send(`<script>
                            alert('예기치 못한 에러가 발생했습니다. 다시 시도해주세요');
                            location.href='/admin';
                        </script>`);
    } else {
        return res.send(`<script>
                            alert('업데이트가 완료되었습니다.');
                            location.href='/admin';
                        </script>`);
    }
})

router.post('/nurse', async (req, res) => {
    const vars = req.body;
    if (!vars.name || !vars.address || !vars.phone_number || !vars.password || !vars.Department_department_id) {
        return res.send(`<script>
                            alert('모든 필드를 입력해야 합니다.');
                            location.href='/admin';
                        </script>`);
    }
    const data = {
        nurse_id: vars.nurse_id,
        name: vars.name,
        address: vars.address,
        phone_number: vars.phone_number,
        password: vars.password,
        Department_department_id: vars.Department_department_id,
    }
    const result = await updateSql.updateNurse(data);
    if (result === "exist") {
        return res.send(`<script>
                            alert('이미 존재하는 전화번호입니다.');
                            location.href='/admin';
                        </script>`);
    } else if (result === "invalid"){
        return res.send(`<script>
                            alert('유효하지 않은 부서 번호입니다.');
                            location.href='/admin';
                        </script>`);
    } else if (result === "error"){
        return res.send(`<script>
                            alert('예기치 못한 에러가 발생했습니다. 다시 시도해주세요');
                            location.href='/admin';
                        </script>`);
    } else {
        return res.send(`<script>
                            alert('업데이트가 완료되었습니다.');
                            location.href='/admin';
                        </script>`);
    }
})

router.post('/delete/doctor', async (req, res) => {
    const vars = req.body;
    const data = {
        doctor_id: vars.doctor_id,
    };
    const result = await deleteSql.deleteDoctor(data);
    if (result === "cannot") {
        return res.send(`<script>
                            alert('의사가 관리 중인 환자 정보 및 등록한 검진 정보를 먼저 수정한 후에 의사 삭제가 가능합니다.');
                            location.href='/admin';
                        </script>`);
    } else if (result === "error") {
        return res.send(`<script>
                            alert('예기치 못한 에러가 발생했습니다. 다시 시도해주세요');
                            location.href='/admin';
                        </script>`);
    } else {
        return res.send(`<script>
                            alert('삭제가 완료되었습니다.');
                            location.href='/admin';
                        </script>`);
    }  
})

router.post('/delete/nurse', async (req, res) => {
    const vars = req.body;
    const data = {
        nurse_id: vars.nurse_id,
    };
    const result = await deleteSql.deleteNurse(data);
    if (result === "cannot") {
        return res.send(`<script>
        alert('간호사가 관리 중인 환자 정보 및 등록한 치료 정보를 먼저 수정한 후에 간호사 삭제가 가능합니다.');
        location.href='/admin';
    </script>`);
    } else if (result === "error") {
        return res.send(`<script>
                            alert('예기치 못한 에러가 발생했습니다. 다시 시도해주세요');
                            location.href='/admin';
                        </script>`);
    } else {
        return res.send(`<script>
                            alert('삭제가 완료되었습니다.');
                            location.href='/admin';
                        </script>`);
    }
})

module.exports = router;