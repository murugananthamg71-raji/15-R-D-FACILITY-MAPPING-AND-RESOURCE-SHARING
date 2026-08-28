BEGIN;

WITH labs(name, batch_size, responsible_faculty) AS (VALUES
  ('Brahmagupta Laboratory', 35, 'Ms. Rajswari.S'),
  ('Vikram Sarabhai Laboratory', 35, 'Ms. Rajswari.S'),
  ('Bhaskaracharya Laboratory', 35, 'Ms.Iswarya.S'),
  ('Subrahmanyan Chandrasekhar Laboratory', 35, 'Not Available in Official Document'),
  ('Research Laboratory', 15, 'Mr. Praveen Felix.M')
)
INSERT INTO facilities (name, department_id, type, description, location, capacity, availability, responsible_faculty, contact, regulation, semester, batch_size)
SELECT labs.name, d.id, 'Laboratory', 'Official IT laboratory record. Weekly Utilization: Fully Utilized.', 'IT Department', labs.batch_size || ' students', 'Available', labs.responsible_faculty, 'research@college.edu', NULL, NULL, labs.batch_size
FROM labs
JOIN departments d ON d.code = 'IT'
WHERE NOT EXISTS (SELECT 1 FROM facilities existing WHERE existing.name = labs.name AND existing.department_id = d.id);

WITH inventory(lab_name, equipment_name) AS (VALUES
  ('Brahmagupta Laboratory', 'Processor Intel Core i5'),
  ('Brahmagupta Laboratory', 'Intel Chipset motherboard'),
  ('Brahmagupta Laboratory', '16GB DDR4 RAM'),
  ('Brahmagupta Laboratory', 'Seagate 256GB SSD'),
  ('Brahmagupta Laboratory', 'Hard disk drive'),
  ('Brahmagupta Laboratory', 'UPS-Numeric'),
  ('Vikram Sarabhai Laboratory', 'Processor Intel Core i5'),
  ('Vikram Sarabhai Laboratory', 'Intel Chipset motherboard'),
  ('Vikram Sarabhai Laboratory', '16GB DDR4 RAM'),
  ('Vikram Sarabhai Laboratory', 'Seagate 256GB SSD'),
  ('Vikram Sarabhai Laboratory', 'Hard disk drive'),
  ('Vikram Sarabhai Laboratory', 'UPS-Numeric'),
  ('Bhaskaracharya Laboratory', 'Processor Intel Core i3'),
  ('Bhaskaracharya Laboratory', 'Intel Chipset motherboard'),
  ('Bhaskaracharya Laboratory', '4GB DDR3 RAM'),
  ('Bhaskaracharya Laboratory', 'Seagate 500GB SATA hard disk drive'),
  ('Bhaskaracharya Laboratory', 'UPS-Numeric'),
  ('Subrahmanyan Chandrasekhar Laboratory', 'Processor Intel Core i3'),
  ('Subrahmanyan Chandrasekhar Laboratory', 'Intel Chipset motherboard'),
  ('Subrahmanyan Chandrasekhar Laboratory', '4GB DDR3 RAM'),
  ('Subrahmanyan Chandrasekhar Laboratory', 'Seagate 500GB SATA hard disk drive'),
  ('Subrahmanyan Chandrasekhar Laboratory', 'UPS-Numeric'),
  ('Research Laboratory', 'Processor Intel Core 2 Duo'),
  ('Research Laboratory', 'Intel Chipset motherboard'),
  ('Research Laboratory', '4GB DDR3 RAM'),
  ('Research Laboratory', 'Seagate 160GB SATA hard disk drive'),
  ('Research Laboratory', 'UPS-Numeric')
)
INSERT INTO equipment (name, department_id, category, model, description, quantity, location, availability, responsible_faculty, contact, lab_id, required_quantity, available_quantity, unit)
SELECT inventory.equipment_name, d.id, 'Laboratory Equipment', 'Official IT inventory', 'Official IT laboratory equipment.', 1, f.location, 'Available', f.responsible_faculty, f.contact, f.id, NULL, NULL, 'units'
FROM inventory
JOIN facilities f ON f.name = inventory.lab_name
JOIN departments d ON d.id = f.department_id
WHERE d.code = 'IT'
  AND NOT EXISTS (SELECT 1 FROM equipment existing WHERE existing.lab_id = f.id AND existing.name = inventory.equipment_name);

COMMIT;