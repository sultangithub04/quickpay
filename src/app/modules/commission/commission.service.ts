import { Commission } from "./commission.model";


const getCommmission = async () => {
  const settings = await Commission.findOne();
  return settings;
};

export const CommissionService = {
 getCommmission
};
