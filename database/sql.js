import mysql from "mysql2";

const pool = mysql.createPool(
  process.env.JAWSDB_URL ?? {
    host: 'localhost',
    user: 'root',
    database: 'term_project',
    password: 'wordpass',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
);

// async / await 사용
const promisePool = pool.promise();

// select query
export const selectSql = {
  getDoctors: async () => {
    const [rows] = await promisePool.query(`select * from doctor`);
    return rows;
  },
  getNurses: async () => {
    const [rows] = await promisePool.query(`select * from nurse`);
    return rows;
  },
  getPatients: async () => {
    const [rows] = await promisePool.query(`select * from patient where patient_id < 100`);
    return rows;
  },
  getPatientsById: async (data) => {
    const [rows] = await promisePool.query(`select * from patient where patient_id = ${data.patient_id}`);
    return rows;
  },
  getPatientsByName: async (data) => {
    const [rows] = await promisePool.query(`select * from patient where name = "${data.name}"`);
    return rows;
  },
  getPatientsBySSN: async (data) => {
    const [rows] = await promisePool.query(`select * from patient where social_security_number = "${data.social_security_number}"`);
    return rows;
  },
  getPatientsByGender: async (data) => {
    const [rows] = await promisePool.query(`select * from patient where gender = "${data.gender}" limit 100`);
    return rows;
  },
  getPatientsByAddress: async (data) => {
    const [rows] = await promisePool.query(`select * from patient where address = "${data.address}"`);
    return rows;
  },
  getPatientsByBloodType: async (data) => {
    const [rows] = await promisePool.query(`select * from patient where blood_type = "${data.blood_type}" limit 100`);
    return rows;
  },
  getPatientsByHeightWeight: async (data) => {
    const [rows] = await promisePool.query(`select * from patient where height >= ${data.height} and weight >= ${data.weight} limit 100`);
    return rows;
  },
  getPatientsByPhoneNumber: async (data) => {
    const [rows] = await promisePool.query(`select * from patient where phone_number = "${data.phone_number}"`);
    return rows;
  },
  getPatientsByDoctorId: async (data) => {
    const [rows] = await promisePool.query(`select * from patient where Doctor_doctor_id = ${data.Doctor_doctor_id}`);
    return rows;
  },
  getPatientsByNurseId: async (data) => {
    const [rows] = await promisePool.query(`select * from patient where Nurse_nurse_id = ${data.Nurse_nurse_id}`);
    return rows;
  },
  getPatientsExaminationTreatment: async (data) => {
    const [rows] = await promisePool.query(`select * from patient_examination_treatment_view where patient_id = ${data.patient_id}`);
    return rows;
  },
  getDoctorsExaminationTreatment: async (data) => {
    const [rows] = await promisePool.query(`select * from patient_examination_treatment_view where doctor_id = ${data.doctor_id}`);
    return rows;
  },
  getNursesExaminationTreatment: async (data) => {
    const [rows] = await promisePool.query(`select * from patient_examination_treatment_view where nurse_id = ${data.nurse_id}`);
    return rows;
  },
  getExaminations: async () => {
    const [rows] = await promisePool.query(`select * from examination`);
    return rows;
  },
  getTreatments: async () => {
    const [rows] = await promisePool.query(`select * from treatment`);
    return rows;
  },
  getPatientsReservation: async (data) => {
    const [rows] = await promisePool.query(`select * from patient_reservation_view where Patient_patient_id=${data.patient_id}`);
    return rows;
  },
}

// insert query
export const insertSql = {
  addDoctor: async (data) => {
    try {
      // 트랜잭션 시작
      await promisePool.query("START TRANSACTION");
      // 해당 부서 ID가 doctor 테이블에 존재하는지 확인
      const [departmentCheck] = await promisePool.query(`
      select count(*) as count from doctor where Department_department_id=${data.Department_department_id}
      `);
      const departmentExists = departmentCheck[0].count > 0;

      const [doctors] = await promisePool.query(`select * from doctor`);
      const isAlreadyExistId = doctors.some((doctor) => doctor.doctor_id == data.doctor_id);
      const isAlreadyExistPhoneNumber = doctors.some((doctor) => doctor.phone_number == data.phone_number);

      if (!departmentExists) {
        await promisePool.query("ROLLBACK");
        return "invalid";
      } else if (isAlreadyExistId || isAlreadyExistPhoneNumber) {
        await promisePool.query("ROLLBACK");
        return "exist";
      } else {
        const sql = `insert into doctor values (
          "${data.doctor_id}", "${data.name}", "${data.address}", 
          "${data.phone_number}", "${data.password}", "${data.Department_department_id}"
        )`;
        console.log(data);
        await promisePool.query(sql);
        // 트랜잭션 커밋
        await promisePool.query("COMMIT");
      }
    } catch (error) {
      console.log(error);
      // 예외처리 및 트랜잭션 롤백
      await promisePool.query("ROLLBACK");
      return "error";
    }
  },

  addNurse: async (data) => {
    try {
      // 트랜잭션 시작
      await promisePool.query("START TRANSACTION");
      // 해당 부서 ID가 nurse 테이블에 존재하는지 확인
      const [departmentCheck] = await promisePool.query(`select count(*) as count from nurse where Department_department_id=${data.Department_department_id}`);
      const departmentExists = departmentCheck[0].count > 0;

      const [nurses] = await promisePool.query(`select * from nurse`);
      const isAlreadyExistId = nurses.some((nurse) => nurse.nurse_id == data.nurse_id);
      const isAlreadyExistPhoneNumber = nurses.some((nurse) => nurse.phone_number == data.phone_number);

      if (!departmentExists) {
          await promisePool.query("ROLLBACK");
          return "invalid";
      } else if (isAlreadyExistId || isAlreadyExistPhoneNumber) {
          await promisePool.query("ROLLBACK");
          return "exist";
      } else {
          const sql = `insert into nurse values (
              "${data.nurse_id}", "${data.name}", "${data.address}",
              "${data.phone_number}", "${data.password}", "${data.Department_department_id}"
          )`;
          console.log(data);
          await promisePool.query(sql);
          // 트랜잭션 커밋
          await promisePool.query("COMMIT");
      }
    } catch (error) {
      // 예외처리 및 트랜잭션 롤백
      await promisePool.query("ROLLBACK");
      return "error";
    }
  },

  addExamination: async (data) => {
    try {
      // 트랜잭션 시작
      await promisePool.query("START TRANSACTION");
      // doctor_id가 실제로 존재하는 값인지 확인
      const [doctorCheck] = await promisePool.query(
        `select count(*) as count from doctor where doctor_id=${data.Doctor_doctor_id}`
        );
      const doctorExists = doctorCheck[0].count > 0;

      // patient_id가 실제로 존재하는 값인지 확인
      const [patientCheck] = await promisePool.query(
        `select count(*) as count from patient where patient_id=${data.Patient_patient_id}`
      );
      const patientExists = patientCheck[0].count > 0;

      // doctor_id, patient_id는 복합 기본키이므로, 겹치면 안됨
      const [redundancyCheck] = await promisePool.query(
        `select count(*) as count from examination where Doctor_doctor_id=${data.Doctor_doctor_id} 
        and Patient_patient_id=${data.Patient_patient_id}`
        );
      const redundancyExists = redundancyCheck[0].count > 0;

      if (!doctorExists || !patientExists) {
        await promisePool.query("ROLLBACK");
        return "invalid";
      } else if (redundancyExists) {
        await promisePool.query("ROLLBACK");
        return "exist";
      } else {
        const sql = `insert into examination values (
            "${data.examination_date_time}", "${data.examination_details}",
            "${data.Doctor_doctor_id}", "${data.Patient_patient_id}"
        )`;
        console.log(data);
        await promisePool.query(sql);
        // 트랜잭션 커밋
        await promisePool.query("COMMIT");
      }
    } catch (error) {
      // 예외처리 및 트랜잭션 롤백
      await promisePool.query("ROLLBACK");
      return "error";
    }
  },

  addTreatment: async (data) => {
    try {
      // 트랜잭션 시작
      await promisePool.query("START TRANSACTION");
      // nurse_id가 실제로 존재하는 값인지 확인
      const [nurseCheck] = await promisePool.query(
        `select count(*) as count from nurse where nurse_id=${data.Nurse_nurse_id}`
      );
      const nurseExists = nurseCheck[0].count > 0;

      // patient_id가 실제로 존재하는 값인지 확인
      const [patientCheck] = await promisePool.query(
        `select count(*) as count from patient where patient_id=${data.Patient_patient_id}`
      );
      const patientExists = patientCheck[0].count > 0;

      // nurse_id, patient_id는 복합 기본키이므로, 겹치면 안됨
      const [redundancyCheck] = await promisePool.query(
        `select count(*) as count from treatment where Nurse_nurse_id=${data.Nurse_nurse_id} 
        and Patient_patient_id=${data.Patient_patient_id}`
      );
      const redundancyExists = redundancyCheck[0].count > 0;

      if (!nurseExists || !patientExists) {
        await promisePool.query("ROLLBACK");
        return "invalid";
      } else if (redundancyExists) {
        await promisePool.query("ROLLBACK");
        return "exist";
      } else {
        const sql = `insert into treatment values (
            "${data.treatment_date_time}", "${data.treatment_details}",
            "${data.Nurse_nurse_id}", "${data.Patient_patient_id}"
        )`;
        console.log(data);
        await promisePool.query(sql);
        // 트랜잭션 커밋
        await promisePool.query("COMMIT");
      }
    } catch (error) {
      // 예외처리 및 트랜잭션 롤백
      await promisePool.query("ROLLBACK");
      return "error";
    }
  },
  addReservation: async (data) => {
    try {
      // 트랜잭션 시작
      await promisePool.query("START TRANSACTION");
      // department_id가 실제로 존재하는 값인지 확인
      const [departmentCheck] = await promisePool.query(
        `select count(*) as count from Medical_Speciality where department_id=${data.Medical_Speciality_department_id}`
      );
      const departmentExists = departmentCheck[0].count > 0;
      // 겹치는 예약(부서번호와 예약 시간이 모두 동일한 예약)이 없는지 확인
      const [redundancyCheck] = await promisePool.query(
        `select count(*) as count from reservation where Medical_Speciality_department_id=${data.Medical_Speciality_department_id}
        and reservation_date_time="${data.reservation_date_time}"`
      );
      const redundancyExists = redundancyCheck[0].count > 0;
      // 환자가 지정한 예약 시간에 다른 예약이 존재하는지 확인
      const [anotherReservationCheck] = await promisePool.query(
        `select count(*) as count from reservation where reservation_date_time="${data.reservation_date_time}"
        and Patient_patient_id = ${data.Patient_patient_id}`
      );
      const anotherReservationExists = anotherReservationCheck[0].count > 0;
      // patient_id가 실제로 존재하는 값인지 확인
      const [patientCheck] = await promisePool.query(
        `select count(*) as count from patient where patient_id=${data.Patient_patient_id}`
      );
      const patientExists = patientCheck[0].count > 0;
  
      if (!departmentExists || !patientExists) {
        // 트랜잭션 롤백
        await promisePool.query("ROLLBACK");
        return "invalid";
      } else if (redundancyExists) {
        // 트랜잭션 롤백
        await promisePool.query("ROLLBACK");
        return "exist";
      } else if (anotherReservationExists) {
        // 트랜잭션 롤백
        await promisePool.query("ROLLBACK");
        return "another";
      } else {
        const sql = `insert into reservation(reservation_date_time, Patient_patient_id, Medical_Speciality_department_id) values (
              "${data.reservation_date_time}", "${data.Patient_patient_id}", "${data.Medical_Speciality_department_id}"
          )`;
        console.log(data);
  
        await promisePool.query(sql);
        // 트랜잭션 커밋
        await promisePool.query("COMMIT");
      }
    } catch (error) {
      console.log(error);
      // 예외처리 및 트랜잭션 롤백
      await promisePool.query("ROLLBACK");
      return "error";
    }
  },
};

// update query
export const updateSql = {
  updateDoctor: async (data) => {
    try {
      // 트랜잭션 시작
      await promisePool.query("START TRANSACTION");
      console.log(data);
      // 해당 부서 ID가 doctor 테이블에 존재하는지 확인
      const [departmentCheck] = await promisePool.query(`
        select count(*) as count from doctor where Department_department_id=${data.Department_department_id}
        `);
      const departmentExists = departmentCheck[0].count > 0;

      // 수정하려는 Phone Number가 이미 존재하는 경우
      const[phoneNumberCheck] = await promisePool.query(`select count(*) as count from doctor where phone_number = "${data.phone_number}"`);
      const isAlreadyExistPhoneNumber = phoneNumberCheck[0].count > 0;

      if (!departmentExists) {
        // 트랜잭션 롤백
        await promisePool.query("ROLLBACK");
        return "invalid";
      } else if (isAlreadyExistPhoneNumber) {
        // 트랜잭션 롤백
        await promisePool.query("ROLLBACK");
        return "exist";
      } else {
        const sql = `
        update doctor 
        set doctor_id = ${data.doctor_id}, name = "${data.name}", 
            address = "${data.address}", phone_number = "${data.phone_number}",
            password = "${data.password}", Department_department_id = ${data.Department_department_id}
        where doctor_id = ${data.doctor_id}`;
        console.log(sql);
        await promisePool.query(sql);
        // 트랜잭션 커밋
        await promisePool.query("COMMIT");
      }
    } catch (error) {
      console.log(error);
      // 예외처리 및 트랜잭션 롤백
      await promisePool.query("ROLLBACK");
      return "error";
    }
  },
  updateNurse: async (data) => {
    try {
      // 트랜잭션 시작
      await promisePool.query("START TRANSACTION");
      console.log(data);
      // 해당 부서 ID가 nurse 테이블에 존재하는지 확인
      const [departmentCheck] = await promisePool.query(`select count(*) as count from nurse where Department_department_id=${data.Department_department_id}`);
      const departmentExists = departmentCheck[0].count > 0;

      // 수정하려는 Phone Number가 이미 존재하는 경우
      const[phoneNumberCheck] = await promisePool.query(`select count(*) as count from nurse where phone_number = "${data.phone_number}"`);
      const isAlreadyExistPhoneNumber = phoneNumberCheck[0].count > 0;
  
      if (!departmentExists) {
        // 트랜잭션 롤백
        await promisePool.query("ROLLBACK");
        return "invalid";
      } else if (isAlreadyExistPhoneNumber) {
        // 트랜잭션 롤백
        await promisePool.query("ROLLBACK");
        return "exist";
      } else {
        const sql = `
        update nurse 
        set nurse_id = "${data.nurse_id}", name = "${data.name}", 
          address = "${data.address}", phone_number = "${data.phone_number}",
          password = "${data.password}", Department_department_id = "${data.Department_department_id}"
        where nurse_id = "${data.nurse_id}"`;
        console.log(sql);
        await promisePool.query(sql);
        // 트랜잭션 커밋
        await promisePool.query("COMMIT");
      }
    } catch (error) {
      // 예외처리 및 트랜잭션 롤백
      await promisePool.query("ROLLBACK");
      return "error";
    }
  },

  updateExamination: async (data) => {
    try {
      // 트랜잭션 시작
      await promisePool.query("START TRANSACTION");
      console.log(data);
      const sql = `
        update examination
        set examination_date_time = "${data.examination_date_time}", examination_details = "${data.examination_details}", 
        Doctor_doctor_id = "${data.Doctor_doctor_id}", Patient_patient_id = "${data.Patient_patient_id}"
        where Doctor_doctor_id = "${data.Doctor_doctor_id}" and Patient_patient_id = "${data.Patient_patient_id}"`;
      console.log(sql);
      await promisePool.query(sql);
      // 트랜잭션 커밋
      await promisePool.query("COMMIT");
    } catch (error) {
      // 예외처리 및 트랜잭션 롤백
      await promisePool.query("ROLLBACK");
      return "error";
    }
  },

  updateTreatment: async (data) => {
    try {
      // 트랜잭션 시작
      await promisePool.query("START TRANSACTION");
      console.log(data);
      const sql = `
        update treatment 
        set treatment_date_time = "${data.treatment_date_time}", treatment_details = "${data.treatment_details}", 
        Nurse_nurse_id = "${data.Nurse_nurse_id}", Patient_patient_id = "${data.Patient_patient_id}"
        where Nurse_nurse_id = "${data.Nurse_nurse_id}" and Patient_patient_id = "${data.Patient_patient_id}"`;
      console.log(sql);
      await promisePool.query(sql);
      // 트랜잭션 커밋
      await promisePool.query("COMMIT");
    } catch (error) {
      // 예외처리 및 트랜잭션 롤백
      await promisePool.query("ROLLBACK");
      return "error";
    }
  },
};

export const deleteSql = {
  deleteDoctor: async (data) => {
    try {
      // 트랜잭션 시작
      await promisePool.query("START TRANSACTION");
      console.log(data);
      // 해당 doctor가 관리하는 patient가 존재하는지 확인
      const [doctorCheck] = await promisePool.query(`select count(*) as count from patient p where p.Doctor_doctor_id=${data.doctor_id}`);
      const patientExists = doctorCheck[0].count > 0; // 의사가 관리하는 환자가 존재하는지 여부를 확인
      // 해당 docotr가 등록한 examination이 존재하는지 확인
      const [examinationCheck] = await promisePool.query(
        `select count(*) as count from examination e where e.Doctor_doctor_id=${data.doctor_id}`
      );
      const examinationExists = examinationCheck[0].count > 0; // 의사가 등록한 examination이 존재하는지 여부를 확인
      if (!patientExists && !examinationExists) { // 해당 Doctor가 관리하는 patient가 없고, 등록한 examination도 없는 경우에만 삭제 가능
        const sql = `delete from doctor where doctor_id = "${data.doctor_id}"`;
        console.log(sql);
        await promisePool.query(sql);
        // 트랜잭션 커밋
        await promisePool.query("COMMIT");
      } else {
        // 트랜잭션 롤백
        await promisePool.query("ROLLBACK");
        return "cannot"; // 삭제할 수 없음
      }
    } catch (error) {
      // 예외처리 및 트랜잭션 롤백
      await promisePool.query("ROLLBACK");
      return "error";
    }
  },

  deleteNurse: async (data) => {
    try {
      // 트랜잭션 시작
      await promisePool.query("START TRANSACTION");
      console.log(data);
      // 해당 nurse가 관리하는 patient가 존재하는지 확인
      const [nurseCheck] = await promisePool.query(`select count(*) as count from patient p where p.Nurse_nurse_id=${data.nurse_id}`);
      const patientExists = nurseCheck[0].count > 0; // 간호사가 관리하는 환자가 존재하는지 여부를 확인
      // 해당 nurse가 등록한 treatment가 존재하는지 확인
      const [treatmentCheck] = await promisePool.query(
        `select count(*) as count from treatment t where t.Nurse_nurse_id=${data.nurse_id}`
      );
      const treatmentExists = treatmentCheck[0].count > 0; // 간호사가 등록한 treatment가 존재하는지 여부를 확인
      if (!patientExists && !treatmentExists) { // 해당 Nurse가 관리하는 patient가 없고, 등록한 treatment도 없는 경우에만 삭제 가능
        const sql = `delete from nurse where nurse_id = "${data.nurse_id}"`;
        console.log(sql);
        await promisePool.query(sql);
        // 트랜잭션 커밋
        await promisePool.query("COMMIT");
      } else {
        // 트랜잭션 롤백
        await promisePool.query("ROLLBACK");
        return "cannot"; // 삭제할 수 없음
      }
    } catch (error) {
      // 예외처리 및 트랜잭션 롤백
      await promisePool.query("ROLLBACK");
      return "error";
    }
  },

  deleteExamination: async (data) => {
    try {
      // 트랜잭션 시작
      await promisePool.query("START TRANSACTION");
      console.log(data);
      const sql = `delete from examination 
        where Doctor_doctor_id = "${data.Doctor_doctor_id}"
        and Patient_patient_id = ${data.Patient_patient_id}`;
      console.log(sql);
      await promisePool.query(sql);
      // 트랜잭션 커밋
      await promisePool.query("COMMIT");
    } catch (error) {
      // 예외처리 및 트랜잭션 롤백
      await promisePool.query("ROLLBACK");
      return "error";
    }
  },

  deleteTreatment: async (data) => {
    try {
      // 트랜잭션 시작
      await promisePool.query("START TRANSACTION");
      console.log(data);
      const sql = `delete from treatment 
        where Nurse_nurse_id = "${data.Nurse_nurse_id}"
        and Patient_patient_id = ${data.Patient_patient_id}`;
      console.log(sql);
      await promisePool.query(sql);
      // 트랜잭션 커밋
      await promisePool.query("COMMIT");
    } catch (error) {
      // 예외처리 및 트랜잭션 롤백
      await promisePool.query("ROLLBACK");
      return "error";
    }
  },

  deleteReservation: async (data) => {
    try {
      // 트랜잭션 시작
      await promisePool.query("START TRANSACTION");
      console.log(data);
      const sql = `delete from reservation 
        where reservation_number = ${data.reservation_number}`;
      console.log(sql);
      await promisePool.query(sql);
      // 트랜잭션 커밋
      await promisePool.query("COMMIT");
    } catch (error) {
      // 예외처리 및 트랜잭션 롤백
      await promisePool.query("ROLLBACK");
      return "error";
    }
  },
}