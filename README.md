# Multi-Tenant SaaS — Companies / Shops / Products

Roles:
- **superadmin** — companies + company-admin banata hai, sab dekh sakta hai
- **companyadmin** — apni company ke shops + products manage karta hai
- **shopadmin** — sirf apni shop ke products manage karta hai

Isolation: har query backend mein `req.user.companyId` (JWT se) se filter hoti hai — ek admin dusri company ka data kabhi nahi dekh sakta, chahe API directly hit kare.

## Setup

### 1) MongoDB
Local MongoDB chalao (`mongod`) ya MongoDB Atlas ka connection string use karo.

### 2) Backend
```
cd backend
cp .env.example .env      # .env mein MONGO_URI aur JWT_SECRET set karo
npm install
npm run dev                # http://localhost:5000
```

### 3) Bootstrap Super Admin (sirf ek dafa)
```
POST http://localhost:5000/api/auth/register-superadmin
Body: { "name": "Admin", "email": "admin@test.com", "password": "123456" }
```
(Postman ya curl se call karo — koi UI nahi hai iske liye, security ki wajah se)

### 4) Frontend
```
cd frontend
cp .env.example .env      # VITE_API_URL already localhost:5000/api pe set hai
npm install
npm run dev                # http://localhost:5173
```

### 5) Flow
1. `/login` pe superadmin credentials se login karo → `/superadmin`
2. Wahan se company + company-admin banao
3. Company-admin ke email/password se logout-login karo → `/companyadmin`
4. Shops banao, products banao
5. (Optional) API se `/api/users/shopadmin` hit karke shop-admin bana sakte ho ek specific shop ke liye

## Folder Structure
```
saas-project/
├── backend/     Express + MongoDB + JWT
└── frontend/    React (Vite) + role-based dashboards
```


backend env
PORT=5000
MONGO_URI="mongodb://fatimamushtaqali2007_db_user:KLJoTrdWCq8dUTjO@ac-ops2zox-shard-00-00.srgwzfs.mongodb.net:27017,ac-ops2zox-shard-00-01.srgwzfs.mongodb.net:27017,ac-ops2zox-shard-00-02.srgwzfs.mongodb.net:27017/?ssl=true&replicaSet=atlas-a84c2x-shard-0&authSource=admin&appName=Cluster0"
JWT_SECRET="change_this_to_a_long_random_secret"
JWT_EXPIRES_IN="7d"

frontend envVITE_API_URL=http://localhost:5000/api


fatimamushtaqali2007_db_user
KLJoTrdWCq8dUTjO
mongodb+srv://fatimamushtaqali2007_db_user:KLJoTrdWCq8dUTjO@cluster0.srgwzfs.mongodb.net/?appName=Cluster0

mongodb://fatimamushtaqali2007_db_user:KLJoTrdWCq8dUTjO@ac-ops2zox-shard-00-00.srgwzfs.mongodb.net:27017,ac-ops2zox-shard-00-01.srgwzfs.mongodb.net:27017,ac-ops2zox-shard-00-02.srgwzfs.mongodb.net:27017/?ssl=true&replicaSet=atlas-a84c2x-shard-0&authSource=admin&appName=Cluster0
