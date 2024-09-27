from faker import Faker
import pymysql
import secrets
import string

fake = Faker()

conn = pymysql.connect(
    host='localhost',
    user='root',
    port=3306,
    password='wdrsus0520',
    database='term_project'
)

cursor = conn.cursor()
password_length = 6
inserted_count = 1 

with open('patient.sql', 'w') as sql_file:
    while inserted_count <= 200000:
        name = fake.name()
        social_security_number = fake.ssn()
        gender = fake.random_element(elements=('Male', 'Female')) 
        address = fake.address()[:45]
        blood_type = fake.random_element(elements=('A', 'B', 'AB', 'O'))
        height = fake.random_int(min=145, max=190)
        weight = fake.random_int(min=25, max=120)
        phone_number = fake.phone_number().replace("-", "")[:15]
        password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(password_length))
        doctor_id = fake.random_int(min=1, max=300)
        nurse_id = fake.random_int(min=1, max=500)

        # social_security_number와 phone_number가 unique한지 확인
        cursor.execute('select count(*) from patient where social_security_number = %s OR phone_number = %s',
                       (social_security_number, phone_number))
        existing_count = cursor.fetchone()[0]

        if existing_count == 0:
            insert_query = '''
                insert into patient
                values ({}, '{}', '{}', '{}', '{}', '{}', {}, {}, '{}', '{}', {}, {})
            '''.format(inserted_count, name, social_security_number, gender, address, blood_type,
                        height, weight, phone_number, password, doctor_id, nurse_id)
            inserted_count += 1
            sql_file.write(insert_query + ';\n')

# 변경사항 커밋
conn.commit()

# 연결 종료
conn.close()
