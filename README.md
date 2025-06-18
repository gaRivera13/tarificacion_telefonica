## Instrucciones de despliegue de aplicación.

#### Instalación y configuración de BackEnd

>Importante: El despliegue del sistema esta pensado y ejecutado en sistema windows por lo que las instrucciones estan basadas en los comandos y funciones del sistema operativo antes mencionado.

 Requisitos previos:
Para la correcta ejecución del proyecto es necesario tener instalado:
- `pip`

- `Python`

>Todos los comandos se deben ejecutar en una ventana de comandos cmd, asegurando que se este en la carpeta raíz del proyecto.



>#####Ejemplo de ruta de proyecto
C:\Users\nombreUsuario\CarpetaProyecto

Creacion de ambiente virtual, el nuestro tiene de nombre "env", pero no es obligatorio que sea el mismo si usted desea cambiarlo.
```
python -m venv env 
```

Activar ambiente virtual
```
env\Spricts\activate 
```

Para asegurarse que el ambiente virtual este activo, en la termina debe salir algo como esto, usando VSCode o cmd

---

>(.venv) C:\Users\nombreUsuario\CarpetaProyecto

---

Una ves con el ambiente virtual activo se deben instalar los siguentes sequerimientos para que todas las funciones del sistemas esten operativas correctamente
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

---

#### Instalación del FrontEnd

- Requisitos previos:
Para el correcto funcionamiento del Frontend se necesita instalar:

- `Node.js`

Una ves creado el BackEnd del proyecto, se necesita instalar Angular, la version que se uso en el proyecto fue la 18 por lo que es importante que sea la misma versión.
```
    npm install -g @angular/cli@18
```
Luego se debe dirigir a la carpeta "FrontEnd" y ejecutar el siguiente comando
```
    npm install
```

#### Ejecución de Base de Datos

>######Importante: Se debe hacer un cambio en settings.py para que la base de datos pueda funcionar correctamente

En DATABASES en el apartado:
````
"default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "gestion_telefonica",
        "USER": "root",
        "PASSWORD": "",
        "HOST": "db",
        "PORT": 3306,
````
Se debe cambiar el HOST de "db" a "localhost" quedando de la siguiente manera
````
"default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "gestion_telefonica",
        "USER": "root",
        "PASSWORD": "",
        "HOST": "localhost",
        "PORT": 3306,
````

---

---

Requisitos previos
Se debe tener instalado alguno de estos visualizadores para base de datos:
- ``MySQL Workbench``
- ``XAMPP``

Para XAMPP en el panel de control se debe activar los modulos de "Apache" y "MySQL". Donde despues se debe apretar "admin" para ser redirigido a "phpMyAdmin"

"poner imange aqui xd"

Una ves ahi se debe crear una nueva base de datos precionando en el menu lateral la opcion de "Nuevo" donde sera redirigido a una interfaz para poder ponerle el nombre de la nueva base de datos en este caso de nombre:
````
gestion_telefonica
````
Precione "crear" para que se cree la base de datos.
Luego en el BackEnd del proyecto, desde una terminal cmd, se debe ejecutar las migraciones correspondientes
````
python manage.py makemigrations
python manage.py migrate
````

#### Lanzamiento del sistema

Una vez instalados el Frontend y el Backend abrir dos terminales cmd.

En una se debe inicializar el BackEnd desde la raiz del proyecto
``(.venv) C:\Users\nombreUsuario\CarpetaProyecto`` 

Y ejecutar el siguiente comando 
````
cd backend
````

una ves dentro se debe ejecutar el comando
````
python manage.py runserver
````
Si todo lo anterior fue correctamente instalado deberia aparecer lo siguente dando la url del backend de administracion de django

---

Para inicializar el FrontEnd por otro lado desde otra terminal se debe acceder a la ruta principal:
``C:\Users\nombreUsuario\CarpetaProyecto`` 

y ejecutar el sigiente comando para entrar al FrontEnd del proyecto
````
cd frontend
````

Dodne despues se podra usar el siguiente comando para inicializar el servicio de Angular
````
ng serve
````

En la terminal deberia salir asi:


Y al ir a la URL que sale en el terminal "http://localhost:4200/" te llevara al Login principal del sistema
