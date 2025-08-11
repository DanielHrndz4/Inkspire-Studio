const createPayload = (user) => {
  const pl = {
    name: user.name + " " + user.lastname,
    email: user.email,
    tel: user.tel,
  };
  return pl;
};

module.exports = createPayload