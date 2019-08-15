const CracoStylusPlugin = {
  overrideWebpackConfig: ({ webpackConfig, pluginOptions }) => {
    const {
      getLoader,
      loaderByName,
      throwUnexpectedConfigError
    } = require('@craco/craco')

    const throwError = (message, githubIssueQuery) =>
      throwUnexpectedConfigError({
        packageName: 'craco-stylus',
        message,
        githubIssueQuery
      })
    const stylusExtension = /\.styl$/
    pluginOptions = pluginOptions || {}

    const stylusRule = {
      test: stylusExtension,
      use: [
        {
          loader: require.resolve('style-loader'),
          options: pluginOptions.styleLoaderOptions || {}
        },
        {
          loader: require.resolve('css-loader'),
          options: pluginOptions.cssLoaderOptions || {}
        },
        {
          loader: require.resolve('stylus-loader'),
          options: pluginOptions.stylusLoaderOptions || {}
        },
      ]
    }

    const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf)

    if (!oneOfRule) {
      throwError(
        'Can\'t find a \'oneOf\' rule under module.rules in the webpack config!',
        'webpack+rules+oneOf'
      )
    }

    oneOfRule.oneOf.push(stylusRule)
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

    fileLoaderMatch.loader.exclude.push(stylusExtension)
    return webpackConfig
  }
}


module.exports = {
  plugins: [
    { plugin: CracoStylusPlugin },
  ],
}
