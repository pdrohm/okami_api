CREATE TABLE belt (
    id_belt SERIAL PRIMARY KEY,
    belt_description VARCHAR(255) NOT NULL
);


CREATE TABLE degree (
    id_degree SERIAL PRIMARY KEY,
    degree_description VARCHAR(255) NOT NULL
);

CREATE TABLE student (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    birthday DATE NOT NULL,
    email VARCHAR(100) NOT NULL,
    belt INTEGER REFERENCES belt(id_belt),
    gender VARCHAR(10),
    number VARCHAR(20),
    legal_guardian VARCHAR(100),
    obs TEXT,
    address VARCHAR(255),
    cep VARCHAR(15),
    city VARCHAR(100),
    country VARCHAR(100),
    degree INTEGER REFERENCES degree(id_degree),
    emergency_contact VARCHAR(100),
    emergency_contact_number VARCHAR(20),
    relation VARCHAR(100),
    state VARCHAR(100),
    weight DECIMAL(5, 2)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profile (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE user_profile (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    profile_id INT REFERENCES profile(id)
);


INSERT INTO belt (id_belt, belt_description) VALUES 
(1, 'Branca'),
(2, 'Azul'),
(3, 'Roxa'),
(4, 'Marrom'),
(5, 'Preta'),
(6, 'Coral'),
(11, 'Branca ponta preta'),
(12, 'Branca ponta cinza'),
(13, 'Cinza ponta preta'),
(14, 'Cinza ponta amarela'),
(15, 'Amarela ponta preta'),
(16, 'Amarela ponta laranja'),
(17, 'Laranja ponta preta'),
(18, 'Laranja ponta verde'),
(19, 'Verde ponta preta'),
(20, 'Verde ponta azul');

INSERT INTO degree (id_degree, degree_description) VALUES 
(0, '0'),
(1, '1'),
(2, '2'),
(3, '3'),
(4, '4');



INSERT INTO profile (id, name) VALUES 
(1, 'jiujitsu'),
(2, 'yoga'),
(3, 'muaythai');

