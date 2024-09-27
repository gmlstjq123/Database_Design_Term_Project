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

with open('nurse.sql', 'w') as sql_file:
    while inserted_count <= 500:
        name = fake.name()
        address = fake.address()[:45]
        phone_number = fake.phone_number()[:15]
        password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(password_length))
        department_id = fake.random_int(min=1, max=10)

        # phone_number가 unique한지 확인
        cursor.execute('select count(*) from nurse where phone_number = %s', (phone_number))
        existing_count = cursor.fetchone()[0]

        if existing_count == 0:
            insert_query = '''
                insert into nurse
                values ({}, '{}', '{}', '{}', '{}', {});
            '''.format(inserted_count, name, address, phone_number, password, department_id)
            inserted_count += 1
            sql_file.write(insert_query)

# 변경사항 커밋
conn.commit()

# 연결 종료
conn.close()
