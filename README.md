# Preview
![Screenshot 2024-03-14 091823](https://github.com/sergiovforesto/teslo-shop/assets/107615935/c5209044-ea18-4963-89d8-4a23bff170e6)
![Screenshot 2024-03-14 092931](https://github.com/sergiovforesto/teslo-shop/assets/107615935/245f723e-68e3-4ff4-9e06-b04fc468b693)
![Screenshot 2024-03-14 093143](https://github.com/sergiovforesto/teslo-shop/assets/107615935/6b78aa2d-d56e-4d32-ae23-54f8f5fea75a)
![Screenshot 2024-03-14 093321](https://github.com/sergiovforesto/teslo-shop/assets/107615935/72d27cd7-c34f-4c6a-948a-47db70dc7c93)
![Screenshot 2024-03-14 093350](https://github.com/sergiovforesto/teslo-shop/assets/107615935/ba0f5b7c-d924-462d-a235-c3a1686af7f0)
![Screenshot 2024-03-14 093423](https://github.com/sergiovforesto/teslo-shop/assets/107615935/0c897677-b3c3-403e-9cdb-63eeb6090f2f)



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
