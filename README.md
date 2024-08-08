# DevNews en Español

![DevNews en Español](https://project-blog-api-client.vercel.app/devnews-sn-logo.jpg)

## Descripción

**DevNews en Español** es una plataforma que recopila las noticias más importantes del día en el mundo del desarrollo de software y las publica automáticamente en un blog. Además, comparte los títulos de estas noticias en LinkedIn, atrayendo a los usuarios a leer más en el blog.

## Características

- Recopilación automática de las noticias más top del último día de **Dev.to** a través de su API
- Publicación de artículos en un blog con resúmenes y traducciones generados mediante la IA de **OpenAI** a través del **SDK de Vercel**.
- Publicación de los títulos de las noticias en **LinkedIn** con un enlace al blog (uso de la API de LinkedIn).
- El servidor es un servidor **Express** que sirve una **API RESTful** para uso de un cliente **React** que hace uso de componentes de la librería **Material UI**.
- La autenticación de usuarios se realiza mediante **JSON Web Token**.
- El administrador y los usuarios estandar tienen distintos tipos de funcionalidad. Solo el admin puede publicar Posts, actualizarlos y eliminarlos.
- Los usuarios estandar pueden comentar en los posts.

## Requisitos

- Node.js
- React
- Cuenta de LinkedIn con permisos API configurados
- Cuenta de Cloudinary
- Cuenta de Vercel

## Configuración

1. **Clonar el repositorio:**

   git clone https://github.com/Veregorn/project-blog-api.git
   cd project-blog-api

2. **Instalar las dependencias:**

    npm install

3. **Configurar las variables de entorno:**

    Crea un archivo .env en el directorio raíz con las siguientes variables:

    LINKEDIN_CLIENT_ID=your_linkedin_client_id
    LINKEDIN_BEARER_TOKEN=your_linkedin_bearer_token
    OPENAI_API_KEY=your_openai_api_key
    REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    REACT_APP_CLOUDINARY_API_KEY=your_cloudinary_api_key
    REACT_APP_CLOUDINARY_API_SECRET=your_cloudinary_api_secret

4. **Configuración en Vercel:**

    Asegúrate de configurar las mismas variables de entorno en el dashboard de Vercel.

## Uso

### Generar y Compartir Posts

1. **Botón "Generate Posts":**

    Solo el administrador puede ver y hacer clic en el botón "Generate Posts". Este botón:

        Recupera las 3 noticias más top del último día en Dev.to.
        Publica estas noticias en el blog.
        Comparte una publicación en LinkedIn con los títulos de las noticias y un enlace al blog.

2. **Visualización de los Artículos:**

    Los artículos publicados estarán disponibles en la URL de tu blog alojado en Vercel.

## Desarrollo

1. **Ejecutar el servidor localmente:**

    npm run dev

2. **Despliegue en Vercel:**

    Sigue las instrucciones de Vercel para desplegar tu proyecto. Asegúrate de que las variables de entorno estén configuradas correctamente.

## Contribuir

Las contribuciones son bienvenidas! Siéntete libre de abrir un issue o enviar un pull request.

## Licencia

Este proyecto está licenciado bajo la MIT License.