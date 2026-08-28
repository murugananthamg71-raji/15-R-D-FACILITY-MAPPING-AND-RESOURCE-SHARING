CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE CHECK (code IN ('IT', 'CSE', 'ECE', 'EEE', 'MECH')),
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
  department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS facilities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  type VARCHAR(40) NOT NULL CHECK (type IN ('Laboratory', 'Research Facility', 'Testing Facility', 'Computing Facility')),
  description TEXT NOT NULL DEFAULT '', location VARCHAR(180) NOT NULL, capacity VARCHAR(80) NOT NULL,
  availability VARCHAR(20) NOT NULL CHECK (availability IN ('Available', 'Limited', 'Unavailable')),
  course_code VARCHAR(30), regulation VARCHAR(20), semester VARCHAR(10), batch_size INTEGER,
  responsible_faculty VARCHAR(150) NOT NULL, contact VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS equipment (
  id SERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL, department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  category VARCHAR(100) NOT NULL, model VARCHAR(120) NOT NULL, description TEXT NOT NULL DEFAULT '', quantity INTEGER NOT NULL CHECK (quantity > 0),
  location VARCHAR(180) NOT NULL, availability VARCHAR(20) NOT NULL CHECK (availability IN ('Available', 'Limited', 'Unavailable')),
  lab_id INTEGER REFERENCES facilities(id) ON DELETE SET NULL, required_quantity NUMERIC, available_quantity NUMERIC,
  deficiency NUMERIC GENERATED ALWAYS AS (GREATEST(COALESCE(required_quantity, 0) - COALESCE(available_quantity, 0), 0)) STORED,
  unit VARCHAR(40) NOT NULL DEFAULT 'units', course_code VARCHAR(30), semester VARCHAR(10),
  responsible_faculty VARCHAR(150) NOT NULL, contact VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS expertise (
  id SERIAL PRIMARY KEY, faculty_name VARCHAR(150) NOT NULL, department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  designation VARCHAR(120) NOT NULL, expertise TEXT NOT NULL, research_areas TEXT NOT NULL, email VARCHAR(255) NOT NULL, phone VARCHAR(30) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS resource_requests (
  id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, resource_type VARCHAR(20) NOT NULL CHECK (resource_type IN ('facility', 'equipment')),
  resource_id INTEGER NOT NULL, requested_date DATE NOT NULL, start_time TIME NOT NULL, end_time TIME NOT NULL CHECK (end_time > start_time), purpose TEXT NOT NULL,
  research_project TEXT NOT NULL, additional_requirements TEXT, status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS facilities_department_idx ON facilities(department_id);
CREATE INDEX IF NOT EXISTS equipment_department_idx ON equipment(department_id);
CREATE INDEX IF NOT EXISTS requests_user_idx ON resource_requests(user_id);
