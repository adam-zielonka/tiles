const getCracoLoaderPlugin = ({ extension, name, loaders }) => {
  return {
    overrideWebpackConfig: ({ webpackConfig, pluginOptions }) => {
      const {
        getLoader,
        loaderByName,
        throwUnexpectedConfigError
      } = require('@craco/craco')

      const throwError = (message, githubIssueQuery) =>
        throwUnexpectedConfigError({
          packageName: 'craco-'+name,
          message,
          githubIssueQuery
        })
      pluginOptions = pluginOptions || {}

      const rule = {
        test: extension,
        use: loaders.map(l => {
          return {
            loader: require.resolve(l+'-loader'),
            options: pluginOptions[l+'LoaderOptions'] || {}
          }
        }),
      }

      const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf)

      if (!oneOfRule) {
        throwError(
          'Can\'t find a \'oneOf\' rule under module.rules in the webpack config!',
          'webpack+rules+oneOf'
        )
      }

      oneOfRule.oneOf.push(rule)
      const { isFound, match: fileLoaderMatch } = getLoader(
        webpackConfig,
        loaderByName('file-loader')
      )

      if (!isFound) {
        throwError(
          'Can\'t find file-loader in the webpack config!',
          'webpack+file-loader'
        )
      }

      fileLoaderMatch.loader.exclude.push(extension)
      return webpackConfig
    }
  }
}

module.exports = {
  plugins: [
    { plugin: getCracoLoaderPlugin({name: 'stylus', extension: /\.styl$/, loaders: ['style', 'css', 'stylus']}) },
    { plugin: getCracoLoaderPlugin({name: 'yaml', extension: /\.ya?ml$/, loaders: ['json', 'yaml']}) },
  ],
}
