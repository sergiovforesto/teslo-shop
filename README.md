# Descripcion


## Correr en dev

1. clonar el repositorio
2. copiar el ```.env.template``` y renombrarlo a ```.env ```
3. Instalar Dependencias ``npm install ``
4. Levantar la base de datos ``docker compose up -d ``
5. Correr la migraciones de prisma ``npx prisma migrate dev `` (no tengas corriendo el proyecto)
6. Ejecutar seed ``npm run seed ``
7. Correr el proyecto ``npm run dev``
8. Limpiar el localStorage del navegador


## Correr en producción
``npm run build ``
``npm run start ``
