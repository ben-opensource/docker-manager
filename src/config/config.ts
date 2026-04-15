
import fs from "fs";
import yaml from "js-yaml";

type LoginYmlConfig = {
  local?: {
    enabled?: boolean
  },
  oauth?: {
    [key: string]: {
      
    }
  }
}
type LoginConfig = {
  localUsersAllowed: boolean,
  oauthOptions: {
    [key: string]: {

    }
  }
}
let config: {
  login?: LoginConfig
} = {};
const loadLoginConfig = () => {
  let loginConfig: LoginConfig = {
    localUsersAllowed: true,
    oauthOptions: {}
  };
  try {
    const fileContents = fs.readFileSync("./config/login.yml", "utf8");
    const data = yaml.load(fileContents) as LoginYmlConfig;

    loginConfig.localUsersAllowed = data.local?.enabled ?? true
    loginConfig.oauthOptions = data.oauth ?? {}

    config.login = loginConfig;
    console.log(config.login)
  } catch (error) {
    console.error(error);
    return;
  }
}

const loadConfig = () => {
  loadLoginConfig();
}

export { loadConfig, config }