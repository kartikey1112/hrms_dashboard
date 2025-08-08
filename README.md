HRMS Dashboard — Next.js (App Router) + Supabase Auth

## Setup

1) Install dependencies
```
npm install
```

2) Create a `.env.local` in project root with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

3) Set up Supabase Database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL from `scripts/create-tables.sql` to create the database tables
   - Or copy and paste the SQL content into the SQL Editor

4) Seed the database with sample data:
```
node scripts/seed-database.js
```

5) Start the dev server
```
npm run dev
```

Open `http://localhost:3000`.

## Authentication
- Login with a Supabase email/password user you created in your project.
- Middleware protects `/Dashboard` routes. Authenticated users hitting `/` are redirected to `/Dashboard`.

## Features
- Login/Signup page at `/` (email/password via Supabase)
- Protected dashboard at `/Dashboard`
- CRUD operations for employees and leaves using Supabase database
- Views:
  - Employee Directory with search/filter and CRUD operations
  - Leave Requests with status filter
  - Profile (editable name + read-only email)
- Dark/Light theme toggle
- Responsive design

## Database Schema

### Employees Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `department` (VARCHAR)
- `role` (VARCHAR)
- `status` (VARCHAR: 'Active' or 'Inactive')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Leaves Table
- `id` (UUID, Primary Key)
- `employee_id` (UUID, Foreign Key to employees.id)
- `employee_name` (VARCHAR)
- `type` (VARCHAR)
- `start_date` (DATE)
- `end_date` (DATE)
- `status` (VARCHAR: 'Pending', 'Approved', or 'Rejected')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/[id]` - Get specific employee
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee

### Leaves
- `GET /api/leaves` - Get all leaves
- `POST /api/leaves` - Create new leave

## CRUD Operations
- **Create**: Add new employees via modal form
- **Read**: View employees with search and filter
- **Update**: Edit employee details via modal
- **Delete**: Remove employees with confirmation

## Known Issues
- Profile save is local only (no persistence to Supabase DB).
- Leave CRUD operations are read-only (no create/edit/delete for leaves yet).

## Credentials
- Use any email/password user registered in your Supabase project. If you need a quick test user, create one in Supabase Auth → Users.
