
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
  localUsersAllowed: boolean
}
let config: {

} = {};
const loadLoginConfig = () => {
  let loginConfig: LoginConfig = {
    localUsersAllowed: true
  };
  try {
    const fileContents = fs.readFileSync("./config/login.yml", "utf8");
    const data = yaml.load(fileContents) as LoginYmlConfig;

    loginConfig.localUsersAllowed = data.local?.enabled ?? true
  } catch (error) {
    console.error(error);
  }
}

const loadConfig = () => {
  loadLoginConfig();
}

export { loadConfig, config }