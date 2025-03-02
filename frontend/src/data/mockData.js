// Mock data for employees
export const mockEmployees = [
  {
    employeeId: 1,
    engname: "John Smith",
    arname: "جون سميث",
    email: "john.smith@example.com",
    phoneNumber: "+1 555-123-4567",
    status: "ACTIVE",
    municipalityId: 1,
    departments: [1, 3],
    reported: false,
    createdAt: "2023-01-15T08:30:00Z"
  },
  {
    employeeId: 2,
    engname: "Sarah Johnson",
    arname: "سارة جونسون",
    email: "sarah.j@example.com",
    phoneNumber: "+1 555-987-6543",
    status: "ACTIVE",
    municipalityId: 2,
    departments: [2],
    reported: true,
    createdAt: "2023-02-20T10:15:00Z"
  },
  {
    employeeId: 3,
    engname: "Mohammed Al-Farsi",
    arname: "محمد الفارسي",
    email: "m.alfarsi@example.com",
    phoneNumber: "+966 50 123 4567",
    status: "PENDING",
    municipalityId: 1,
    departments: [1, 2],
    reported: false,
    createdAt: "2023-03-10T14:45:00Z"
  },
  {
    employeeId: 4,
    engname: "Fatima Ahmed",
    arname: "فاطمة أحمد",
    email: "fatima.a@example.com",
    phoneNumber: "+966 55 987 6543",
    status: "INACTIVE",
    municipalityId: 3,
    departments: [3],
    reported: true,
    createdAt: "2023-01-05T09:20:00Z"
  },
  {
    employeeId: 5,
    engname: "David Wilson",
    arname: "ديفيد ويلسون",
    email: "d.wilson@example.com",
    phoneNumber: "+1 555-789-0123",
    status: "ACTIVE",
    municipalityId: 2,
    departments: [1, 4],
    reported: false,
    createdAt: "2023-04-25T11:30:00Z"
  },
  {
    employeeId: 6,
    engname: "Aisha Al-Mansouri",
    arname: "عائشة المنصوري",
    email: "aisha.m@example.com",
    phoneNumber: "+971 50 123 4567",
    status: "ACTIVE",
    municipalityId: 3,
    departments: [2, 4],
    reported: true,
    createdAt: "2023-02-12T13:10:00Z"
  },
  {
    employeeId: 7,
    engname: "Robert Chen",
    arname: "روبرت تشن",
    email: "r.chen@example.com",
    phoneNumber: "+1 555-456-7890",
    status: "PENDING",
    municipalityId: 1,
    departments: [3],
    reported: false,
    createdAt: "2023-03-30T15:45:00Z"
  },
  {
    employeeId: 8,
    engname: "Layla Al-Otaibi",
    arname: "ليلى العتيبي",
    email: "l.otaibi@example.com",
    phoneNumber: "+966 55 456 7890",
    status: "ACTIVE",
    municipalityId: 2,
    departments: [1, 2, 3],
    reported: true,
    createdAt: "2023-05-05T08:50:00Z"
  },
  {
    employeeId: 9,
    engname: "Michael Brown",
    arname: "مايكل براون",
    email: "m.brown@example.com",
    phoneNumber: "+1 555-234-5678",
    status: "INACTIVE",
    municipalityId: 3,
    departments: [4],
    reported: false,
    createdAt: "2023-01-20T10:30:00Z"
  },
  {
    employeeId: 10,
    engname: "Nora Al-Qahtani",
    arname: "نورة القحطاني",
    email: "n.qahtani@example.com",
    phoneNumber: "+966 50 234 5678",
    status: "ACTIVE",
    municipalityId: 1,
    departments: [2, 4],
    reported: true,
    createdAt: "2023-04-15T12:20:00Z"
  }
];

// Mock data for departments
export const mockDepartments = [
  { departmentId: 1, department: "Human Resources" },
  { departmentId: 2, department: "Finance" },
  { departmentId: 3, department: "Information Technology" },
  { departmentId: 4, department: "Operations" }
];

// Mock data for municipalities
export const mockMunicipalities = [
  { municipalityId: 1, municipality: "Riyadh" },
  { municipalityId: 2, municipality: "Jeddah" },
  { municipalityId: 3, municipality: "Dammam" }
]; 