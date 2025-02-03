const axios2 = require("axios");

const axios = {
  post: async (...args) => {
    try {
      const res = await axios2.post(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },

  get: async (...args) => {
    try {
      const res = await axios2.get(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },

  put: async (...args) => {
    try {
      const res = await axios2.put(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },

  delete: async (...args) => {
    try {
      const res = await axios2.delete(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },
};

const SERVER_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:3001";

describe("Authentication", () => {
  test("Signup succeeds ", async () => {
    jest.setTimeout(10000);
    const username = `3bob-${Math.random()}`;
    const password = "qwerty123";

    await axios.post(`${SERVER_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    const response = await axios.post(`${SERVER_URL}/api/v1/signin`, {
      username,
      password,
    });

    expect(response.status).toBe(200);
  });
  test("User is able to signup only once", async () => {
    jest.setTimeout(10000);
    const username = `1bob${Math.random()}`;
    const password = "qwerty123";
    const res = await axios.post(`${SERVER_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    expect(res.status).toBe(200);
    const newRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    expect(newRes.status).toBe(400);
  });
  test("Signup request fails if the username is empty", async () => {
    jest.setTimeout(10000);
    const username = `2bob${Math.random()}`;
    const password = "qwerty123";
    const response = await axios.post(`${SERVER_URL}/api/v1/signup`, {
      password,
    });
    expect(response.status).toBe(400);
  });
  test("Signin succeeds if the username and password are correct", async () => {
    jest.setTimeout(10000);
    const username = `3bob-${Math.random()}`;
    const password = "qwerty123";
    await axios.post(`${SERVER_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    const response = await axios.post(`${SERVER_URL}/api/v1/signin`, {
      username,
      password,
    });
    expect(response.status).toBe(200);
    expect(response.data.token).toBeDefined();
  });
  test("Signin fails if the username and password are incorrect", async () => {
    jest.setTimeout(10000);
    const username = `4bob${Math.random()}`;
    const password = "qwerty123";
    await axios.post(`${SERVER_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    const response = await axios.post(`${SERVER_URL}/api/v1/signin`, {
      username: "WrongUsername",
      password,
    });
    expect(response.status).toBe(403);
  });
});

// describe("User metadata ", () => {
//   let token = "";
//   let avatarId = "";
//   beforeAll(async () => {
//     const username = "Bob" + Math.random();
//     const password = "qwerty123";
//     const type = "admin";
//     await axios.post(`${SERVER_URL}/api/v1/signup`, {
//       username,
//       password,
//       type,
//     });
//     const res = await axios.post(`${SERVER_URL}/api/v1/signin`, {
//       username,
//       password,
//     });
//     expect(res.status).toBe(200);
//     token = res.body.token;
//     const avatarRes = await axios.post(
//       `${SERVER_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
//         name: "Admin",
//       },
//       { Headers: { authorization: `Bearer ${token}` } }
//     );
//     avatarId = avatarRes.body.avatarId;
//   });
//   //need to get the token before running endpoints
//   //avatar
//   test("user cant update their metadata with wrong avatarId", async () => {
//     const res = await axios.post(
//       `${SERVER_URL}/api/v1/user/metadata`,
//       {
//         avatarId: "12122211",
//       },
//       { Headers: { authorization: `Bearer ${token}` } }
//     );
//     expect(res.status).toBe(200);
//   });
//   test("user can update their metadata", async () => {
//     const res = await axios.post(
//       `${SERVER_URL}/api/v1/user/metadata`,
//       {
//         avatarId,
//       },
//       { Headers: { authorization: `Bearer ${token}` } }
//     );
//     expect(res.status).toBe(200);
//   });
//   test("user cant update their metadata coz auth is not present", async () => {
//     const res = await axios.post(
//       `${SERVER_URL}/api/v1/user/metadata`,
//       {
//         avatarId,
//       },
//       { Headers: { authorization: `Bearer ${token}` } }
//     );
//     expect(res.status).toBe(403);
//   });
// });

// describe("user avatar information", () => {
//   let token = "";
//   let avatarId = "";
//   let userId = "";
//   beforeAll(async () => {
//     const username = "Bob" + Math.random();
//     const password = "qwerty123";
//     const type = "admin";
//     const signupRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
//       username,
//       password,
//       type,
//     });
//     userId = signupRes.data.userId;
//     const res = await axios.post(`${SERVER_URL}/api/v1/signin`, {
//       username,
//       password,
//     });
//     expect(res.status).toBe(200);
//     token = res.body.token;
//     const avatarRes = await axios.post(
//       `${SERVER_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
//         name: "Admin",
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     avatarId = avatarRes.body.avatarId;
//   });

//   test("get user avatar info for a user ", async () => {
//     const res = await axios.get(
//       `${SERVER_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`,
//       { Headers: { authorization: `Bearer ${token}` } }
//     );
//     expect(res.data.avatars.length).toBe(1);
//     expect(res.data.avatars[0].userId).toBe(userId);
//   });
//   test("Available avatars list should contain the recently made avatar ", async () => {
//     const res = await axios.get(`${SERVER_URL}/api/v1/avatars`, {});
//     expect(res.data.avatars.length).not.toBe(0);
//     const currentAvatar = res.data.avatars.find((x) => x.id == avatarId);
//     expect(currentAvatar).toBeDefined();
//   });
// });
// decribe("space information", () => {
//   let mapId;
//   let element1Id;
//   let element2Id;
//   let userToken;
//   let userId;
//   let adminToken;
//   let adminId;

//   beforeAll(async () => {
//     const username = "Bob" + Math.random();
//     const password = "qwerty123";
//     const type = "admin";
//     const signupRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
//       username,
//       password,
//       type,
//     });

//     adminId = signupRes.data.userId;
//     const res = await axios.post(`${SERVER_URL}/api/v1/signin`, {
//       username,
//       password,
//     });
//     expect(res.status).toBe(200);
//     adminToken = res.body.token;
//     const userSignupRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
//       username: username + "_user",
//       password,
//       type: "user",
//     });

//     userId = userSignupRes.data.userId;
//     const userRes = await axios.post(`${SERVER_URL}/api/v1/signin`, {
//       username: username + "_user",
//       password,
//     });
//     expect(res.status).toBe(200);
//     userToken = userRes.body.token;
//     const element1Res = await axios.post(
//       `${SERVER_URL}/api/admin/element`,
//       {
//         imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     const element2Res = await axios.post(
//       `${SERVER_URL}/api/admin/element`,
//       {
//         imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     element1Id = element1Res.data.id;
//     element2Id = element2Res.data.id;
//     const mapRes = await axios.post(
//       `${SERVER_URL}/api/admin/map`,
//       {
//         thumbnail: "https://www.w3schools.com/howto/img_avatar.png",
//         dimension: "100x200",
//         defaultElements: [
//           {
//             elementId: element1Id,
//             x: 20,
//             y: 20,
//           },
//           {
//             elementId: element2Id,
//             x: 13,
//             y: 22,
//           },
//         ],
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     mapId = mapRes.data.id;
//   });
//   test("user is able create a space", async () => {
//     const res = await axios.post(
//       `${SERVER_URL}/api/v1/space`,
//       {
//         name: "test",
//         dimension: "100x200",
//         mapId: mapId,
//       },
//       {
//         Headers: {
//           authorization: `bearer ${userToken}`,
//         },
//       }
//     );
//     expect(res.data.spaceId).toBeDefined();
//   });
//   test("user is not able create a empty space without dimension", async () => {
//     const res = await axios.post(
//       `${SERVER_URL}/api/v1/space`,
//       {
//         name: "test",
//         dimension: "100x200",
//       },
//       {
//         Headers: {
//           authorization: `bearer ${userToken}`,
//         },
//       }
//     );
//     expect(res.status).toBe(400);
//   });

//   test("user is not able delete a  space that doesnt exist", async () => {
//     const res = await axios.delete(`${SERVER_URL}/api/v1/space/randomspaceID`, {
//       Headers: {
//         authorization: `bearer ${userToken}`,
//       },
//     });
//     expect(res.status).toBe(400);
//   });
//   test("user is  able delete a  space that  exist", async () => {
//     const res = await axios.post(
//       `${SERVER_URL}/api/v1/space`,
//       {
//         name: "test",
//         dimension: "100x200",
//         mapId: mapId,
//       },
//       {
//         Headers: {
//           authorization: `bearer ${adminToken}`,
//         },
//       }
//     );
//     const deleteRes = await axios.delete(
//       `${SERVER_URL}/api/v1/space/${res.data.spaceId}`,
//       {
//         Headers: {
//           authorization: `bearer ${userToken}`,
//         },
//       }
//     );
//     expect(deleteResp.status).toBe(200);
//   });
//   test("user is not  able delete a  space that  is created by other user", async () => {
//     const res = await axios.post(
//       `${SERVER_URL}/api/v1/space`,
//       {
//         name: "test",
//         dimension: "100x200",
//         mapId: mapId,
//       },
//       {
//         Headers: {
//           authorization: `bearer ${adminToken}`,
//         },
//       }
//     );
//     const deleteRes = await axios.delete(
//       `${SERVER_URL}/api/v1/space/${res.data.spaceId}`,
//       {
//         Headers: {
//           authorization: `bearer ${adminToken}`,
//         },
//       }
//     );
//     expect(deleteResp.status).toBe(400);
//   });
//   test("admin has no space initially", async () => {
//     const res = await axios.get(`${SERVER_URL}/api/v1/space/all`);

//     expect(res.data.spaces.length).toBe(0);
//   });
//   test("admin has no space initially", async () => {
//     const res = await axios.get(`${SERVER_URL}/api/v1/space/all`, {
//       Headers: {
//         authorization: `bearer ${userToken}`,
//       },
//     });

//     expect(res.data.spaces.length).toBe(0);
//   });
//   test("admin has no space initially", async () => {
//     const spaceCreatedRes = await axios.post(
//       `${SERVER_URL}/api/v1/space`,
//       {
//         name: "test",
//         dimension: "100x200",
//       },
//       {
//         Headers: {
//           authorization: `bearer ${userToken}`,
//         },
//       }
//     );
//     const res = await axios.get(`${SERVER_URL}/api/v1/space/all`, {
//       Headers: {
//         authorization: `bearer ${userToken}`,
//       },
//     });
//     const filteredSpace = response.data.spaces.find(
//       (x) => x.id == spaceCreatedRes.id
//     );
//     expect(filteredSpace).toBeDefined();
//     expect(res.data.spaces.length).toBe(1);
//   });
// });

// decribe("Arena", () => {
//   let mapId;
//   let element1Id;
//   let element2Id;
//   let userToken;
//   let userId;
//   let adminToken;
//   let adminId;
//   let spaceId;
//   beforeAll(async () => {
//     const username = "Bob" + Math.random();
//     const password = "qwerty123";
//     const type = "admin";
//     const signupRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
//       username,
//       password,
//       type,
//     });

//     adminId = signupRes.data.userId;
//     const res = await axios.post(`${SERVER_URL}/api/v1/signin`, {
//       username,
//       password,
//     });
//     expect(res.status).toBe(200);
//     adminToken = res.body.token;
//     const userSignupRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
//       username: username + "_user",
//       password,
//       type: "user",
//     });

//     userId = userSignupRes.data.userId;
//     const userRes = await axios.post(`${SERVER_URL}/api/v1/signin`, {
//       username: username + "_user",
//       password,
//     });
//     expect(res.status).toBe(200);
//     userToken = userRes.body.token;
//     const element1Res = await axios.post(
//       `${SERVER_URL}/api/admin/element`,
//       {
//         imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     const element2Res = await axios.post(
//       `${SERVER_URL}/api/admin/element`,
//       {
//         imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     element1Id = element1Res.data.id;
//     element2Id = element2Res.data.id;
//     const mapRes = await axios.post(
//       `${SERVER_URL}/api/admin/map`,
//       {
//         thumbnail: "https://www.w3schools.com/howto/img_avatar.png",
//         dimension: "100x200",
//         defaultElements: [
//           {
//             elementId: element1Id,
//             x: 20,
//             y: 20,
//           },
//           {
//             elementId: element2Id,
//             x: 13,
//             y: 22,
//           },
//         ],
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     mapId = mapRes.data.id;
//     const spaceRes = await axios.post(
//       `${SERVER_URL}/api/v1/space`,
//       {
//         name: "test",
//         dimension: "100x200",
//         mapId: mapId,
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     spaceId = spaceRes.data.spaceId;
//   });

//   test("incorrect space id returns 400", async () => {
//     const res = await axios.get(`${SERVER_URL}/api/v1/space/qwerty123`, {
//       Headers: {
//         authorization: `Bearer ${userToken}`,
//       },
//     });
//     expect(res.status).toBe(400);
//   });
//   test("correct space id returns all elements", async () => {
//     const res = await axios.get(`${SERVER_URL}/api/v1/space/${spaceId}`, {
//       Headers: {
//         authorization: `Bearer ${userToken}`,
//       },
//     });
//     expect(res.data.dimensions).toBe("100x200");
//     expect(res.data.elements.length).toBe(2);
//   });
//   test("delete elements", async () => {
//     const res = await axios.get(`${SERVER_URL}/api/v1/space/${spaceId}`, {
//       Headers: {
//         authorization: `Bearer ${userToken}`,
//       },
//     });
//     const deleteRes = await axios.delete(
//       `${SERVER_URL}/api/v1/space/${spaceId}`,
//       {
//         spaceId,
//         elementId: res.data.elements[0].id,
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     const newRes = await axios.get(`${SERVER_URL}/api/v1/space/${spaceId}`, {
//       Headers: {
//         authorization: `Bearer ${userToken}`,
//       },
//     });
//     expect(res.data.elements.length).toBe(1);
//   });

//   test("add elements inside space ", async () => {
//     const res = await axios.post(
//       `${SERVER_URL}/api/v1/space/element`,
//       {
//         spaceId,
//         elementId: element1Id,
//         x: 1,
//         y: 1,
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     const newRes = await axios.get(`${SERVER_URL}/api/v1/space/${spaceId}`, {
//       Headers: {
//         authorization: `Bearer ${userToken}`,
//       },
//     });
//     expect(res.data.elements.length).toBe(2);
//   });
//   test("add elements inside space outside dimension gives error", async () => {
//     const res = await axios.post(
//       `${SERVER_URL}/api/v1/space/element`,
//       {
//         spaceId,
//         elementId: element1Id,
//         x: 10000,
//         y: 100000,
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     expect(res.status).toBe(400);
//   });
// });

// describe("element creation", () => {
//   let userToken;
//   let userId;
//   let adminToken;
//   let adminId;

//   beforeAll(async () => {
//     const username = "Bob" + Math.random();
//     const password = "qwerty123";
//     const type = "admin";
//     const signupRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
//       username,
//       password,
//       type,
//     });

//     adminId = signupRes.data.userId;
//     const res = await axios.post(`${SERVER_URL}/api/v1/signin`, {
//       username,
//       password,
//     });
//     expect(res.status).toBe(200);
//     adminToken = res.body.token;
//     const userSignupRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
//       username: username + "_user",
//       password,
//       type: "user",
//     });

//     userId = userSignupRes.data.userId;
//     const userRes = await axios.post(`${SERVER_URL}/api/v1/signin`, {
//       username: username + "_user",
//       password,
//     });
//     expect(res.status).toBe(200);
//     userToken = userRes.body.token;
//   });

//   test("user cant make to admin endpoints", async () => {
//     const elementRes = await axios.post(
//       `${SERVER_URL}/api/admin/element`,
//       {
//         imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     const mapRes = await axios.post(
//       `${SERVER_URL}/api/admin/map`,
//       {
//         thumbnail: "https://www.w3schools.com/howto/img_avatar.png",
//         dimension: "100x200",
//         defaultElements: [],
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     const avatarRes = await axios.post(
//       `${SERVER_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
//         name: "Admin",
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     const updateElementRes = await axios.put(
//       `${SERVER_URL}/api/admin/element/${elementRes.data.id}`,
//       {
//         imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
//         width: 2,
//         height: 1,
//         static: true,
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     expect(elementRes.status).toBe(404);
//     expect(mapRes.status).toBe(404);
//     expect(avatarRes.status).toBe(404);
//     expect(updateElementRes.status).toBe(404);
//   });

//   test("admin can make to admin endpoints", async () => {
//     const elementRes = await axios.post(
//       `${SERVER_URL}/api/admin/element`,
//       {
//         imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     const mapRes = await axios.post(
//       `${SERVER_URL}/api/admin/map`,
//       {
//         thumbnail: "https://www.w3schools.com/howto/img_avatar.png",
//         dimension: "100x200",
//         defaultElements: [],
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     const avatarRes = await axios.post(
//       `${SERVER_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
//         name: "Admin",
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );

//     expect(elementRes.status).toBe(200);
//     expect(mapRes.status).toBe(200);
//     expect(avatarRes.status).toBe(200);
//   });
//   test("admin is able to edit an element", async () => {
//     const elementRes = await axios.post(
//       `${SERVER_URL}/api/admin/element`,
//       {
//         imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     const updateElementRes = await axios.put(
//       `${SERVER_URL}/api/admin/element/${elementRes.data.id}`,
//       {
//         imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
//         width: 2,
//         height: 1,
//         static: true,
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     expect(updateElementRes.status).toBe(200);
//   });
// });

// describe("Websocket", () => {
//   let userToken;
//   let userId;
//   let adminToken;
//   let adminId;
//   let mapId;
//   let element1Id;
//   let element2Id;
//   let spaceId;
//   let ws1Messages = [];
//   let ws2Messages = [];
//   let adminX;
//   let adminY;
//   let userX;
//   let userY;
//   async function setupHTTP() {
//     const username = "Bob" + Math.random();
//     const password = "qwerty123";
//     const type = "admin";
//     const adminSignupRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
//       username,
//       password,
//       type,
//     });
//     const adminSigninRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
//       username,
//       password,
//     });
//     adminId = adminSignupRes.data.userId;
//     adminToken = adminSigninRes.data.token;
//     const UsersignupRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
//       username: username + "_user",
//       password,
//       type: "user",
//     });
//     const UsersigninRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
//       username: username + "_user",
//       password,
//     });
//     userToken = UsersignupRes.data.token;
//     userId = UsersigninRes.data.userId;
//     const element1Res = await axios.post(
//       `${SERVER_URL}/api/admin/element`,
//       {
//         imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     const element2Res = await axios.post(
//       `${SERVER_URL}/api/admin/element`,
//       {
//         imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     element1Id = element1Res.data.id;
//     element2Id = element2Res.data.id;
//     const mapRes = await axios.post(
//       `${SERVER_URL}/api/admin/map`,
//       {
//         thumbnail: "https://www.w3schools.com/howto/img_avatar.png",
//         dimension: "100x200",
//         defaultElements: [
//           {
//             elementId: element1Id,
//             x: 20,
//             y: 20,
//           },
//           {
//             elementId: element2Id,
//             x: 13,
//             y: 22,
//           },
//         ],
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     mapId = mapRes.data.id;
//     const spaceRes = await axios.post(
//       `${SERVER_URL}/api/v1/space`,
//       {
//         name: "test",
//         dimension: "100x200",
//         mapId: mapId,
//       },
//       {
//         Headers: {
//           authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     spaceId = spaceRes.data.spaceId;
//   }
//   async function setupWS() {
//     ws1 = new WebSocket(WS_URL);

//     await new Promise((resolve, reject) => {
//       //opopen is a event handler
//       // when  the ws connects
//       // it calls the function that is assigned to it
//       //this stops the wait and moves to next code
//       ws1.onopen = resolve;
//     });
//     ws1.onmessage = (event) => {
//       ws1Messages.push(JSON.parse(event.data));
//     };

//     ws2 = new WebSocket(WS_URL);

//     await new Promise((resolve, reject) => {
//       ws2.onopen = resolve;
//     });

//     ws2.onmessage = (event) => {
//       ws2Messages.push(JSON.parse(event.data));
//     };
//   }
//   async function waitForAndPopLatest(messageArray) {
//     return new Promise((resolve) => {
//       if (messageArray.length > 0) {
//         resolve(messageArray.shift());
//       } else {
//         let interval = setInterval(() => {
//           if (messageArray.length > 0) {
//             resolve(messageArray.shift());
//           }
//           clearInterval(interval);
//         }, 100);
//       }
//     });
//   }
//   beforeAll(async () => {
//     setupHTTP();
//     setupWS();
//   });
//   test("join space and get ack ", async () => {
//     ws1.send(
//       JSON.stringify({
//         type: "join",
//         payload: {
//           spaceId: spaceId,
//           token: adminToken,
//         },
//       })
//     );
//     const message1 = await waitForAndPopLatest(ws1Messages);

//     ws2.send(
//       JSON.stringify({
//         type: "join",
//         payload: {
//           spaceId: spaceId,
//           token: userToken,
//         },
//       })
//     );

//     const message2 = await waitForAndPopLatest(ws2Messages);
//     const message3 = await waitForAndPopLatest(ws2Messages);

//     expect(message1.type).toBe("space-joined");
//     expect(message2.type).toBe("space-joined");
//     expect(message1.payload.users.length).toBe(0);
//     expect(message2.payload.users.length).toBe(1);
//     expect(message3.type).toBe("user-join");
//     expect(message3.payload.x).toBe(message2.payload.spawn.x);
//     expect(message3.payload.y).toBe(message2.payload.spawn.y);
//     expect(message3.payload.userId).toBe(userId);

//     adminX = message1.payload.spawn.x;
//     adminY = message1.payload.spawn.y;
//     userX = message2.payload.spawn.x;
//     userY = message2.payload.spawn.y;
//   });
//   test("user cant move outside the boundary", async () => {
//     ws1.send(
//       JSON.stringify({
//         type: "movement",
//         payload: {
//           x: 10000000,
//           y: 20000000,
//           userId: adminId,
//         },
//       })
//     );
//     const message = await waitForAndPopLatest(ws1Messages);
//     expect(message.type).toBe("movement-rejected");
//     expect(message.payload.x).toBe(adminX);
//     expect(message.payload.y).toBe(adminY);
//   });
//   test("user cant move 2 blocks", async () => {
//     ws1.send(
//       JSON.stringify({
//         type: "movement",
//         payload: {
//           x: adminX + 2,
//           y: adminY,
//           userId: adminId,
//         },
//       })
//     );
//     const message = await waitForAndPopLatest(ws1Messages);
//     expect(message.type).toBe("movement-rejected");
//     expect(message.payload.x).toBe(adminX);
//     expect(message.payload.y).toBe(adminY);
//   });
//   test("correct movement should be broadcasted to the other socket in the room", async () => {
//     ws1.send(
//       JSON.stringify({
//         type: "movement",
//         payload: {
//           x: adminX + 1,
//           y: adminY,
//           userId: adminId,
//         },
//       })
//     );
//     const message = await waitForAndPopLatest(ws2Messages);
//     expect(message.type).toBe("movement");
//     expect(message.payload.x).toBe(adminX + 1);
//     expect(message.payload.y).toBe(adminY);
//   });
//   test("if user leaves ithers should be informed", async () => {
//     ws1.close();
//     const message = await waitForAndPopLatest(ws2Messages);
//     expect(message.type).toBe("user-left");
//     expect(message.payload.userId).toBe(adminId);
//   });
// });
