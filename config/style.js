const sassOptions = {
  silenceDeprecations: [],
  prependData: `@use 'sass:math'; @use 'src/scss/utils/global-import' as *;`,
  logger: {
    debug: str => console.log(`\x1b[33m \n\n${str}\n \x1b[0m`),
  },
}

export default sassOptions
