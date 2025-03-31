# Guía de Instalación y Uso del Proyecto

## Imágenes del Programa

Puedes ver las imágenes del programa en el siguiente enlace:
[Ver Imágenes](https://drive.google.com/file/d/1oShbZ_rpsAewsApctX6UElkwOTl7cogc/view?usp=sharing)

---

## Pasos para Ejecutar el Proyecto

### Backend

Para ejecutar el backend, sigue estos pasos:

1. **Iniciar los db con Docker:**

   ```sh
   docker-compose up --build
   ```

2. **Instalar dependencias:**

   ```sh
   npm install
   ```

3. **Iniciar el servidor en modo desarrollo:**

   ```sh
   npm run start:dev
   ```



### Frontend

Para iniciar el frontend, usa el siguiente comando:

```sh
npm run dev
```

---

## Uso de la Aplicación

1. **Creación de Usuario Global**

   - La aplicación crea un usuario global por defecto para que puedas iniciar sesión:
     - **Correo:** `saespibt@gmail.com`
     - **Contraseña:** `holaMundo`

2. **Inicio de Sesión**

   - Al ingresar con el usuario global, verás una tabla vacía si no hay ventas registradas.

3. **Creación de Usuarios o Sales**

   - Para crear nuevos usuarios, debes hacerlo mediante Postman, curl u otra herramienta para realizar consultas directas a la API.

---

## Enlace a las Imágenes

Puedes ver imágenes  del programa aquí:
[Ver Imágenes](https://drive.google.com/file/d/1oShbZ_rpsAewsApctX6UElkwOTl7cogc/view?usp=sharing)



⚠ Nota: Adjunto otro repositorio donde se puede ejecutar todo con docker no esta como principal porque esta fallando el npm en el backend

[https://github.com/samuelespinosa/FullBancoVentasApp](https://github.com/samuelespinosa/FullBancoVentasApp)
