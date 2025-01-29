/* eslint-disable import/no-extraneous-dependencies */
const CracoAlias = require("craco-alias");
const path = require("path");

const src = path.resolve(__dirname, "src");

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "options",
        baseUrl: ".",
        aliases: {
          "@inplan": src,
        },
      },
    },
  ],
};
