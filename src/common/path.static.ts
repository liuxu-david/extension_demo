export const staticPath = {
  token: ['POST', '/oauth/token'],
  dept: {
    create: ["POST", "/dept"],
    update: ["PUT", "/dept"],
    delete: ["DELETE", "/dept"], 
    query:['GET',"/dept"]
  },
  user: {
    create: ["POST", "/user"],
    update: ["PUT", "/user"],
    delete: ["DELETE", "/user"],
    query:['GET',"/user"]
  }
}

export const otherStaticPath = {
  token: ['GET', '/gettoken'],
  dept: ['GET', '/department/list'],
  user: ['GET', '/user/list'],
}