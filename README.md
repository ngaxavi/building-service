
## Description
MongoDB database and Kafka Broker are required to run this microservice. It works together with [Devops-Webapp](https://github.com/ngaxavi/devops-webapp), [Tenant-Service](https://github.com/ngaxavi/tenant-service) und [Device-Service](https://github.com/ngaxavi/device-service)

## Installation

```bash
# Mongodb
$ docker run --name database -d -p 27017:27017 mongo

$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

 [MIT licensed](LICENSE).
