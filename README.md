# Book Management System - React

## Introduction

The Book Management System is a full stack project, including complete frontend code and backend code.

- Frontend: nextjs + React + antd
- Backend: express + mongodb

This repository is **frontend** part.

### Data API
I prepared [mock API](https://apifox.com/apidoc/shared-567e8a7f-ce65-4c99-9924-97e44579d780) for this react project.

   ```shell
   destination: 'https://mock.apifox.com/m1/3852138-0-default/api/:path*'
   ```


You can also use local nodejs server service with backend.
  
  ```shell
  destination: 'http://localhost:3005/api/:path*'
  ```

### System Structure

### Demo

## Getting Started
1. Download the code, enter the project directory in terminal

2. Download dependencies
   ```shell
   npm install
   ```

3. Set data api at **next.config.js**

4. Run project
   ```shell
   npm run dev
   ```

5. Visit *localhost:3000/login*

6. Login with admin or user account

- account: admin password: admin
- account: user password: user
