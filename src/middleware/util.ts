import { Request as Req, Response as Res, NextFunction as Next } from "express";

const passSessionToLayout = (req: Req, res: Res, next: Next) => {
  res.locals.session = req.session;
  next();
}

export {
  passSessionToLayout
}