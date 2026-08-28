const departments = [
  {
  id: 'it',
  name: 'Information Technology',
  shortName: 'IT',
  description: 'Information systems, cloud platforms, cybersecurity, and data-driven services.',
  researchAreas: 'Cloud Computing, Cybersecurity, Information Systems',
  facilities: 5,
  equipment: 25,
  experts: 7
},
  { id: 'cse', name: 'Computer Science and Engineering', shortName: 'CSE', description: 'Software systems, intelligent computing, data science, and digital innovation.', researchAreas: 'Data Science, Software Engineering, High Performance Computing', facilities: 15, equipment: 16, experts: 10 },
  { id: 'ece', name: 'Electronics and Communication Engineering', shortName: 'ECE', description: 'Connected devices, communication systems, VLSI, and embedded technology.', researchAreas: 'Embedded Systems, VLSI, Communication Systems', facilities: 4, equipment: 15, experts: 9 },
  { id: 'eee', name: 'Electrical and Electronics Engineering', shortName: 'EEE', description: 'Power systems, automation, control, and sustainable energy research.', researchAreas: 'Power Electronics, Renewable Energy, Electrical Machines', facilities: 3, equipment: 11, experts: 7 },
  { id: 'mech', name: 'Mechanical Engineering', shortName: 'MECH', displayName: 'Mechanical', description: 'Advanced manufacturing, CAD/CAM, robotics, thermal systems, and design.', researchAreas: 'CAD/CAM, Manufacturing, Robotics and Automation', facilities: 4, equipment: 14, experts: 8 },
  {
  id: 'aids',
  name: 'Artificial Intelligence and Data Science',
  shortName: 'AIDS',
  description: 'Artificial intelligence, machine learning, data science, and intelligent computing.',
  researchAreas: 'Artificial Intelligence, Machine Learning, Data Science',
  facilities: 2,
  equipment: 0,
  experts: 0
}
];
// ADD IT LABORATORIES HERE ======
const itLaboratories = [
  {
    id: 'it-brahmagupta',
    department: 'IT',
    name: 'Brahmagupta Laboratory',
    batchSize: 35,
    utilization: 'Fully Utilized',
    technicalManpower: {
      name: 'Ms. Rajswari.S',
      designation: 'Lab Technician',
      qualification: 'B.E. Computer Science and Engineering'
    },
    equipment: [
      { name: 'Processor Intel Core i5' },
      { name: 'Intel Chipset motherboard' },
      { name: '16GB DDR4 RAM' },
      { name: 'Seagate 256GB SSD' },
      { name: 'Hard disk drive' },
      { name: 'UPS-Numeric' }
    ]
  },
  {
    id: 'it-vikram-sarabhai',
    department: 'IT',
    name: 'Vikram Sarabhai Laboratory',
    batchSize: 35,
    utilization: 'Fully Utilized',
    technicalManpower: {
      name: 'Ms. Rajswari.S',
      designation: 'Lab Technician',
      qualification: 'B.E. Computer Science and Engineering'
    },
    equipment: [
      { name: 'Processor Intel Core i5' },
      { name: 'Intel Chipset motherboard' },
      { name: '16GB DDR4 RAM' },
      { name: 'Seagate 256GB SSD' },
      { name: 'Hard disk drive' },
      { name: 'UPS-Numeric' }
    ]
  },
  {
    id: 'it-bhaskaracharya',
    department: 'IT',
    name: 'Bhaskaracharya Laboratory',
    batchSize: 35,
    utilization: 'Fully Utilized',
    technicalManpower: {
      name: 'Ms.Iswarya.S',
      designation: 'Lab Technician',
      qualification: 'B.Sc. Computer Science'
    },
    equipment: [
      { name: 'Processor Intel Core i3' },
      { name: 'Intel Chipset motherboard' },
      { name: '4GB DDR3 RAM' },
      { name: 'Seagate 500GB SATA hard disk drive' },
      { name: 'UPS-Numeric' }
    ]
  },
  {
    id: 'it-subrahmanyan',
    department: 'IT',
    name: 'Subrahmanyan Chandrasekhar Laboratory',
    batchSize: 35,
    utilization: 'Fully Utilized',
    technicalManpower: null,
    equipment: [
      { name: 'Processor Intel Core i3' },
      { name: 'Intel Chipset motherboard' },
      { name: '4GB DDR3 RAM' },
      { name: 'Seagate 500GB SATA hard disk drive' },
      { name: 'UPS-Numeric' }
    ]
  },
  {
    id: 'it-research',
    department: 'IT',
    name: 'Research Laboratory',
    batchSize: 15,
    utilization: 'Fully Utilized',
    technicalManpower: {
      name: 'Mr. Praveen Felix.M',
      designation: 'Lab Technician',
      qualification: 'B.Com'
    },
    equipment: [
      { name: 'Processor Intel Core 2 Duo' },
      { name: 'Intel Chipset motherboard' },
      { name: '4GB DDR3 RAM' },
      { name: 'Seagate 160GB SATA hard disk drive' },
      { name: 'UPS-Numeric' }
    ]
  }
];

const aidsLaboratories = [
  {
    id: 'aids-cv-raman',
    department: 'AIDS',
    name: 'C.V. Raman Laboratory',
    batchSize: 35,
    utilization: 'Not Specified',
    courseCode: null,
    semester: null,
    regulation: null,
    technicalManpower: null,
    equipment: []
  },
  {
    id: 'aids-srinivasa-ramanujan',
    department: 'AIDS',
    name: 'Srinivasa Ramanujan Laboratory',
    batchSize: 35,
    utilization: 'Not Specified',
    courseCode: null,
    semester: null,
    regulation: null,
    technicalManpower: null,
    equipment: []
  }
];

const cseEquipment = (names) => names.map((name) => ({
  name,
  required: 30,
  available: 30,
  deficiency: 0
}));

const cseLaboratories = [
  { id: 'cse-dbms', department: 'CSE', name: 'Database Management Systems', courseCode: '24PIT301', semester: 'III', regulation: 'R 2024', batchSize: 30, utilization: 'Fully Utilized', equipment: cseEquipment(['INTEL based desktop PC with min. 8GB RAM and 500 GB HDD, 17" or higher TFT Monitor, Keyboard and mouse', 'Windows 10 or higher operating system / Linux Ubuntu 20 or higher', 'Oracle Database 11 or higher with SQL Plus']) },
  { id: 'cse-design-analysis-algorithms', department: 'CSE', name: 'Design and Analysis of Algorithms', courseCode: '24PCS311', semester: 'III', regulation: 'R 2024', batchSize: 30, utilization: 'Fully Utilized', equipment: cseEquipment(['INTEL based desktop PC with min. 8GB RAM and 500 GB HDD, 17" or higher TFT Monitor, Keyboard and mouse', 'Windows 10 or higher operating system / Linux Ubuntu 20 or higher', 'C / DevC++ / Eclipse CDT / Code Blocks / CodeLite / equivalent open source IDE']) },
  { id: 'cse-data-structures-algorithms', department: 'CSE', name: 'Data Structures and Algorithms', courseCode: '24PCS313', semester: 'III', regulation: 'R 2024', batchSize: 30, utilization: 'Fully Utilized', equipment: cseEquipment(['INTEL based desktop PC with min. 8GB RAM and 500 GB HDD, 17" or higher TFT Monitor, Keyboard and mouse', 'Windows 10 or higher operating system / Linux Ubuntu 20 or higher', 'C / DevC++ / Eclipse CDT / Code Blocks / CodeLite / equivalent open source IDE']) },
  { id: 'cse-java-programming', department: 'CSE', name: 'Java Programming', courseCode: '24PIT302', semester: 'III', regulation: 'R 2024', batchSize: 30, utilization: 'Fully Utilized', equipment: cseEquipment(['INTEL based desktop PC with min. 8GB RAM and 500 GB HDD, 17" or higher TFT Monitor, Keyboard and mouse', 'Windows 10 or higher operating system / Linux Ubuntu 20 or higher', 'Eclipse IDE or NetBeans IDE with JDK']) },
  { id: 'cse-operating-systems', department: 'CSE', name: 'Operating Systems', courseCode: '24PCS302', semester: 'III', regulation: 'R 2024', batchSize: 30, utilization: 'Fully Utilized', equipment: cseEquipment(['INTEL based desktop PC with min. 8GB RAM and 500 GB HDD, 17" or higher TFT Monitor, Keyboard and mouse', 'Windows 10 or higher operating system / Linux Ubuntu 20 or higher', 'C / DevC++ / Eclipse CDT / Code Blocks / CodeLite / equivalent open source IDE']) },
  { id: 'cse-computer-networks', department: 'CSE', name: 'Computer Networks', courseCode: '24PCS401', semester: 'IV', regulation: 'R 2024', batchSize: 30, utilization: 'Fully Utilized', equipment: cseEquipment(['INTEL based desktop PC with min. 8GB RAM and 500 GB HDD, 17" or higher TFT Monitor, Keyboard and mouse', 'Windows 10 or higher operating system / Linux Ubuntu 20 or higher', 'C / C++ / Python (for socket programming) With Cisco Packet Tracer / NS2 / NS3']) },
  { id: 'cse-web-application-development', department: 'CSE', name: 'Web Application Development', courseCode: '24PIT412', semester: 'IV', regulation: 'R 2024', batchSize: 30, utilization: 'Fully Utilized', equipment: cseEquipment(['INTEL based desktop PC with min. 8GB RAM and 500 GB HDD, 17" or higher TFT Monitor, Keyboard and mouse', 'Windows 10 or higher operating system / Linux Ubuntu 20 or higher', 'HTML, CSS, JavaScript, PHP or Node.js and XAMPP / WAMP']) },
  { id: 'cse-artificial-intelligence', department: 'CSE', name: 'Artificial Intelligence', courseCode: '24PAD301', semester: 'IV', regulation: 'R 2024', batchSize: 30, utilization: 'Fully Utilized', equipment: cseEquipment(['INTEL based desktop PC with min. 8GB RAM and 500 GB HDD, 17" or higher TFT Monitor, Keyboard and mouse', 'Windows 10 or higher operating system / Linux Ubuntu 20 or higher', 'Python, Anaconda / Jupyter Notebook\nAI / ML Libraries: NumPy, Pandas, Scikit-learn, TensorFlow / Keras']) },
  { id: 'cse-advanced-algorithms', department: 'CSE', name: 'Advanced Algorithms', courseCode: '24PCS402', semester: 'IV', regulation: 'R 2024', batchSize: 30, utilization: 'Fully Utilized', equipment: cseEquipment(['INTEL based desktop PC with min. 8GB RAM and 500 GB HDD, 17" or higher TFT Monitor, Keyboard and mouse', 'Windows 10 or higher operating system / Linux Ubuntu 20 or higher', 'C / DevC++ / Eclipse CDT / Code Blocks / CodeLite / equivalent open source IDE']) },
  { id: 'cse-software-engineering', department: 'CSE', name: 'Software Engineering', courseCode: '24PIT411', semester: 'IV', regulation: 'R 2024', batchSize: 30, utilization: 'Fully Utilized', equipment: cseEquipment(['INTEL based desktop PC with min. 8GB RAM and 500 GB HDD, 17" or higher TFT Monitor, Keyboard and mouse', 'Windows 10 or higher operating system / Linux Ubuntu 20 or higher', 'StarUML']) },
  { id: 'cse-machine-learning', department: 'CSE', name: 'Machine Learning Techniques', courseCode: '24PAD401', semester: 'V', regulation: 'R 2024', batchSize: 30, utilization: 'Fully Utilized', equipment: cseEquipment(['INTEL based desktop PC with min. 8GB RAM and 500 GB HDD, 17" or higher TFT Monitor, Keyboard and mouse', 'Windows 10 or higher operating system / Linux Ubuntu 20 or higher', 'Python (most important)\nAnaconda / Jupyter Notebook\nAI / ML Libraries: NumPy, Pandas, Scikit-learn, TensorFlow / Keras']) },
  { id: 'cse-cloud-computing', department: 'CSE', name: 'Cloud Computing', courseCode: '24PIT502', semester: 'V', regulation: 'R 2024', batchSize: 30, utilization: 'Fully Utilized', equipment: cseEquipment(['INTEL based desktop PC with min. 8GB RAM and 500 GB HDD, 17" or higher TFT Monitor, Keyboard and mouse', 'Windows 10 or higher operating system / Linux Ubuntu 20 or higher', 'VirtualBox or VMware']) },
  { id: 'cse-open-source', department: 'CSE', name: 'Open-Source Software Laboratory', courseCode: '24PCS502', semester: 'V', regulation: 'R 2024', batchSize: 30, utilization: 'Fully Utilized', equipment: cseEquipment(['INTEL based desktop PC with min. 8GB RAM and 500 GB HDD, 17" or higher TFT Monitor, Keyboard and mouse', 'Windows 10 or higher operating system / Linux Ubuntu 20 or higher', 'C or Python or Shell Scripting (Bash)\nDevelopment Tools: GCC compiler or GDB debugger']) },
  { id: 'cse-cryptography-network-security', department: 'CSE', name: 'Cryptography and Network Security', courseCode: '24PIT601', semester: 'VI', regulation: 'R 2024', batchSize: 30, utilization: 'Fully Utilized', equipment: cseEquipment(['INTEL based desktop PC with min. 8GB RAM and 500 GB HDD, 17" or higher TFT Monitor, Keyboard and mouse', 'Windows 10 or higher operating system / Linux Ubuntu 20 or higher', 'Programming Languages: C or C++ or Python\nCryptography Libraries: OpenSSL or Python cryptography libraries\nSecurity Tools: Wireshark or Nmap']) },
  { id: 'cse-compiler-design', department: 'CSE', name: 'Compiler Design', courseCode: '24PCS601', semester: 'VI', regulation: 'R 2024', batchSize: 30, utilization: 'Fully Utilized', equipment: cseEquipment(['INTEL based desktop PC with min. 8GB RAM and 500 GB HDD, 17" or higher TFT Monitor, Keyboard and mouse', 'Windows 10 or higher operating system / Linux Ubuntu 20 or higher', 'C or C++', 'Lex (or Flex) or Yacc (or Bison)']) }
].map((lab) => ({ ...lab, department_code: 'CSE', type: 'Laboratory', course_code: lab.courseCode, batch_size: lab.batchSize, capacity: '30 students', availability: 'Available', equipment_count: lab.equipment.length, technicalStaff: 'Not Specified', designation: 'Not Specified', qualification: 'Not Specified', description: 'Fully Utilized | Batch Size: 30 | Quantity Required: 30 | Quantity Available: 30 | Deficiency: 0' }));

const resources = [
  { id: 'r-ai', name: 'AI & Machine Learning Lab', department: 'IT', type: 'Facility', category: 'Artificial Intelligence', location: 'IT Block, Room 204', description: 'Demonstration lab for applied machine learning, intelligent applications, and responsible AI research.', availability: 'Available', capacity: '30 researchers', faculty: 'Sample Faculty A', contact: 'research@college.edu' },
  { id: 'r-cloud', name: 'Cloud Computing Resources', department: 'IT', type: 'Equipment', category: 'Cloud Computing', location: 'IT Block, Server Room', description: 'Demo cloud infrastructure for distributed systems, application deployment, and platform research.', availability: 'Limited', capacity: '20 concurrent users', faculty: 'Sample Faculty B', contact: 'research@college.edu' },
  { id: 'r-cyber', name: 'Cybersecurity Lab', department: 'IT', type: 'Facility', category: 'Cybersecurity', location: 'IT Block, Room 118', description: 'Controlled environment for security testing, digital forensics, and network defense exercises.', availability: 'Available', capacity: '24 researchers', faculty: 'Sample Faculty C', contact: 'research@college.edu' },
  { id: 'r-data', name: 'Data Science Lab', department: 'CSE', type: 'Facility', category: 'Data Science', location: 'CSE Block, Room 212', description: 'Workspace for analytics, visualization, statistical modelling, and data-intensive research.', availability: 'Available', capacity: '32 researchers', faculty: 'Sample Faculty D', contact: 'research@college.edu' },
  { id: 'r-software', name: 'Software Engineering Lab', department: 'CSE', type: 'Facility', category: 'Software Engineering', location: 'CSE Block, Room 106', description: 'Collaborative environment for software architecture, testing, and development methods.', availability: 'Limited', capacity: '28 researchers', faculty: 'Sample Faculty E', contact: 'research@college.edu' },
  { id: 'r-hpc', name: 'High Performance Computing', department: 'CSE', type: 'Facility', category: 'High Performance Computing', location: 'CSE Block, Technology Centre', description: 'Demo GPU-enabled computing capacity for simulation, machine learning, and large-scale analysis.', availability: 'Available', capacity: '64 concurrent users', faculty: 'Sample Faculty F', contact: 'research@college.edu' },
  { id: 'r-embedded', name: 'Embedded Systems Lab', department: 'ECE', type: 'Facility', category: 'Embedded Systems', location: 'ECE Block, Room 220', description: 'Hardware and firmware development environment for real-time embedded applications.', availability: 'Available', capacity: '24 researchers', faculty: 'Sample Faculty G', contact: 'research@college.edu' },
  { id: 'r-vlsi', name: 'VLSI Design Resources', department: 'ECE', type: 'Equipment', category: 'VLSI', location: 'ECE Block, Room 212', description: 'Demo design tools and development boards for digital systems and chip design research.', availability: 'Limited', capacity: '16 users', faculty: 'Sample Faculty H', contact: 'research@college.edu' },
  { id: 'r-communication', name: 'Communication Systems Lab', department: 'ECE', type: 'Facility', category: 'Communication Systems', location: 'ECE Block, Room 118', description: 'Research workspace for wireless communication, signal processing, and network experiments.', availability: 'Available', capacity: '20 researchers', faculty: 'Sample Faculty I', contact: 'research@college.edu' },
  { id: 'r-power', name: 'Power Electronics Lab', department: 'EEE', type: 'Facility', category: 'Power Electronics', location: 'EEE Block, Room 106', description: 'Demonstration lab for converters, drives, control systems, and power electronics research.', availability: 'Available', capacity: '22 researchers', faculty: 'Sample Faculty J', contact: 'research@college.edu' },
  { id: 'r-renewable', name: 'Renewable Energy Research', department: 'EEE', type: 'Facility', category: 'Renewable Energy', location: 'EEE Block, Energy Systems Lab', description: 'Test environment for solar, storage, energy monitoring, and sustainable power studies.', availability: 'Limited', capacity: '18 researchers', faculty: 'Sample Faculty K', contact: 'research@college.edu' },
  { id: 'r-machines', name: 'Electrical Machines Lab', department: 'EEE', type: 'Facility', category: 'Electrical Machines', location: 'EEE Block, Room 128', description: 'Demo machines and measurement systems for electromechanical energy research.', availability: 'Available', capacity: '20 researchers', faculty: 'Sample Faculty L', contact: 'research@college.edu' },
  { id: 'r-cad', name: 'CAD/CAM Laboratory', department: 'MECH', type: 'Facility', category: 'CAD/CAM', location: 'Mechanical Block, Design Studio', description: 'Design and manufacturing software workspace for engineering modelling and prototyping.', availability: 'Available', capacity: '30 researchers', faculty: 'Sample Faculty M', contact: 'research@college.edu' },
  { id: 'r-manufacturing', name: 'Manufacturing Lab', department: 'MECH', type: 'Facility', category: 'Manufacturing', location: 'Mechanical Block, Bay 1', description: 'Demonstration workshop for fabrication, process studies, and advanced manufacturing research.', availability: 'Limited', capacity: '20 researchers', faculty: 'Sample Faculty N', contact: 'research@college.edu' },
  { id: 'r-robotics', name: 'Robotics and Automation', department: 'MECH', type: 'Facility', category: 'Robotics', location: 'Mechanical Block, Bay 3', description: 'Collaborative space for automation, robotic systems, and intelligent manufacturing experiments.', availability: 'Available', capacity: '26 researchers', faculty: 'Sample Faculty O', contact: 'research@college.edu' },
  { id: 'r-printer', name: '3D Printer', department: 'MECH', type: 'Equipment', category: 'Manufacturing', location: 'Mechanical Block, Bay 2', description: 'Demo additive manufacturing equipment for rapid prototyping and functional parts.', availability: 'Available', capacity: '1 operator', faculty: 'Sample Faculty P', contact: 'research@college.edu' }
];

const expertise = [
  { id: 'e-it', name: 'Sample Expert IT-01', department: 'IT', designation: 'Demo Faculty Profile', areas: 'Cloud Computing, Cybersecurity, Information Systems', contact: 'research@college.edu' },
  { id: 'e-cse', name: 'Sample Expert CSE-01', department: 'CSE', designation: 'Demo Faculty Profile', areas: 'Data Science, Software Engineering, Machine Learning', contact: 'research@college.edu' },
  { id: 'e-ece', name: 'Sample Expert ECE-01', department: 'ECE', designation: 'Demo Faculty Profile', areas: 'Embedded Systems, VLSI, Communication Systems', contact: 'research@college.edu' },
  { id: 'e-eee', name: 'Sample Expert EEE-01', department: 'EEE', designation: 'Demo Faculty Profile', areas: 'Power Electronics, Renewable Energy, Electrical Machines', contact: 'research@college.edu' },
  { id: 'e-mech', name: 'Sample Expert MECH-01', department: 'MECH', designation: 'Demo Faculty Profile', areas: 'CAD/CAM, Manufacturing, Robotics and Automation', contact: 'research@college.edu' }
];

const facilityTypes = ['Laboratory', 'Testing Facility', 'Computing Facility', 'Design Studio'];
const expertiseCategories = ['Artificial Intelligence', 'Machine Learning', 'Data Science', 'Cloud Computing', 'Cybersecurity', 'IoT', 'Embedded Systems', 'VLSI', 'Communication Systems', 'Power Electronics', 'Renewable Energy', 'Electrical Machines', 'CAD/CAM', 'Manufacturing', 'Robotics and Automation'];

const demoUsers = {
  'student@college.edu': { name: 'Demo Student', role: 'Student / Researcher', department: 'CSE' },
  'faculty@college.edu': { name: 'Demo Faculty', role: 'Faculty', department: 'CSE' },
  'admin@college.edu': { name: 'Portal Administrator', role: 'Administrator', department: 'IT' }
};
