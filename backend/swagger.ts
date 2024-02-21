import swaggerJsDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AREA API',
      version: '1.0.0',
      description: 'API for AREA project',
    },
  },
  apis: ['./src/**/*.ts'],
};

const specs = swaggerJsDoc(options);

export default specs;
