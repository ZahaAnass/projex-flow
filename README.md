# 🚀 ProjexFlow

ProjexFlow is a modern, multi-role Project Management SaaS built with **Laravel 11**, **React**, **Inertia.js**, and **Tailwind CSS**. It features strictly scoped workspaces for System Admins, Team Leaders, Users, and Clients.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **PHP** (8.2 or higher)
- **Composer** (Dependency Manager for PHP)
- **Node.js & npm** (Javascript environment)

---

## 🛠️ Installation Guide

Follow these steps to get your local development environment up and running.

### 1. Clone the repository
```bash
- cd projexflow
- composer install
- npm install 
- cp .env.example .env
- php artisan key:generate
- php artisan migrate:fresh --seed
- composer run dev
