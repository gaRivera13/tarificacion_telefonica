# Instrucciones de Despliegue de Aplicación

## Instalación y configuración de BackEnd

> **Importante:** El despliegue del sistema está pensado y ejecutado en sistema Windows, por lo que las instrucciones están basadas en los comandos y funciones del sistema operativo antes mencionado.

### Requisitos previos
Para la correcta ejecución del proyecto es necesario tener instalado:

- `pip`
- `Python`

> Todos los comandos se deben ejecutar en una ventana de comandos (cmd), asegurando que se esté en la carpeta raíz del proyecto.

#### Ejemplo de ruta de proyecto
```
C:\Users\nombreUsuario\CarpetaProyecto
```

### Creación de ambiente virtual

El nuestro tiene de nombre "env", pero no es obligatorio que sea el mismo si desea cambiarlo.

```
python -m venv env
```

### Activar ambiente virtual

```
env\Scripts\activate
```

Para asegurarse de que el ambiente virtual está activo, en la terminal debe salir algo como esto, usando VSCode o cmd:

```
(.venv) C:\Users\nombreUsuario\CarpetaProyecto
```

### Instalación de requerimientos

Una vez con el ambiente virtual activo se deben instalar los siguientes requerimientos para que todas las funciones del sistema estén operativas correctamente:

```
pip install django==5.2
pip install djangorestframework
pip install django-cors-headers
pip install djangorestframework-simplejwt
pip install mysqlclient
pip install pandas
pip install openpyxl
```

---

## Instalación del FrontEnd

### Requisitos previos

Para el correcto funcionamiento del FrontEnd se necesita instalar:

- `Node.js`

Una vez creado el BackEnd del proyecto, se necesita instalar Angular. La versión que se usó en el proyecto fue la 18, por lo que es importante que sea la misma:

```
npm install -g @angular/cli@18
```

Luego se debe dirigir a la carpeta `FrontEnd` y ejecutar el siguiente comando:

```
npm install
```

---
---
## Ejecución de Base de Datos

> **Importante:** Se debe hacer un cambio en `settings.py` para que la base de datos pueda funcionar correctamente.

En la seccion `DATABASES`, en el apartado:

```
"default": {
    "ENGINE": "django.db.backends.mysql",
    "NAME": "gestion_telefonica",
    "USER": "root",
    "PASSWORD": "",
    "HOST": "db",
    "PORT": 3306,
}
```

Se debe cambiar el `HOST` de `"db"` a `"localhost"` quedando de la siguiente manera:

```
"default": {
    "ENGINE": "django.db.backends.mysql",
    "NAME": "gestion_telefonica",
    "USER": "root",
    "PASSWORD": "",
    "HOST": "localhost",
    "PORT": 3306,
}
```

### Requisitos previos

Se debe tener instalado alguno de estos visualizadores para base de datos:

- `MySQL Workbench`
- `XAMPP`

Para XAMPP, en el panel de control se deben activar los módulos de **Apache** y **MySQL**. Luego presionar **Admin** para ser redirigido a `phpMyAdmin`.

![Image](https://github.com/user-attachments/assets/9df79955-6bfd-4dd0-a6a0-8a1bf5e54877)

![Image](https://github.com/user-attachments/assets/118bbae8-05f4-498e-91e7-16f1a8a32827)

Una vez ahí, se debe crear una nueva base de datos presionando en el menú lateral la opción **Nuevo**, donde será redirigido a una interfaz para escribir el nombre de la nueva base de datos, en este caso:

```
gestion_telefonica
```

Presione **Crear** para que se cree la base de datos.
![Image](https://github.com/user-attachments/assets/fb83116d-6a02-4679-8682-d1191adab418)

### Alternativa: Creación de base de datos usando MySQL Workbench

Para el caso de **MySQL Workbench**, en lugar de utilizar `phpMyAdmin`, puedes ejecutar directamente el siguiente script desde una conexión local con el usuario **root** (sin contraseña):

```sql
-- Crear la base de datos
CREATE DATABASE gestion_telefonica CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Conceder todos los permisos al usuario 'root' desde localhost sobre esta base de datos
GRANT ALL PRIVILEGES ON gestion_telefonica.* TO 'root'@'localhost';

-- Aplicar los cambios
FLUSH PRIVILEGES;

```

Esto creará correctamente la base de datos gestion_telefonica con la codificación adecuada y los permisos necesarios para que Django pueda gestionarla, permitiendo así la creación de las tablas mediante las migraciones.

Luego, en el BackEnd del proyecto, desde una terminal (cmd), se deben ejecutar las migraciones correspondientes:

```
python manage.py makemigrations
python manage.py migrate
```

---

## Lanzamiento del sistema

Una vez instalados el FrontEnd y el BackEnd, abrir dos terminales (cmd).

### Lanzamiento del Sistema BackEnd

En una terminal, inicializar el BackEnd desde la raíz del proyecto:

```
(.venv) C:\Users\nombreUsuario\CarpetaProyecto
```

Ejecutar:

```
cd backend
```

Una vez dentro:

```
python manage.py runserver
```

Si todo fue correctamente instalado, debería aparecer lo siguiente, dando la URL del backend de administración de Django.
![Image](https://github.com/user-attachments/assets/bc317af6-bbe3-4012-b103-3f05a4537370)

### Lanzamiento Sistema FrontEnd

Desde otra terminal, acceder a la ruta principal:

```
C:\Users\nombreUsuario\CarpetaProyecto
```

Ejecutar el siguiente comando para entrar al FrontEnd del proyecto:

```
cd frontend
```

Luego se podrá usar el siguiente comando para inicializar el servicio de Angular:

```
ng serve
```

En la terminal debería salir algo como:

```
✔ Compiled successfully.

** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
```
![Image](https://github.com/user-attachments/assets/908a836e-c791-49ae-83f2-216b6c598960)


Al ir a la URL `http://localhost:4200/` se accederá al login principal del sistema donde se podran ingresar las credenciales de administrador o de responsable de unidad.
![Image](https://github.com/user-attachments/assets/fce948b7-aa9a-4ba1-8036-087d09391ede)
