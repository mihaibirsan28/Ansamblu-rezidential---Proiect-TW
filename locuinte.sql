CREATE DATABASE locuinte ENCODING 'UTF-8' LC_COLLATE 'ro-RO-x-icu' LC-CTYPE 'ro_RO' TEMPLATE template0;

CREATE USER birsan WITH ENCRYPTED PASSWORD 'proiect';
GRANT ALL PRIVILEGES ON DATABASE LOCUINTE TO birsan;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA PUBLIC TO birsan;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO birsan;

CREATE TYPE tipuri_locuinta AS ENUM ('apartament', 'garsoniera', 'duplex');
CREATE TYPE stadiu_constructie_loc AS ENUM ('la rosu', 'la gri', 'terminat');
--CREATE TYPE mobilare AS ENUM ('bucatarie mobilata', 'baie mobilata', 'hol mobilat', 'camere mobilate');

CREATE TABLE IF NOT EXISTS locuinte (
  id serial PRIMARY KEY,
  nume VARCHAR(50) UNIQUE NOT NULL,
  descriere TEXT,  
  imagine VARCHAR(300),
  tip_locuinta tipuri_locuinta DEFAULT 'apartament',
  stadiu_constructie stadiu_constructie_loc DEFAULT 'terminat',
  pret NUMERIC(8,2) NOT NULL,
  suprafata INT NOT NULL CHECK (suprafata > 0),
  data_terminare_locuinta TIMESTAMP DEFAULT current_timestamp,
  etaj INT NOT NULL CHECK (etaj >= 0),
  mobilat VARCHAR[],
  bucatarie_open_space BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO locuinte ( nume, descriere, imagine, tip_locuinta, stadiu_constructie, pret, suprafata, data_terminare_locuinta, etaj, mobilat, bucatarie_open_space) VALUES
('Apartament cu 2 camere 50mp','Apartament cu 2 camere utilat complet, perfect pentru orice tanar la inceput de drumuri, intr-o zona ce se afla intr-o continua dezvoltare.', 'apartament_2camere_50mp.jpg', 'apartament', 'terminat', 53000.00, 50, '2020-09-12', 5, 
'{"bucatarie mobilata","baie mobilata","hol mobilata","camere mobilata"}', FALSE),

('Apartament cu 2 camere 61mp', 'Apartament cu 2 camere utilat complet cu o terasa de 5mp, perfect pentru orice tanar la inceput de drum sau o familie in formare.', 'apartament_2camere_61mp.jpg', 'apartament', 'terminat', 59000.00, 61, '2021-03-01', 3,
'{"bucatarie mobilata","baie mobilata","hol mobilata","camere mobilata"}', TRUE),

('Apartament cu 2 camere 55mp', 'Apartament cu 2 camere utilat complet cu o terasa de 3mp, perfect pentru orice tanar la inceput de drum.', 'apartament_2camere_55mp.jpg', 'apartament', 'la gri', 54000.00, 55, '2021-09-01', 6,
'{"bucatarie mobilata","baie mobilata"}', TRUE),

('Apartament cu 3 camere 72mp', 'Apartament cu 3 camere utilat complet cu o terasa de 5mp, perfect pentru orice familie la inceput de drum.', 'apartament_3camere_72mp.jpg', 'apartament', 'terminat', 67000.00, 72, '2021-03-21', 3,
'{"bucatarie mobilata","baie mobilata"}', FALSE),

('Apartament cu 3 camere 80mp', 'Apartament cu 3 camere utilat complet cu o terasa de 5mp, perfect pentru o familie cu 1 sau 2 copii, utilat complet.', 'apartament_3camere_80mp.jpg', 'apartament', 'terminat', 70000.00, 80, '2021-08-18', 1,
'{"bucatarie mobilata","baie mobilata","hol mobilata","camere mobilata"}', TRUE),

('Apartament cu 3 camere 85mp', 'Apartament cu 3 camere utilat complet cu o terasa de 5mp, perfect pentru o familie cu 1 sau 2 copii.', 'apartament_3camere_85mp.jpg', 'apartament', 'la gri', 65000.00, 85, '2022-02-18', 6,
'{"baie mobilata"}', TRUE),

('Apartament cu 4 camere 100mp', 'Apartament cu 4 camere utilat complet cu o terasa de 8mp, perfect pentru o familie ce isi cauta o locuinta mai mare.', 'apartament_4camere_100mp.jpg', 'apartament', 'terminat', 90000.00, 100, '2021-08-09', 1,
'{"bucatarie mobilata","baie mobilata","hol mobilata","camere mobilata"}', TRUE),

('Apartament cu 4 camere 109mp', 'Apartament cu 4 camere utilat complet cu o terasa de 11mp, perfect pentru o familie ce isi cauta o locuinta mai mare.', 'apartament_4camere_109mp.jpg', 'apartament', 'terminat', 95000.00, 109, '2021-06-15', 5,
'{"bucatarie mobilata","baie mobilata"}', TRUE),

('Apartament cu 4 camere 105mp', 'Apartament cu 4 camere cu o terasa de 10mp, perfect pentru o familie ce isi cauta o locuinta mai mare.', 'apartament_4camere_105mp.jpg', 'apartament', 'la rosu', 82000.00, 105, '2022-11-09', 7,
'{"bucatarie mobilata"}', FALSE),

('Apartament cu 4 camere 119mp', 'Apartament cu 4 camere utilat complet cu o terasa de 8mp, perfect pentru o familie ce isi cauta o locuinta mai mare.', 'apartament_4camere_119mp.jpg', 'apartament', 'terminat', 105000.00, 100, '2021-08-09', 1,
'{"bucatarie mobilata","baie mobilata","hol mobilata","camere mobilata"}', TRUE),

('Garsoniera 30mp', 'Garsoniera cu o camera, baie si bucatarie, ideala pentru un tanar ce se afla la inceputul carierei.', 'garsoniera_30mp.jpg', 'garsoniera', 'terminat', 30000.00, 30, '2021-02-15', 0,
'{"baie mobilata"}', FALSE),

('Garsoniera 35mp', 'Garsoniera cu o camera, baie si bucatarie, ideala pentru un tanar ce se afla la inceputul carierei.', 'garsoniera_35mp.jpg', 'garsoniera', 'la rosu', 32000.00, 35, '2022-05-15', 0,
'{"baie mobilata"}', FALSE),

('Garsoniera 40mp', 'Garsoniera cu o camera, baie, bucatarie si balcon de 2mp, ideala pentru un tanar ce se afla la inceputul carierei.', 'garsoniera_40mp.jpg', 'garsoniera', 'la gri', 37000.00, 40, '2021-08-21', 0,
'{}', FALSE),

('Garsoniera 45mp', 'Garsoniera cu o camera, baie, bucatarie si balcon de 4mp, ideala pentru un tanar ce se afla la inceputul carierei.', 'garsoniera_45mp.jpg', 'garsoniera', 'terminat', 42000.00, 45, '2021-03-15', 0,
'{"bucatarie mobilata", "baie mobilata"}', FALSE),

('Duplex 120mp', 'Duplex alcatuit din: o bucatarie, o baie si un living la parter, 2 camere si o baie la etaj si o curte de 30mp.', 'duplex_120mp.jpg', 'duplex', 'terminat', 90000.00, 120, '2021-07-08', 0,
'{"bucatarie mobilata","baie mobilata","hol mobilata","camere mobilata"}', FALSE),

('Duplex 130mp', 'Duplex alcatuit din: o bucatarie, o baie si un living la parter, 2 camere si o baie la etaj si o curte de 40mp.', 'duplex_130mp.jpg', 'duplex', 'terminat', 10000.00, 130, '2021-09-08', 0,
'{"bucatarie mobilata","baie mobilata","hol mobilata","camere mobilata"}', TRUE),

('Duplex 138mp', 'Duplex alcatuit din: o bucatarie, o baie si un living la parter, 2 camere si 2 bai la etaj si o curte de 40mp.', 'duplex_138mp.jpg', 'duplex', 'la gri', 102000.00, 138, '2021-12-10', 0,
'{"bucatarie mobilata","baie mobilata"}', FALSE),

('Duplex 140mp', 'Duplex alcatuit din: o bucatarie, o baie si un living la parter, 3 camere si 2 bai la etaj si o curte de 45mp.', 'duplex_140mp.jpg', 'duplex', 'terminat', 110000.00, 140, '2021-07-08', 0,
'{"bucatarie mobilata","baie mobilata","hol mobilata","camere mobilata"}', FALSE),

('Duplex 160mp', 'Duplex alcatuit din: o bucatarie, 2 baie, o camera si un living la parter, 3 camere si 3 bai la etaj si o curte de 60mp.', 'duplex_160mp.jpg', 'duplex', 'terminat', 130000.00, 160, '2021-05-08', 0,
'{"bucatarie mobilata","baie mobilata","hol mobilata","camere mobilata"}', TRUE);

