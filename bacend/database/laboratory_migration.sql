BEGIN;

ALTER TABLE facilities ADD COLUMN IF NOT EXISTS course_code VARCHAR(30);
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS regulation VARCHAR(20);
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS semester VARCHAR(10);
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS batch_size INTEGER;
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS lab_id INTEGER REFERENCES facilities(id) ON DELETE SET NULL;
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS required_quantity NUMERIC;
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS available_quantity NUMERIC;
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS deficiency NUMERIC GENERATED ALWAYS AS (GREATEST(COALESCE(required_quantity, 0) - COALESCE(available_quantity, 0), 0)) STORED;
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS unit VARCHAR(40) NOT NULL DEFAULT 'units';
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS course_code VARCHAR(30);
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS semester VARCHAR(10);
CREATE INDEX IF NOT EXISTS facilities_course_code_idx ON facilities(course_code);
CREATE INDEX IF NOT EXISTS facilities_semester_idx ON facilities(semester);
CREATE INDEX IF NOT EXISTS equipment_lab_id_idx ON equipment(lab_id);
CREATE UNIQUE INDEX IF NOT EXISTS facilities_course_code_unique_idx ON facilities(course_code) WHERE course_code IS NOT NULL;

COMMIT;
