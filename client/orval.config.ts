export default {
  "product-file-transfomer": {
    output: {
      mode: "single",
      target: "./src/api/product.ts",
      schemas: "./src/model",
      client: "fetch",
      baseUrl: "http://localhost:8787",
    },
    input: {
      target: "./product.yaml",
    },
  },
};
