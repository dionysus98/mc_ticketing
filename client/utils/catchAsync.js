const catchAsync = async (asyncCB, onFail = false) => {
  try {
    return await asyncCB();
  } catch (err) {
    if (onFail) {
      return onFail(err);
    } else {
      console.log(err);
    }
  }
};

export default catchAsync;
