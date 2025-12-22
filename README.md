# LoanLink

LoanLink is a role-based Loan Management System where borrowers can apply for loans, managers can approve/reject applications and manage their own loans, and admins can manage users and system loans. This repository contains the React frontend.

## Purpose
- Provide a clean UI for borrowers to browse loans and apply
- Provide dashboards for Admin and Manager with secure access (JWT + role based)
- Support Stripe fee payments for approved loan applications

## Live URL
- Client: <YOUR_CLIENT_LIVE_URL>
- Server API: <YOUR_SERVER_LIVE_URL>

## Key Features
- Firebase Authentication (Email/Password + Google)
- JWT cookie-based authorization (httpOnly cookie)
- Role-based dashboards:
  - Borrower Dashboard: Apply loan, My Loans, Payment status
  - Manager Dashboard: Add loan, Manage loans, Pending/Approved applications
  - Admin Dashboard: Manage users, Loan Applications, All Loans, control “Show on Home”
- Apply Loan:
  - Dynamic loan selection from dropdown (if coming from banner)
  - Auto shows interest rate & max limit from DB
  - React Hook Form validation (amount max limit, 10 digit contact etc.)
  - Summary confirmation modal before submit
- Stripe Checkout Payment:
  - Pay $10 fee after manager approves
  - Paid badge shows full payment details modal
- Smooth UI:
  - Framer Motion animations
  - Recharts graphs for overview dashboard (Admin / Manager / Borrower)

## Tech Stack
- React + Vite
- Tailwind CSS + DaisyUI
- TanStack Query (React Query)
- Firebase Auth
- SweetAlert2
- Stripe Checkout (redirect flow)
- Recharts
- Framer Motion
- React Hook Form
- React Router DOM

## NPM Packages Used
- react
- react-router-dom
- @tanstack/react-query
- firebase
- sweetalert2
- framer-motion
- react-hook-form
- recharts
- tailwindcss
- daisyui
