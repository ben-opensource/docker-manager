import { getContainers } from "@/database/docker.js";
import { Request as Req, Response as Res, NextFunction as Next } from "express";

const containers = async (req: Req, res: Res) => {
  const containers = await getContainers(req.session.userId ?? -1, req.session.access);
  res.render("dashboard/containers", {
    title: "Containers",
    layout: "dashboard/layout",
    containers: containers?.map(c => ({ 
      name: c.Names[0].replace('/',''),
      id: c.Id, 
      image: c.Image, 
      status: c.Status, 
      state: c.State,
      ports: c.Ports,
      networks: c.NetworkSettings.Networks,
      stack: c.Labels["com.docker.compose.project"] ?? "",
    })) ?? []
  });
}

export {
  containers
}