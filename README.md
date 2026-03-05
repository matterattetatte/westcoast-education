# westcoast-education
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![json-server](https://img.shields.io/badge/JSON-000?logo=json&logoColor=fff)](https://github.com/typicode/json-server)
[![tsc](https://img.shields.io/badge/tsc-TypeScript_Compiler-000000?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)


```mermaid
graph TD
    subgraph "root"
        index.html["🏠 index.html"]
    end
    
    subgraph "admin"
        admin/index["🔧 admin/index.html"]
        admin/enrollments["📊 admin/course-enrollments.html"]
        admin/newcourse["➕ admin/new-course.html"]
    end
    
    subgraph "student"
        student/index["👋 student/index.html"]
        student/courses["📚 student/courses.html"]
        student/details["👁️ student/course-details.html"]
        student/buy["💳 student/buy-course.html"]
    end
    
    index.html --> student/index
    student/index --> student/courses
    student/courses --> student/details
    student/details --> student/buy
    
    index.html --> admin/index
    admin/index --> admin/newcourse
    admin/index --> admin/enrollments
    admin/enrollments --> admin/index
    
    classDef root fill:#e1f5fe,stroke:#01579b,stroke-width:3px,color:#000
    classDef admin fill:#f3e5f5,stroke:#4a148c,stroke-width:3px,color:#000
    classDef student fill:#e8f5e8,stroke:#1b5e20,stroke-width:3px,color:#000
    
    class index.html root
    class admin/index,admin/enrollments,admin/newcourse admin
    class student/index,student/courses,student/details,student/buy student
```

## 🎓 Project Overview

**westcoast-education** is a vanilla TypeScript + HTML/CSS education platform with separate admin and student interfaces. Students can browse courses, view details, and purchase while admins manage courses and track enrollments.

## 🚀 Quick Start

### Frontend & Backend in one
```bash
# possibly first time: chmod +x ./start_server.sh
./start_server.sh
```

## 🏗️ Frontend File Structure

```
public/
├── index.html                 # Landing page
├── admin/
│   ├── index.html            # Admin dashboard, list of courses
│   ├── course-enrollments.html # Enrollment management
│   └── new-course.html       # Course creation
└── student/
    ├── index.html            # Student dashboard
    ├── courses.html          # Course catalog
    ├── course-details.html   # Course details
    └── buy-course.html       # Purchase flow
```

## ✨ Features

- **Dual Interface**: Separate admin & student experiences
- **TypeScript**: Type-safe frontend with `tsc` compilation
- **Vanilla TS/JS**: No frameworks (used `supabase cli` to generate db types)
- **Responsive**: Works on all screen sizes
- **Course Management**: Partial CRUD for courses, enrollments, purchases...
