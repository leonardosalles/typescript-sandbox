function webpack(config) {
  const fileLoaderRule = config.module.rules.find((rule) =>
    rule.test?.test?.('.svg'),
  );

  config.module.rules.push(
    {
      ...fileLoaderRule,
      test: /\.svg$/i,
      resourceQuery: { not: /assets/ },
    },
    {
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      resourceQuery: /assets/,
      use: ['@svgr/webpack'],
    },
  );

  return config;
}
