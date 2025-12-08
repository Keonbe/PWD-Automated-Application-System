-- ----------------------------------------------------------------
-- Insert Sample Data into PWD_Registry Table
-- TYPE: PROCEDURE
-- ----------------------------------------------------------------
-- Removed SQL Server-style procedure calls (EXEC/GO) to make this file MySQL-friendly.
-- Use the INSERT statements below to add sample rows in MySQL/phpMyAdmin.


-- ----------------------------------------------------------------
-- Insert Sample Data into PWD_Registry Table
-- TYPE: QUERY
-- ----------------------------------------------------------------
INSERT INTO pwd_users (
    regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, password, status
)
VALUES (
    '973821289540',              -- regNumber
    '2025-10-13',                -- regDate
    'Karamazov',                 -- lastName
    'Ivan',                      -- firstName
    'Fyodor',                    -- middleName
    'Learning Disability',       -- disability
    'b1 b2',                     -- street
    'sabang',                    -- barangay
    'dasma',                     -- municipality
    'cavite',                    -- province
    'iv a',                      -- region
    '1234567',                   -- tel
    '9123456789',                -- mobile
    'ivan@email.com',            -- email
    '2025-09-04',                -- dob
    'Male',                      -- sex
    'Filipino',                  -- nationality
    'A+',                        -- blood
    'Single',                    -- civil
    'Keanu Oneal',               -- emergencyName
    '9123456789',                -- emergencyPhone
    'Test',                      -- emergencyRelationship
    'sample-id.png',             -- proofIdentity
    'sample-medcert.png',        -- proofDisability
    '83185255',                  -- password
    'denied'                     -- status
);

-- Verify insert
SELECT * FROM pwd_users WHERE regNumber = '973821289540';

-- More sample data
INSERT INTO pwd_users (
    regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, password, status
)
VALUES (
    '973821289541',              -- regNumber
    '2025-10-14',                -- regDate
    'Dela Cruz',                 -- lastName
    'Juan',                      -- firstName
    'Santos',                    -- middleName
    'Visual Impairment',         -- disability
    '123 Main Street',           -- street
    'Poblacion',                 -- barangay
    'Imus',                      -- municipality
    'Cavite',                    -- province
    'iv a',                      -- region
    '2345678',                   -- tel
    '9123456790',                -- mobile
    'juan.delacruz@email.com',   -- email
    '1990-05-15',                -- dob
    'Male',                      -- sex
    'Filipino',                  -- nationality
    'O+',                        -- blood
    'Married',                   -- civil
    'Maria Dela Cruz',           -- emergencyName
    '9123456791',                -- emergencyPhone
    'Spouse',                    -- emergencyRelationship
    'juan-id.png',               -- proofIdentity
    'juan-medcert.png',          -- proofDisability
    '12345678',               -- password
    'accepted'                   -- status
);

-- Verify insert
SELECT * FROM pwd_users WHERE regNumber = '973821289541';


-- ----------------------------------------------------------------
-- Additional User Sample Data for PWD_Registry Table
-- TYPE: QUERY
-- ----------------------------------------------------------------
-- Additional User 1
INSERT INTO pwd_users (
    regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, password, status
)
VALUES (
    '973821289542',
    '2025-12-07',
    'Kafka',
    'Franz',
    'M',
    'Hearing Impairment',
    'b1 b2',
    'Fatima I',
    'Dasmariñas',
    'Cavite',
    'IV-A',
    '046-111-2222',
    '09171234501',
    'franz.kafka@test.com',
    '1985-04-20',
    'Male',
    'Filipino',
    'A-',
    'Single',
    'Milena',
    '09179876501',
    'Spouse',
    'sample-id.png',
    'sample-medcert.png',
    '23456789',
    'pending'
);

-- Additional User 2
INSERT INTO pwd_users (
    regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, password, status
)
VALUES (
    '973821289543',
    '2025-12-07',
    'Nietzsche',
    'Friedrich',
    'Wilhelm',
    'Mobility Impairment',
    'b1 b2',
    'Fatima I',
    'Dasmariñas',
    'Cavite',
    'IV-A',
    '046-222-3333',
    '09171234502',
    'friedrich.nietzsche@test.com',
    '1992-08-11',
    'Female',
    'Filipino',
    'B+',
    'Married',
    'Peter Gast',
    '09179876502',
    'Friend',
    'sample-id.png',
    'sample-medcert.png',
    '34567890',
    'accepted'
);


-- Additional User 3
INSERT INTO pwd_users (
    regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, password, status
)
VALUES (
    '973821289544',
    '2025-12-07',
    'Hesse',
    'Hermann',
    'Karl',
    'Intellectual Disability',
    'b1 b2',
    'Fatima I',
    'Dasmariñas',
    'Cavite',
    'IV-A',
    '046-333-4444',
    '09171234503',
    'hesse@test.com',
    '1988-02-02',
    'Male',
    'Filipino',
    'O-',
    'Single',
    'Ninon Hesse',
    '09179876503',
    'Wife',
    'sample-id.png',
    'sample-medcert.png',
    '45678901',
    'denied'
);

-- Additional User 4
INSERT INTO pwd_users (
    regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, password, status
)
VALUES (
    '973821289545',
    '2025-12-07',
    'Bach',
    'Johann',
    'Sebastian',
    'Speech Impairment',
    'b1 b2',
    'Fatima I',
    'Dasmariñas',
    'Cavite',
    'IV-A',
    '046-444-5555',
    '09171234504',
    'johann.bach@test.com',
    '1979-11-30',
    'Female',
    'Filipino',
    'AB+',
    'Widowed',
    'Antonio Vivaldi',
    '09179876504',
    'Friend',
    'sample-id.png',
    'sample-medcert.png',
    '56789012',
    'accepted'
);

-- Additional User 5
INSERT INTO pwd_users (
    regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, password, status
)
VALUES (
    '973821289546',
    '2025-12-07',
    'Pessoa',
    'Fernando',
    'de Seabra',
    'Visual Impairment',
    'b1 b2',
    'Fatima I',
    'Dasmariñas',
    'Cavite',
    'IV-A',
    '046-555-6666',
    '09171234505',
    'fernando.pessoa@test.com',
    '1995-07-07',
    'Male',
    'Filipino',
    'O+',
    'Single',
    'Senor Vasques',
    '09179876505',
    'Boss',
    'sample-id.png',
    'sample-medcert.png',
    '67890123',
    'pending'
);

-- Verify new inserts
SELECT regNumber, firstName, lastName, email, status FROM pwd_users
WHERE regNumber BETWEEN '973821289542' AND '973821289546'
ORDER BY regNumber;

