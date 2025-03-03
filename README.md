# **Assignment: Full-Stack CRUD Application Development**

## **Objective**

You have been provided with a starter project that includes user authentication using  **Node.js, React.js, and MongoDB** . Your task is to extend this application by implementing **CRUD (Create, Read, Update, Delete) operations** for a real-world application of your choice.

## **Requirements**

### **1. Choose a Real-World Application**

Select a meaningful use case for your CRUD operations. Some examples:

* **Bookstore Inventory** (Manage books with title, author, and price)
* **Employee Management** (CRUD operations for employee records)
* **Student Enrollment System** (Manage student records and courses)

### **2. Backend Development (Node.js + Express + MongoDB)**

* Use **Express.js** to create API endpoints (See task manager app)).
* Use **MongoDB with Mongoose** for data storage (Follow task manager apps)).
* Implement **CRUD operations** (Create, Read, Update, Delete) for your selected application (you already developed by yourself)).
* Ensure  **proper request validation and error handling (Optional))**.

### **3. Frontend Development (React.js)**

* Create a user-friendly interface to interact with your API (Some portion developed, follow task manager app)).
* Implement **forms** for adding and updating records.
* Display data using  **tables, cards, or lists (Follow how we showed data in task manager app)**

### **4. Authentication & Authorization**

* Ensure **only authenticated users** can access and perform CRUD operations. (Already developed in your project)
* Use **JWT (JSON Web Tokens)** for user authentication (Use the task manager one from .env file).

### **5. Deployment**

* Deploy backend on AWS
* Deploy frontend on  AWS
* Use **MongoDB Atlas** for cloud database storage.
* Use GitHub for version control

## **Submission Requirements**

* Upload your **GitHub repository link** containing:
  * `backend/` (Node.js + Express + MongoDB)
  * `frontend/` (React.js UI)
* Include a **README.md** with:
  * Project setup instructions
  * Features overview
* Deploy the project.

## **Evaluation Criteria**

Your project will be assessed based on:

* **Functionality** – Working CRUD operations & authentication.
* **Code Quality** – Clean, well-structured, and commented code.
* **User Interface** – Intuitive and user-friendly design.
* **Error Handling & Validation** – Proper handling of invalid inputs and errors.
* **Deployment (Bonus)** – Extra points for successfully deploying the project.

# **Assignment: Full-Stack CRUD Application Development with DevOps Practices**

## **Objective**

You have been provided with a starter project that includes user authentication using  **Node.js, React.js, and MongoDB** . Your task is to extend this application by implementing **CRUD (Create, Read, Update, Delete) operations** for a real-world application of your choice, while following industry best practices such as:

* **Project Management with JIRA**
* **Version Control using GitHub**
* **CI/CD Integration for Automated Deployment**

## **Requirements**

### **1. Choose a Real-World Application**

Select a meaningful use case for your CRUD operations. Some examples:

* **Bookstore Inventory** (Manage books with title, author, and price)
* **Employee Management** (CRUD operations for employee records)
* **Student Enrollment System** (Manage student records and courses)

### **2. Project Management with JIRA**

* Create a **JIRA project** and define:
  * **Epic**
  * **User Stories** (features required in your app)
  * **Child issues & Subtasks** (breaking down development work)
  * **Sprint Planning** (organizing work into milestones)
* Document your JIRA **board URL** in the project README.

### **3. Backend Development (Node.js + Express + MongoDB)**

* Create a user-friendly interface to interact with your API (Some portion developed, follow task manager app)).
* Implement **forms** for adding and updating records.
* Display data using  **tables, cards, or lists (Follow how we showed data in task manager app)**

### **4. Frontend Development (React.js)**

* Create a user-friendly interface to interact with your API (**Some portion developed, follow task manager app)**.
* Implement **forms** for adding and updating records.
* Display data using  **tables, cards, or lists (Follow how we showed data in task manager app)**

### **5. Authentication & Authorization**

* Ensure **only authenticated users** can access and perform CRUD operations. (Already developed in your project)
* Use **JWT (JSON Web Tokens)** for user authentication (Use the task manager one from .env file).

### **6. GitHub Version Control & Branching Strategy**

* Use **GitHub for version control** and maintain:
  * `main` branch (stable production-ready code)
  * Feature branches (`feature/xyz`) for each new functionality
* Follow proper **commit messages** and  **pull request (PR) reviews** .

### **7. CI/CD Pipeline Setup**

* Implement a **CI/CD pipeline using GitHub Actions** to:
  * Automatically **run tests** on every commit/pull request (Optional).
  * Deploy the **backend** to **AWS** .
  * Deploy the **frontend** to **AWS**.
* Document your  **CI/CD workflow in the README** .

## **Submission Requirements**

* **JIRA Project Board URL** (user stories ).
* **GitHub Repository** (`backend/` and `frontend/`).
* **README.md** with:

  * Project setup instructions.
  * CI/CD pipeline details.
