import Docker from "dockerode";
import { Access, getStacksForUser } from "./database.js";
const docker = new Docker({
  socketPath: "/var/run/docker.sock",
});

const getContainers = async (userId: number, userAccess: Access = Access.USER_READ_ONLY) => {
  try {
    const stacks = getStacksForUser(userId);
    const containers = await docker.listContainers({ all: true });
    if (userAccess == Access.ADMIN) {
      return containers;
    }
    return containers.filter(c => stacks.includes(c.Labels["com.docker.compose.project"] ?? ""));
  } catch (err) {
    return null;
  }
}
const getContainerCount = async (userId: number, userAccess: Access = Access.USER_READ_ONLY) => {
  const containers = await getContainers(userId, userAccess);
  return containers?.length ?? 0;
}

export {
  getContainers,
  getContainerCount
}