const { createMacro } = require("babel-plugin-macros");
const { execSync } = require("child_process");

const git = execSync("git rev-parse HEAD").toString().trim();

function gitInfo({ references }) {
  const sourceString = `(function() { return ${JSON.stringify(git)}; })`;
  references.default.forEach((referencePath) => {
    referencePath.replaceWithSourceString(sourceString);
  });
}

// `createMacro` is simply a function that ensures your macro is only
// called in the context of a babel transpilation and will throw an
// error with a helpful message if someone does not have babel-plugin-macros
// configured correctly
module.exports = createMacro(gitInfo);
