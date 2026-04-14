
const positiveIntOrNull = (value: any, condition = (v: number) => true) => {
  return Number.isInteger(value) && value > 0 && condition(value) ? value as Number : null;
}
const stringOrNull = (value: any, condition = (v: string) => true)  => {
  return typeof value == "string" && condition(value) ? value : null;
}

export {
  positiveIntOrNull,
  stringOrNull
}