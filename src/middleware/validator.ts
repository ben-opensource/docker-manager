import { Request as Req, Response as Res, NextFunction as Next } from "express";

export class ValidationReq {
  protected prop: string = '';
  protected requirements: ((value:any, req:Req,res:Res, setDefault: (d: string) => void)=>string)[] = [];
  setProp = (prop: string) => {
    this.requirements.push((value,req,res,setDefault) => {
      this.prop = prop;
      return '';
    });
    return this;
  }
  default = (defaultValue: string, condidtion: (s: string) => boolean = ()=>true) => {
    this.requirements.push(
      (value, req, res, setDefault) => {
        if (!(typeof value == "string") || !condidtion(value))
          setDefault(defaultValue);
        return '';
      }
    );
    return this;
  }
  isString = (errorMessage: string, condidtion: (s: string) => boolean = ()=>true) => {
    this.requirements.push((value) => {
      if (!(typeof value == "string") || !condidtion(value))
          return errorMessage;
        return '';
    });
    return this;
  }
  custom = (errorMessage: string, customFunc: (value:string,req:Req,res:Res)=>boolean) => {
    this.requirements.push((value, req, res) => {
      if (customFunc(value, req, res))
        return '';
      return errorMessage;
    });
    return this;
  }
  notEmptyString = (errorMessage: string) => this.isString(errorMessage, s => s !== '');
}

export class BodyValidator extends ValidationReq {
  
  private onError: (req:Req,res:Res)=>void;
  constructor(prop:string,onError:(req:Req,res:Res)=>void) {
    super();
    this.prop = prop;
    this.onError = onError;
  }
  getMiddleware = () => {
    return (req: Req, res: Res, next: Next) => {
      for (const func of this.requirements) {
        const message = func(req.body[this.prop], req, res, (s)=>req.body[this.prop] = s);
        if (message === '') //if no error message -> go to the next validator
          continue;
        res.locals.validatorError = message; //set error message -> dont call next()
        return this.onError(req,res);
      }
      next();
    }
  }
}
export class Validator {
  onError: (req:Req,res:Res)=>void;
  constructor(onError:(req:Req,res:Res)=>void) {
    this.onError = onError;
  }
  body = (prop: string) => {
    return new BodyValidator(prop, this.onError);
  }
}
