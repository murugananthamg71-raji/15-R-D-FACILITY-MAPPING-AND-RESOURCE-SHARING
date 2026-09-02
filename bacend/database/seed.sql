INSERT INTO departments (name, code, description) VALUES
('Information Technology','IT','Information systems, cloud platforms, and cybersecurity.'),
('Computer Science and Engineering','CSE','Software systems, data science, and intelligent computing.'),
('Electronics and Communication Engineering','ECE','Embedded systems, VLSI, and communication technology.'),
('Electrical and Electronics Engineering','EEE','Power electronics, automation, and renewable energy.'),
('Mechanical Engineering','MECH','CAD/CAM, manufacturing, and robotics and automation.'),
('Artificial Intelligence and Data Science','AIDS','Artificial intelligence, machine learning, and data science.')
ON CONFLICT (code) DO NOTHING;

INSERT INTO users (name,email,password_hash,role,department_id) VALUES
('Demo Student','student@college.edu','$2b$12$0p7H1wrIzFwvIdYzrlozreNqShv7AYRt7DceZ2MjiClVc2vRdAbTW','student',(SELECT id FROM departments WHERE code='CSE')),
('Demo Faculty','faculty@college.edu','$2b$12$0p7H1wrIzFwvIdYzrlozreNqShv7AYRt7DceZ2MjiClVc2vRdAbTW','faculty',(SELECT id FROM departments WHERE code='CSE')),
('Lab Technician','lab.technician@college.edu','$2b$12$0p7H1wrIzFwvIdYzrlozreNqShv7AYRt7DceZ2MjiClVc2vRdAbTW','lab_technician',(SELECT id FROM departments WHERE code='IT')),
('Portal Administrator','admin@college.edu','$2b$12$0p7H1wrIzFwvIdYzrlozreNqShv7AYRt7DceZ2MjiClVc2vRdAbTW','admin',(SELECT id FROM departments WHERE code='IT'))
ON CONFLICT (email) DO NOTHING;

INSERT INTO facilities (name,department_id,type,description,location,capacity,availability,responsible_faculty,contact) VALUES
('AI and Machine Learning Lab',(SELECT id FROM departments WHERE code='IT'),'Laboratory','Demo workspace for applied AI and machine learning.','IT Block, Room 204','30 researchers','Available','Sample Faculty A','research@college.edu'),
('Cybersecurity Lab',(SELECT id FROM departments WHERE code='IT'),'Research Facility','Controlled environment for security testing and digital forensics.','IT Block, Room 118','24 researchers','Available','Sample Faculty B','research@college.edu'),
('Data Science Lab',(SELECT id FROM departments WHERE code='CSE'),'Laboratory','Workspace for analytics, visualization, and statistical modelling.','CSE Block, Room 212','32 researchers','Available','Sample Faculty C','research@college.edu'),
('Software Engineering Lab',(SELECT id FROM departments WHERE code='CSE'),'Laboratory','Collaborative environment for software architecture and testing.','CSE Block, Room 106','28 researchers','Limited','Sample Faculty D','research@college.edu'),
('High Performance Computing Facility',(SELECT id FROM departments WHERE code='CSE'),'Computing Facility','GPU-enabled demo capacity for simulation and large-scale analysis.','CSE Technology Centre','64 users','Available','Sample Faculty E','research@college.edu'),
('Embedded Systems Lab',(SELECT id FROM departments WHERE code='ECE'),'Laboratory','Hardware and firmware development environment.','ECE Block, Room 220','24 researchers','Available','Sample Faculty F','research@college.edu'),
('Communication Systems Lab',(SELECT id FROM departments WHERE code='ECE'),'Research Facility','Demo workspace for wireless and signal processing experiments.','ECE Block, Room 118','20 researchers','Limited','Sample Faculty G','research@college.edu'),
('Power Electronics Lab',(SELECT id FROM departments WHERE code='EEE'),'Laboratory','Converters, drives, and control systems research workspace.','EEE Block, Room 106','22 researchers','Available','Sample Faculty H','research@college.edu'),
('Renewable Energy Research Facility',(SELECT id FROM departments WHERE code='EEE'),'Research Facility','Demo test environment for solar, storage, and energy monitoring.','EEE Energy Systems Lab','18 researchers','Limited','Sample Faculty I','research@college.edu'),
('CAD/CAM Laboratory',(SELECT id FROM departments WHERE code='MECH'),'Computing Facility','Engineering modelling and manufacturing software workspace.','Mechanical Block, Design Studio','30 researchers','Available','Sample Faculty J','research@college.edu'),
('Manufacturing Lab',(SELECT id FROM departments WHERE code='MECH'),'Testing Facility','Demo workshop for fabrication and process studies.','Mechanical Block, Bay 1','20 researchers','Limited','Sample Faculty K','research@college.edu'),
('Robotics and Automation Lab',(SELECT id FROM departments WHERE code='MECH'),'Research Facility','Collaborative space for robotic systems and automation experiments.','Mechanical Block, Bay 3','26 researchers','Available','Sample Faculty L','research@college.edu');

INSERT INTO equipment (name,department_id,category,model,description,quantity,location,availability,responsible_faculty,contact) VALUES
('Cloud Computing Resources',(SELECT id FROM departments WHERE code='IT'),'Cloud Computing','Demo Cloud Platform','Demo infrastructure for distributed systems research.',1,'IT Server Room','Limited','Sample Faculty A','research@college.edu'),
('Network Security Appliance',(SELECT id FROM departments WHERE code='IT'),'Cybersecurity','Demo NSA-01','Sandbox appliance for security exercises.',2,'IT Block, Room 118','Available','Sample Faculty B','research@college.edu'),
('Data Analytics Workstation',(SELECT id FROM departments WHERE code='CSE'),'Data Science','Demo DAW-01','Workstation for analytics and visualization.',8,'CSE Block, Room 212','Available','Sample Faculty C','research@college.edu'),
('High Performance Computing System',(SELECT id FROM departments WHERE code='CSE'),'Computing','Demo HPC-01','GPU-enabled system for compute-intensive research.',4,'CSE Technology Centre','Available','Sample Faculty E','research@college.edu'),
('Software Testing Suite',(SELECT id FROM departments WHERE code='CSE'),'Software Engineering','Demo STS-01','Tools for application testing demonstrations.',10,'CSE Block, Room 106','Limited','Sample Faculty D','research@college.edu'),
('FPGA Development Kit',(SELECT id FROM departments WHERE code='ECE'),'VLSI','Demo FPGA-01','Reconfigurable hardware for digital systems research.',12,'ECE Block, Room 212','Available','Sample Faculty F','research@college.edu'),
('Oscilloscope',(SELECT id FROM departments WHERE code='ECE'),'Embedded Systems','Demo OSC-01','Precision measurement equipment for signal analysis.',4,'ECE Block, Room 220','Available','Sample Faculty F','research@college.edu'),
('IoT Sensor Kit',(SELECT id FROM departments WHERE code='ECE'),'Communication Systems','Demo IOT-01','Modular kits for connected-system prototyping.',18,'ECE Block, Room 118','Limited','Sample Faculty G','research@college.edu'),
('Power Converter Trainer',(SELECT id FROM departments WHERE code='EEE'),'Power Electronics','Demo PCT-01','Training platform for converters and control research.',3,'EEE Block, Room 106','Available','Sample Faculty H','research@college.edu'),
('Thermal Camera',(SELECT id FROM departments WHERE code='EEE'),'Renewable Energy','Demo TC-01','Thermal inspection camera for energy systems research.',2,'EEE Energy Systems Lab','Available','Sample Faculty I','research@college.edu'),
('Electrical Machines Trainer',(SELECT id FROM departments WHERE code='EEE'),'Electrical Machines','Demo EMT-01','Demonstration platform for electromechanical studies.',2,'EEE Block, Room 128','Limited','Sample Faculty H','research@college.edu'),
('3D Printer',(SELECT id FROM departments WHERE code='MECH'),'Manufacturing','Demo 3DP-01','Additive manufacturing equipment for rapid prototyping.',1,'Mechanical Block, Bay 2','Available','Sample Faculty K','research@college.edu'),
('CNC Machine',(SELECT id FROM departments WHERE code='MECH'),'Manufacturing','Demo CNC-01','Computer-controlled machining platform.',1,'Mechanical Block, Bay 1','Available','Sample Faculty K','research@college.edu'),
('Robotics Kit',(SELECT id FROM departments WHERE code='MECH'),'Robotics and Automation','Demo RK-01','Programmable kits for automation prototyping.',10,'Mechanical Block, Bay 3','Available','Sample Faculty L','research@college.edu'),
('Universal Testing Machine',(SELECT id FROM departments WHERE code='MECH'),'Testing','Demo UTM-01','Load testing system for materials research demonstrations.',1,'Mechanical Testing Hall','Limited','Sample Faculty J','research@college.edu'),
('CAD Workstation',(SELECT id FROM departments WHERE code='MECH'),'CAD/CAM','Demo CAD-01','Workstation for engineering design and modelling.',15,'Mechanical Block, Design Studio','Available','Sample Faculty J','research@college.edu');

INSERT INTO expertise (faculty_name,department_id,designation,expertise,research_areas,email,phone) VALUES
('Sample Expert IT-01',(SELECT id FROM departments WHERE code='IT'),'Demo Faculty Profile','Cloud Computing, Cybersecurity','Information Systems, Secure Platforms','research@college.edu','+91 XXXXX XXXXX'),
('Sample Expert IT-02',(SELECT id FROM departments WHERE code='IT'),'Demo Faculty Profile','Information Systems','Data Services, Digital Platforms','research@college.edu','+91 XXXXX XXXXX'),
('Sample Expert CSE-01',(SELECT id FROM departments WHERE code='CSE'),'Demo Faculty Profile','Data Science, Machine Learning','Analytics, Intelligent Computing','research@college.edu','+91 XXXXX XXXXX'),
('Sample Expert CSE-02',(SELECT id FROM departments WHERE code='CSE'),'Demo Faculty Profile','Software Engineering','Software Quality, Distributed Systems','research@college.edu','+91 XXXXX XXXXX'),
('Sample Expert ECE-01',(SELECT id FROM departments WHERE code='ECE'),'Demo Faculty Profile','Embedded Systems, VLSI','Digital Hardware, Real-Time Systems','research@college.edu','+91 XXXXX XXXXX'),
('Sample Expert ECE-02',(SELECT id FROM departments WHERE code='ECE'),'Demo Faculty Profile','Communication Systems','Wireless Networks, Signal Processing','research@college.edu','+91 XXXXX XXXXX'),
('Sample Expert EEE-01',(SELECT id FROM departments WHERE code='EEE'),'Demo Faculty Profile','Power Electronics','Converters, Drives, Control','research@college.edu','+91 XXXXX XXXXX'),
('Sample Expert EEE-02',(SELECT id FROM departments WHERE code='EEE'),'Demo Faculty Profile','Renewable Energy','Energy Storage, Smart Grids','research@college.edu','+91 XXXXX XXXXX'),
('Sample Expert MECH-01',(SELECT id FROM departments WHERE code='MECH'),'Demo Faculty Profile','CAD/CAM, Manufacturing','Design Automation, Prototyping','research@college.edu','+91 XXXXX XXXXX'),
('Sample Expert MECH-02',(SELECT id FROM departments WHERE code='MECH'),'Demo Faculty Profile','Robotics and Automation','Industrial Robotics, Smart Manufacturing','research@college.edu','+91 XXXXX XXXXX');
