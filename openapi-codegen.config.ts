import {
  generateSchemaTypes,
  generateReactQueryComponents,
} from "@openapi-codegen/typescript";
import { defineConfig } from "@openapi-codegen/cli";
export default defineConfig({
  budget: {
    from: {
      source: "url",
      url: "http://localhost:7275/api/swagger.json",
    },
    outputDir: "src/api",
    to: async (context) => {
      const filenamePrefix = "budget";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});
