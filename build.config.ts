export default {
  clean: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      minify: true,
    },
    output: {
      /*
      [Rollup] Entry module "src/index.ts" is using named and default exports together.Consumers of your bundle will have to use `chunk.default` to access the default export, which may not be what you want. Use `output.exports: "named"` to disable this warning.
      */
      exports: 'named',
    },
  },
}
