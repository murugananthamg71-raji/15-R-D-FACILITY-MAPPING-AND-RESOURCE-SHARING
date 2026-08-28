BEGIN;

-- Supplied EEE and Mechanical laboratory records. Run after schema.sql and laboratory_migration.sql.
WITH labs(name, code, department, semester, regulation, batch_size, description, location) AS (VALUES
('Digital System Design','24PEC201','ECE','III','R2024',30,'Existing ECE course laboratory record.','ECE Block'),
('Linear Integrated Circuits','24PEE302','ECE','III','R2024',30,'Existing ECE course laboratory record.','ECE Block'),
('Control Systems','24PEE503','ECE','III','R2024',30,'Existing ECE course laboratory record.','ECE Block'),
('Microcontroller and its Applications','24PEC411','ECE','IV','R2024',30,'Existing ECE course laboratory record.','ECE Block'),
('VLSI Design','24PEC504','ECE','IV','R2024',30,'Existing ECE course laboratory record.','ECE Block'),
('Analog Integrated Circuits','24PEC403','ECE','IV','R2024',30,'Additional ECE course laboratory record.','ECE Block'),
('Analog and Digital Communication Systems','24PEC412','ECE','IV','R2024',30,'Additional ECE course laboratory record.','ECE Block'),
('Analog and Digital Communication','24PEC401','ECE','IV','R2024',30,'Additional ECE course laboratory record.','ECE Block'),
('Embedded Systems and IoT','24PEC502','ECE','V','R2024',30,'Additional ECE course laboratory record.','ECE Block'),
('Digital Signal Processing','24PEC503','ECE','V','R2024',30,'Additional ECE course laboratory record.','ECE Block'),
('Electric Circuits Laboratory','EE3271','EEE','II','R2021',30,'EEE laboratory inventory supplied by the department.','EEE Block'),
('Electronic Devices and Circuits Laboratory','EC3311','EEE','III','R2021',30,'EEE laboratory inventory supplied by the department.','EEE Block'),
('Electrical Machines Laboratory - I','EE3311','EEE','III','R2021',30,'EEE laboratory inventory supplied by the department.','EEE Block'),
('C Programming and Data Structures Laboratory','CS3362','EEE','III','R2021',30,'EEE laboratory inventory supplied by the department.','EEE Block'),
('Electrical Machines Laboratory - II','EE3411','EEE','IV','R2021',30,'EEE laboratory inventory supplied by the department.','EEE Block'),
('Linear and Digital Circuits Laboratory','EE3412','EEE','IV','R2021',30,'EEE laboratory inventory supplied by the department.','EEE Block'),
('Microprocessor and Microcontroller Laboratory','EE3413','EEE','IV','R2021',30,'EEE laboratory inventory supplied by the department.','EEE Block'),
('Control and Instrumentation Laboratory','EE3512','EEE','V','R2021',30,'EEE laboratory inventory supplied by the department.','EEE Block'),
('Power Electronics Laboratory','EE3511','EEE','V','R2021',30,'EEE laboratory inventory supplied by the department.','EEE Block'),
('Power System Laboratory','EE3611','EEE','VI','R2021',30,'EEE laboratory inventory supplied by the department.','EEE Block'),
('Engineering Practices Laboratory','GE3271','EEE','II','R2021',30,'Common engineering practices inventory supplied by the department.','Central Laboratory'),
('Basic Electrical and Electronics Engineering Laboratory','BE3271','MECH','II','R2021',30,'Mechanical Engineering laboratory inventory supplied by the department.','Mechanical Block'),
('Fluid Mechanics and Machinery','24PME304','MECH','III','R2024',30,'Mechanical Engineering laboratory inventory supplied by the department.','Mechanical Block'),
('Thermal Engineering','24PME404','MECH','IV','R2024',30,'Mechanical Engineering laboratory inventory supplied by the department.','Mechanical Block'),
('Strength of Materials','24PME405','MECH','IV','R2024',30,'Mechanical Engineering laboratory inventory supplied by the department.','Mechanical Block'),
('Theory of Machines','24PME406','MECH','IV','R2024',30,'Mechanical Engineering laboratory inventory supplied by the department.','Mechanical Block'),
('Manufacturing Technology','24PME401','MECH','IV','R2024',30,'Mechanical Engineering laboratory inventory supplied by the department.','Mechanical Block'),
('Heat and Mass Transfer','24PME502','MECH','V','R2024',30,'Mechanical Engineering laboratory inventory supplied by the department.','Mechanical Block'),
('Metrology and Measurements','24PME503','MECH','V','R2024',30,'Mechanical Engineering laboratory inventory supplied by the department.','Mechanical Block'),
('Computer Aided Modeling Laboratory','24EME501','MECH','V','R2024',30,'Mechanical Engineering laboratory inventory supplied by the department.','Mechanical Block'),
('Mechatronics','24PME603','MECH','VI','R2024',30,'Mechanical Engineering laboratory inventory supplied by the department.','Mechanical Block'),
('Mechatronics and IoT Laboratory','ME3781','MECH','VII','R2021',30,'Mechanical Engineering laboratory inventory supplied by the department.','Mechanical Block')
)
INSERT INTO facilities (name, department_id, type, description, location, capacity, availability, responsible_faculty, contact, course_code, regulation, semester, batch_size)
SELECT labs.name, d.id, 'Laboratory', labs.description, labs.location, labs.batch_size || ' students', 'Available', 'Faculty of ' || d.name, 'research@college.edu', labs.code, labs.regulation, labs.semester, labs.batch_size FROM labs JOIN departments d ON d.code = labs.department
ON CONFLICT (course_code) WHERE course_code IS NOT NULL DO UPDATE SET name=EXCLUDED.name, department_id=EXCLUDED.department_id, description=EXCLUDED.description, location=EXCLUDED.location, semester=EXCLUDED.semester, regulation=EXCLUDED.regulation, batch_size=EXCLUDED.batch_size, updated_at=NOW();

WITH inventory(course_code, name, required_quantity, available_quantity, unit) AS (VALUES
('24PEC403','ICs: IC741, IC555',15,15,'each'),('24PEC403','Resistor, Capacitor, Inductor',20,20,'each'),('24PEC403','CRO',6,6,'units'),('24PEC403','Function Generator',6,6,'units'),('24PEC403','Regulated Power Supplies',6,6,'units'),('24PEC403','Digital Multi-meter',6,6,'units'),('24PEC403','Bread Board',10,10,'units'),('24PEC403','Transistors',15,15,'units'),('24PEC403','IC Tester',1,1,'units'),('24PEC403','Standalone PC with SPICE software',10,10,'units'),
('24PEC412','Sampling and reconstruction Kit',2,2,'units'),('24PEC412','Pulse Modulation Kit',2,2,'units'),('24PEC412','Delta Modulation and Demodulation Kit',2,2,'units'),('24PEC412','Digital Modulation and Demodulation Kit',2,2,'units'),('24PEC412','Function Generator',6,6,'units'),('24PEC412','CRO/DSO (50 MHz)',6,6,'units'),('24PEC412','Standalone PCs loaded with MATLAB software',10,10,'units'),
('24PEC401','Sampling and reconstruction Kit',2,2,'units'),('24PEC401','Pulse Modulation Kit',2,2,'units'),('24PEC401','Delta Modulation and Demodulation Kit',2,2,'units'),('24PEC401','Digital Modulation and Demodulation Kit',2,2,'units'),('24PEC401','Function Generator',6,6,'units'),('24PEC401','CRO/DSO (50 MHz)',6,6,'units'),('24PEC401','Standalone PCs loaded with MATLAB software',10,10,'units'),
('24PEC502','LPC2148 Kit',6,6,'units'),('24PEC502','Buzzer',5,5,'units'),('24PEC502','Matrix Keypad',5,5,'units'),('24PEC502','Temperature Sensors',5,5,'units'),('24PEC502','Standalone PCs',30,30,'units'),('24PEC502','Keil Software',30,30,'users'),
('24PEC503','Standalone PCs',30,30,'units'),('24PEC503','MATLAB Software',30,30,'users'),
('24PME304','Venturimeter',1,1,'units'),('24PME304','Orifice Meter',1,1,'units'),('24PME304','Rotameter',1,1,'units'),('24PME304','Centrifugal Pump',1,1,'units'),('24PME304','Reciprocating Pump',1,1,'units'),('24PME304','Francis Turbine',1,1,'units'),('24PME304','Friction Factor Apparatus',1,1,'units'),
('24PME404','Apparatus for Flash and Fire Point',1,1,'units'),('24PME404','Apparatus for Viscosity of Lubricating Oil',1,1,'units'),('24PME404','I.C Engine - 2 Stroke and 4 Stroke Model',1,1,'units'),('24PME404','Heat Balance Test on IC Engine Setup',1,1,'units'),('24PME404','Air Compressor Setup',1,1,'units'),('24PME404','Air Blowers Setup',1,1,'units'),('24PME404','4-Stroke Diesel Engine with Mechanical Loading',1,1,'units'),
('24PME405','Universal Testing Machine',1,1,'units'),('24PME405','Torsion Test Setup',1,1,'units'),('24PME405','Impact Test - Izod Setup',1,1,'units'),('24PME405','Impact Test - Charpy Setup',1,1,'units'),('24PME405','Brinell and Rockwell Hardness Setup',1,1,'units'),('24PME405','Cantilever Beam Setup',1,1,'units'),('24PME405','Simply Supported Beam Setup',1,1,'units'),('24PME405','Tension Closed Coiled Helical Spring Setup',1,1,'units'),('24PME405','Compression Open Coiled Helical Spring Setup',1,1,'units'),
('24PME406','Governor Apparatus - Watt, Porter, Proell and Hartnell Governors',1,1,'units'),('24PME406','Cam Follower Setup',1,1,'units'),('24PME406','Motorised Gyroscope Setup',1,1,'units'),('24PME406','Whirling of Shaft Apparatus Setup',1,1,'units'),('24PME406','Balancing of Rotating and Reciprocating Masses Setup',1,1,'units'),('24PME406','Spring Mass Vibration System Setup',1,1,'units'),('24PME406','Compound Pendulum and Fly Wheel Apparatus',1,1,'units'),('24PME406','Torsional Vibration of Single Rotor System Setup',1,1,'units'),
('24PME401','Shaper',1,2,'units'),('24PME401','Vertical Milling Machine',1,1,'units'),('24PME401','Radial Drilling Machine',1,1,'units'),('24PME401','Surface Grinding Machine',1,1,'units'),('24PME401','Horizontal Milling Machine',1,1,'units'),('24PME401','CNC Turning Machine',1,1,'units'),
('24PME502','Lagged Pipe Apparatus',1,1,'units'),('24PME502','Thermal Conductivity of Insulating Powder Apparatus',1,1,'units'),('24PME502','Composite Wall Apparatus',1,1,'units'),('24PME502','Natural Convection Vertical Cylinder Apparatus',1,1,'units'),('24PME502','Forced Convection Inside Tube Apparatus',1,1,'units'),('24PME502','Pin Fin Apparatus',1,1,'units'),('24PME502','Stefan Boltzmann Apparatus',1,1,'units'),('24PME502','Emissivity Measurement Apparatus',1,1,'units'),('24PME502','Refrigeration Test Rig',1,1,'units'),
('24PME503','Vernier Caliper',5,5,'units'),('24PME503','Micrometer',5,5,'units'),('24PME503','Dial Gauge',5,5,'units'),('24PME503','Vernier Height Gauge',2,2,'units'),('24PME503','Sine Bar',3,3,'units'),('24PME503','Bevel Protractor',1,1,'units'),('24PME503','Mechanical Comparator',1,1,'units'),('24PME503','Gear Tooth Vernier Caliper',2,2,'units'),
('24EME501','Computer Server',1,1,'units'),('24EME501','Computer Systems Networked to the Server',30,30,'units'),('24EME501','Licensed Software for Drafting and Modeling',30,30,'licenses'),('24EME501','Laser Printer',1,1,'units'),
('24PME603','Linear/Angular Measuring Transducer Setup',1,1,'units'),('24PME603','Pressure, Temperature and Force Measuring Transducer Setup',1,1,'units'),('24PME603','Speed and Direction Control of Induction Motors Setup',1,1,'units'),('24PME603','IoT Trainer Kit',1,1,'units'),('24PME603','Water Level Measurement Tank with Controller (VPAT-06IOT)',1,1,'units'),('24PME603','Conveyor Setup with Controller (VPAT-24P IOT)',1,1,'units'),
('ME3781','Linear/Angular Measuring Transducer Setup',1,1,'units'),('ME3781','Pressure, Temperature and Force Measuring Transducer Setup',1,1,'units'),('ME3781','Speed and Direction Control of Induction Motors Setup',1,1,'units'),('ME3781','Basic Pneumatic Trainer Kit',1,1,'units'),('ME3781','IoT Trainer Kit',1,1,'units'),('ME3781','Water Level Measurement Tank with Controller (VPAT-06IOT)',1,1,'units'),('ME3781','Conveyor Setup with Controller (VPAT-24P IOT)',1,1,'units'),('ME3781','Addition, Subtraction and Multiplication Programming in 8051',1,1,'units'),('ME3781','Stepper Motor and DC Motor using 8051/PLC',1,1,'units'),('ME3781','Traffic Light Interface using 8051',1,1,'units'),
('BE3271','Basic Electrical and Electronics Engineering Laboratory Equipment',NULL,NULL,'notes')
)
INSERT INTO equipment (name, department_id, category, model, description, quantity, location, availability, responsible_faculty, contact, lab_id, required_quantity, available_quantity, unit, course_code, semester)
SELECT i.name, d.id, 'Laboratory Equipment', 'Supplied inventory', 'Supplied laboratory inventory.', GREATEST(COALESCE(i.available_quantity, 1), 1)::INTEGER, f.location, 'Available', f.responsible_faculty, f.contact, f.id, i.required_quantity, i.available_quantity, i.unit, f.course_code, f.semester
FROM inventory i JOIN facilities f ON f.course_code=i.course_code JOIN departments d ON d.id=f.department_id
WHERE NOT EXISTS (SELECT 1 FROM equipment e WHERE e.lab_id=f.id AND e.name=i.name);

COMMIT;
