# Welcome to TaskFlow

I built **TaskFlow** to demonstrate a production-ready, full-stack approach to solving a common problem: team task management. My goal was to create an application that doesn't just "work" on a technical level, but also feels polished, intuitive, and professional for the end-user. 

---

## Project Overview

TaskFlow is a role-based task management system that helps teams organize their workload. The application is divided into two distinct roles to reflect real-world team dynamics:

- **Admins**: The project managers. They can create new projects, invite team members, create tasks, and re-assign tasks on the fly.
- **Members**: The contributors. They have a focused view where they can track tasks assigned to them and easily update task statuses as they make progress.

I focused heavily on keeping the UI clean and minimal to prevent information overload, while ensuring the backend is secure and well-structured.

---

## Tech Stack & Why I Chose It

I chose the **MERN** stack (with a few modern twists) to ensure the application is scalable, maintainable, and fast.

**Frontend:**
- **React (via Vite)**: I chose Vite over Create React App for significantly faster compilation and a smoother developer experience.
- **Tailwind CSS**: For styling. Tailwind allowed me to rapidly build a beautiful, responsive, and consistent design system without writing messy, global CSS files.
- **Zustand**: For global state management. It's much lighter and less boilerplate-heavy than Redux, making it perfect for handling the authentication state in an app of this size.
- **React Router DOM**: For client-side routing and protecting private routes.
- **Axios**: Configured with interceptors to automatically attach JWT tokens to every request, keeping the codebase DRY.

**Backend:**
- **Node.js & Express**: For a fast, unopinionated backend architecture.
- **MongoDB & Mongoose**: For a flexible NoSQL database schema that easily handles relationships between Users, Projects, and Tasks.
- **JSON Web Tokens (JWT) & bcrypt**: For secure, stateless user authentication and password hashing.

---

## Key Features

1. **Role-Based Access Control (RBAC)**: The API and Frontend heavily enforce role checks. Members cannot access Admin-only routes, ensuring data integrity.
2. **Smart Dashboard**: A high-level overview that automatically calculates total, completed, pending, and overdue tasks.
3. **Overdue Task Logic**: Using `date-fns`, the app intelligently highlights tasks that have passed their due date and aren't completed, bringing them to the user's immediate attention.
4. **Dynamic Filtering**: Users can filter their task lists by status and priority to stay focused.
5. **Polished UX**: Loading spinners, toast notifications for success/error states, and beautifully styled modals keep the user informed of exactly what is happening.

---


## 🔮 What I Would Add Next

If I had more time to expand on this project, I would implement:
1. **Real-time Updates**: Integrating `Socket.io` so that when an Admin assigns a task, it instantly appears on the Member's dashboard without refreshing.
2. **Task Comments**: A feature allowing members to leave notes or questions on specific tasks.
3. **Pagination**: Implementing cursor-based pagination on the backend for the `/tasks` route to ensure the app remains fast as the dataset grows to thousands of tasks.

---

Thank you.
