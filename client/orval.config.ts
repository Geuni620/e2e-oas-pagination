export default {
  "product-file-transfomer": {
    output: {
      mode: "single",
      target: "./src/api/product.ts",
      schemas: "./src/model",
      client: "fetch",
    },
    input: {
      target: "./product.yaml",
    },
  },
};
