# Video Collaboration "VideoCollab"

Website that allows synchronous video conversations and scripted video learning.

## Getting Started

The project contains a backend server and a client (folder "client")

**Tester**
(Notizen von Niels Seidel)
lehrer@lehrer.de   lehrer
schueler@schueler.de schueler
schueler@schueler2.de schueler

### Installing required npm packages of client and server

From root directory:

```
npm run client-install
npm install
npm audit fic

```

or via script:

```
npm run client-install
npm install
```

### Development environment

Starts backend server on port 5000 and development server (serves client assets) on port 3000:

From root directory:

```
npm run dev
```

Open "http://localhost:3000/" in a browser (Chrome or Firefox)

### Local Development database




## Deployment

### provide environment

provide .env file with following content in root directory:

```
MONGO_URI="mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false"
SECRET_OR_KEY="secret"
NODE_ENV="production"
SSL_CERT="path/to/certificate"
PORT=5000 // backend server port

```

### seed
On start Seed User will be created
E-Mail: testlehrer@web.de
Password: testlehrer
Role: TRAINER

E-Mail: testschueler1@web.de
Password: testschueler1
Role: STUDENT

E-Mail: testschueler2@web.de
Password: testschueler2
Role: STUDENT

### build optimized client build

From root directory:

```
cd client
npm run-script build
```

### start backend & web server

From root directory:

```
npm start
```

## Authors

- **Markus Hermes**
- **Jost Fromhage**

## License

This project is licensed under the MIT License
