import { backend } from "@inplan/adapters/apiCalls";
import gitInfo from "./babel.macro";

async function getVersion() {
  let frontendVersion = gitInfo();
  frontendVersion = frontendVersion
    ? `HEAD ${frontendVersion.slice(0, 5)}`
    : process.env.REACT_APP_VERSION;

  let backendVersion;
  try {
    const {
      data: { git_head: gitHead, application_version: version },
    } = await backend.get("description");

    backendVersion = gitHead ? `HEAD ${gitHead.slice(0, 5)}` : version;
  } catch (ex) {
    backendVersion = "unknown";
  }

  return {
    frontendVersion,
    backendVersion,
  };
}

export default getVersion;
