# Bulk Email Processor

Select an email template from the list of templates available. Upload an excel file with list of emails to whom you want to sent an email template. You can view logs of the email that was sent.

This app uses Node.js/Express/MongoDB with passport Local Auth for authentication, using email and JSONWebTokens for further verification. This app uses queuing mechanism for the processing of emails - amqlib npm module with rabitMQ message broker services. This app uses websockets (ws npm module) for the real time transmission of the logs of the email sent from server to the client. Additionally, it contains dockerfile for the dockerization of an application.

Usage
Create a .env file in the root folder.
Add PORT, SECRET, MONGODB_URL, JWT_SECRET, HOST, MAIL_PORT, USER and PASS to the .env file.

# Install dependencies

npm install

# Run in development

npm run dev

# Run in production

npm start

**Dockerizing the application**
Add the ENV variables in the DOCKERFILE.
Open the docker-desktop to start the docker engine in your pc.
RUN `docker build -t <DOCKER-IMAGE-NAME> .`
After the image is built successfully, run
`docker run <DOCKER-IMAGE-NAME>`
To run locally, run
`docker run -p 8080:3000 docker.io/<DOCKER-IMAGE-NAME>`
open http://localhost:8080.
