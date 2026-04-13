declare module "dockerode" {
  class Docker {
    constructor(options?: any);

    listContainers(options?: any): Promise<ContainerInfo[]>;;

    createContainer(options?: any): Promise<any>;

    getContainer(id: string): Container;
  }

  class Container {
    id: string;

    start(): Promise<void>;
    stop(): Promise<void>;
    remove(options?: any): Promise<void>;
  }

  interface ContainerInfo {
    Id: string;
    Names: string[];
    Image: string;
    State: string;
    Status: string;
    Ports: Any[],
    NetworkSettings: {
      Networks: Any
    },
    Labels: {
      "com.docker.compose.project": string | undefined
    }
  }

  export = Docker;
}