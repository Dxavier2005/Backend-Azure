# Biblioteca API (NestJS)

API REST para la gestión de una biblioteca, desarrollada con NestJS  
Utiliza PostgreSQL para datos relacionales mediante TypeORM y MongoDB para comentarios y mensajes mediante Mongoose

## Requisitos

- Node.js v18 o superior
- PostgreSQL
- MongoDB

---

## Configuración

## 1.Instalar dependencias

npm install

## 2.Variables de entorno
Crear un archivo .env en la raíz del proyecto:

PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=biblioteca

MongoDB
MONGO_URI=mongodb://localhost:27017/biblioteca

JWT
JWT_SECRET=supersecret
JWT_EXPIRES_IN=1d

## 3. Ejecutar la aplicación

### Desarrollo
npm run start:dev

### Produccion
npm run build
npm run start:prod

## Autenticacion y seguridad 

Mediante JWT y RolesGuard

## 4. Endpoints

Auth

Users

Categorías

Libros

Editoriales

Idiomas

Tipo-libro

Estado-libro

Prestamos

Reservas

Multas

Comentarios

Mensajes

