export const catchAsync = async (asyncCB: Function) => {
  try {
    return await asyncCB();
  } catch (err) {
    console.log(err);
  }
};
