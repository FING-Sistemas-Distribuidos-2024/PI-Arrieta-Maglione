# Sistemas Distribuidos
## Trabajo Práctico Integrador

### Integrantes
- Nahuel Arrieta
- Andrés Maglione

## Descripción
La siguiente aplicación permite realizar votaciones multiusuario en tiempo real. Los clientes pueden añadir nuevas opciones, votar por las opciones existentes y ver los resultados en tiempo real.

### Arquitectura
La aplicación utiliza una arquitectura cliente-servidor con las siguientes particularidades:
- El cliente obtiene los datos iniciales a través de peticiones HTTP. También se utiliza HTTP para votar por una opción, agregar una opción nueva o eliminar una opción.
- Cada cliente, a su vez, mantiene una conexión WebSocket con el servidor para recibir actualizaciones en tiempo real.
- Cuando un cliente realiza una acción, el servidor escribe los cambios en un bus de eventos pub/sub utilizando Redis.
- Cada instancia del servidor se suscribe al bus de eventos para recibir las actualizaciones. Las notificaciones son enviadas a los clientes que están conectados a través de WebSocket.

### Servidor
Fue programado utilizando Go. En el directorio `/server` se puede encontrar el código para el servidor junto con su Dockerfile y su manifiesto de Kubernetes.

### Cliente
Fue programado utilizando Next.js. En el directorio `/client` se puede encontrar el código para el cliente junto con su Dockerfile y su manifiesto de Kubernetes.

### Instalación
Actualmente, la configuración debe realizarse de la siguiente manera:
1. Instalar Redis usando Helm:
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install redis bitnami/redis
```
2. Desplegar el back-end desde el directorio `/server`:
```bash
kubectl apply -f manifests/service.yaml
```

3. Desplegar el front-end desde el directorio `/client`. Antess de ejecutar el comando, se debe modificar la variable de entorno `WS_URL` por la IP ública del servidor:
```bash
kubectl apply -f manifests/service.yaml
```

Luego, el front-end debería estar accesible en la IP que le asigne el LoadBalancer.

### Información extra
La aplicación se encuentra desplegada con una IP pública para la VPN de la cátedra. La misma está accesible (al momento de la creación de este readme) en la siguiente dirección: [http://10.230.110.13](http://10.230.110.13).

Además de los despliegues para Kubernetes, en la raíz del proyecto se puede encontrar un archivo `compose.yml` que permite levantar la aplicación usando Docker Compose.
