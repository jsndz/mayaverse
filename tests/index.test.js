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
const WS_URL = "ws://localhost:3002";

describe("Authentication", () => {
  test("Signup succeeds ", async () => {
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
    const username = `2bob${Math.random()}`;
    const password = "qwerty123";
    const response = await axios.post(`${SERVER_URL}/api/v1/signup`, {
      password,
    });
    expect(response.status).toBe(400);
  });
  test("Signin succeeds if the username and password are correct", async () => {
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

describe("User metadata ", () => {
  let token = "";
  let avatarId = "";
  beforeAll(async () => {
    const username = "Bob" + Math.random();
    const password = "qwerty123";
    const type = "admin";
    await axios.post(`${SERVER_URL}/api/v1/signup`, {
      username,
      password,
      type,
    });
    const res = await axios.post(`${SERVER_URL}/api/v1/signin`, {
      username,
      password,
    });
    token = res.data.token;
    const avatarRes = await axios.post(
      `${SERVER_URL}/api/v1/admin/avatar`,
      {
        imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
        name: "Admin",
      },
      { headers: { authorization: `Bearer ${token}` } }
    );
    avatarId = avatarRes.data.id;

    expect(avatarRes.status).toBe(200);
  });

  test("user cant update their metadata with wrong avatarId", async () => {
    const res = await axios.post(
      `${SERVER_URL}/api/v1/user/metadata`,
      {
        avatarId: "12122211",
      },
      { headers: { authorization: `Bearer ${token}` } }
    );
    expect(res.status).toBe(400);
  });
  test("user can update their metadata", async () => {
    const res = await axios.post(
      `${SERVER_URL}/api/v1/user/metadata`,
      { avatarId },
      { headers: { authorization: `Bearer ${token}` } }
    );
    expect(res.status).toBe(200);
  });
  test("user cant update their metadata coz auth is not present", async () => {
    const res = await axios.post(`${SERVER_URL}/api/v1/user/metadata`, {
      avatarId,
    });
    expect(res.status).toBe(403);
  });
});

describe("user avatar information", () => {
  let token = "";
  let avatarId = "";
  let userId = "";
  beforeAll(async () => {
    const username = "Bob" + Math.random();
    const password = "qwerty123";
    const type = "admin";
    const signUpRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
      username,
      password,
      type,
    });
    userId = signUpRes.data.userId;
    const res = await axios.post(`${SERVER_URL}/api/v1/signin`, {
      username,
      password,
    });
    token = res.data.token;
    const avatarRes = await axios.post(
      `${SERVER_URL}/api/v1/admin/avatar`,
      {
        imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
        name: "Admin",
      },
      { headers: { authorization: `Bearer ${token}` } }
    );
    avatarId = avatarRes.data.id;
    expect(avatarRes.status).toBe(200);
  });
  test("get user avatar info for a user ", async () => {
    const res = await axios.get(
      `${SERVER_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`
    );
    expect(res.data.avatars.length).toBe(1);
    expect(res.data.avatars[0].userId).toBe(userId);
  });
  test("Available avatars list should contain the recently made avatar ", async () => {
    const res = await axios.get(`${SERVER_URL}/api/v1/avatars`, {});
    expect(res.data.avatars.length).not.toBe(0);
    const currentAvatar = res.data.avatars.find((x) => x.id == avatarId);
    expect(currentAvatar).toBeDefined();
  });
});
describe("space information", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let userToken;
  let userId;
  let adminToken;
  let adminId;

  beforeAll(async () => {
    const username = "Bob" + Math.random();
    const password = "qwerty123";
    const type = "admin";
    const signupRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
      username,
      password,
      type,
    });
    expect(signupRes.status).toBe(200);

    adminId = signupRes.data.userId;
    const res = await axios.post(`${SERVER_URL}/api/v1/signin`, {
      username,
      password,
    });
    expect(res.status).toBe(200);
    adminToken = res.data.token;
    const userSignupRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
      username: username + "_user",
      password,
      type: "user",
    });

    userId = userSignupRes.data.userId;
    const userRes = await axios.post(`${SERVER_URL}/api/v1/signin`, {
      username: username + "_user",
      password,
    });
    expect(res.status).toBe(200);
    userToken = userRes.data.token;
    const element1Res = await axios.post(
      `${SERVER_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(element1Res.status).toBe(200);

    const element2Res = await axios.post(
      `${SERVER_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(element2Res.status).toBe(200);

    element1Id = element1Res.data.id;
    element2Id = element2Res.data.id;
    const mapRes = await axios.post(
      `${SERVER_URL}/api/v1/admin/map`,
      {
        name: "test",
        thumbnail: "https://www.w3schools.com/howto/img_avatar.png",
        dimension: "100x200",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 13,
            y: 22,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(mapRes.status).toBe(200);

    mapId = mapRes.data.id;
  });
  test("user is able create a space", async () => {
    const res = await axios.post(
      `${SERVER_URL}/api/v1/space`,
      {
        name: "test",
        dimension: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(res.data.spaceId).toBeDefined();
  });
  test("user is  able create a empty space without mapId", async () => {
    const res = await axios.post(
      `${SERVER_URL}/api/v1/space`,
      {
        name: "test",
        dimension: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(res.status).toBe(200);

    expect(res.data.spaceId).toBeDefined();
  });

  test("user is not able delete a  space that doesnt exist", async () => {
    const res = await axios.delete(`${SERVER_URL}/api/v1/space/randomspaceID`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    expect(res.status).toBe(400);
  });
  test("user is  able delete a  space that  exist", async () => {
    const res = await axios.post(
      `${SERVER_URL}/api/v1/space`,
      {
        name: "test",
        dimension: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(res.status).toBe(200);

    const deleteRes = await axios.delete(
      `${SERVER_URL}/api/v1/space/${res.data.spaceId}`,
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    expect(deleteRes.status).toBe(200);
  });
  test("user is not  able delete a  space that  is created by other user", async () => {
    const res = await axios.post(
      `${SERVER_URL}/api/v1/space`,
      {
        name: "test",
        dimension: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const deleteRes = await axios.delete(
      `${SERVER_URL}/api/v1/space/${res.data.spaceId}`,
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(deleteRes.status).toBe(403);
  });

  test("admin has no space initially", async () => {
    const getRes = await axios.get(`${SERVER_URL}/api/v1/space/all`, {
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });

    expect(getRes.status).toBe(200);

    expect(getRes.data.spaces.length).toBe(0);
  });
  test("admin can create  space", async () => {
    const spaceCreatedRes = await axios.post(
      `${SERVER_URL}/api/v1/space`,
      {
        name: "test",
        dimension: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    expect(spaceCreatedRes.status).toBe(200);

    const res = await axios.get(`${SERVER_URL}/api/v1/space/all`, {
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });
    expect(res.status).toBe(200);

    const filteredSpace = res.data.spaces.find(
      (x) => x.id == spaceCreatedRes.data.spaceId
    );
    expect(filteredSpace).toBeDefined();
    expect(res.data.spaces.length).toBe(1);
  });
});

describe("Arena", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let userToken;
  let userId;
  let adminToken;
  let adminId;
  let spaceId;
  beforeAll(async () => {
    const username = "Bob" + Math.random();
    const password = "qwerty123";
    const type = "admin";
    const signupRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
      username,
      password,
      type,
    });
    expect(signupRes.status).toBe(200);

    adminId = signupRes.data.userId;
    const res = await axios.post(`${SERVER_URL}/api/v1/signin`, {
      username,
      password,
    });
    expect(res.status).toBe(200);
    adminToken = res.data.token;
    const userSignupRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
      username: username + "_user",
      password,
      type: "user",
    });

    userId = userSignupRes.data.userId;
    const userRes = await axios.post(`${SERVER_URL}/api/v1/signin`, {
      username: username + "_user",
      password,
    });
    expect(res.status).toBe(200);
    userToken = userRes.data.token;
    const element1Res = await axios.post(
      `${SERVER_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(element1Res.status).toBe(200);

    const element2Res = await axios.post(
      `${SERVER_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(element2Res.status).toBe(200);

    element1Id = element1Res.data.id;
    element2Id = element2Res.data.id;
    const mapRes = await axios.post(
      `${SERVER_URL}/api/v1/admin/map`,
      {
        name: "test",
        thumbnail: "https://www.w3schools.com/howto/img_avatar.png",
        dimension: "100x200",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 13,
            y: 22,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(mapRes.status).toBe(200);

    mapId = mapRes.data.id;

    const spaceRes = await axios.post(
      `${SERVER_URL}/api/v1/space`,
      {
        name: "test",
        dimension: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    spaceId = spaceRes.data.spaceId;
  });

  test("incorrect space id returns 400", async () => {
    const res = await axios.get(`${SERVER_URL}/api/v1/space/qwerty123`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    expect(res.status).toBe(400);
  });
  test("correct space id returns all elements", async () => {
    const res = await axios.get(`${SERVER_URL}/api/v1/space/${spaceId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });

    expect(res.data.dimension).toBe("100x200");
    expect(res.data.elements.length).toBe(2);
  });
  test("delete elements", async () => {
    const res = await axios.get(`${SERVER_URL}/api/v1/space/${spaceId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    expect(res.status).toBe(200);

    const deleteRes = await axios.delete(`${SERVER_URL}/api/v1/space/element`, {
      data: {
        id: res.data.elements[0].id,
      },

      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });

    expect(deleteRes.status).toBe(200);

    const newRes = await axios.get(`${SERVER_URL}/api/v1/space/${spaceId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    expect(newRes.status).toBe(200);

    expect(newRes.data.elements.length).toBe(1);
  });

  test("Adding an element works as expected", async () => {
    const res = await axios.post(
      `${SERVER_URL}/api/v1/space/element`,
      {
        elementId: element1Id,
        spaceId: spaceId,
        x: 50,
        y: 20,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(res.status).toBe(201);
    const newResponse = await axios.get(
      `${SERVER_URL}/api/v1/space/${spaceId}`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(newResponse.data.elements.length).toBe(2);
  });
  test("add elements inside space outside dimension gives error", async () => {
    const res = await axios.post(
      `${SERVER_URL}/api/v1/space/element`,
      {
        spaceId,
        elementId: element1Id,
        x: 100000,
        y: 100000,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });
});

describe("element creation", () => {
  let userToken;
  let userId;
  let adminToken;
  let adminId;

  beforeAll(async () => {
    const username = "Bob" + Math.random();
    const password = "qwerty123";
    const type = "admin";
    const signupRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
      username,
      password,
      type,
    });

    adminId = signupRes.data.userId;
    const res = await axios.post(`${SERVER_URL}/api/v1/signin`, {
      username,
      password,
    });
    expect(res.status).toBe(200);
    adminToken = res.data.token;
    const userSignupRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
      username: username + "_user",
      password,
      type: "user",
    });

    userId = userSignupRes.data.userId;
    const userRes = await axios.post(`${SERVER_URL}/api/v1/signin`, {
      username: username + "_user",
      password,
    });
    expect(res.status).toBe(200);
    userToken = userRes.data.token;
  });

  test("user cant make to admin endpoints", async () => {
    const elementRes = await axios.post(
      `${SERVER_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const mapRes = await axios.post(
      `${SERVER_URL}/api/v1/admin/map`,
      {
        name: "test",
        thumbnail: "https://www.w3schools.com/howto/img_avatar.png",
        dimension: "100x200",
        defaultElements: [],
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const avatarRes = await axios.post(
      `${SERVER_URL}/api/v1/admin/avatar`,
      {
        imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
        name: "Admin",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const updateElementRes = await axios.put(
      `${SERVER_URL}/api/v1/admin/element/${elementRes.data.id}`,
      {
        imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
        width: 2,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(elementRes.status).toBe(403);
    expect(mapRes.status).toBe(403);
    expect(avatarRes.status).toBe(403);
    expect(updateElementRes.status).toBe(403);
  });

  test("admin can make to admin endpoints", async () => {
    const elementRes = await axios.post(
      `${SERVER_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    const mapRes = await axios.post(
      `${SERVER_URL}/api/v1/admin/map`,
      {
        name: "test",
        thumbnail: "https://www.w3schools.com/howto/img_avatar.png",
        dimension: "100x200",
        defaultElements: [],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    const avatarRes = await axios.post(
      `${SERVER_URL}/api/v1/admin/avatar`,
      {
        imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
        name: "Admin",
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    expect(elementRes.status).toBe(200);
    expect(mapRes.status).toBe(200);
    expect(avatarRes.status).toBe(200);
  });
  test("admin is able to edit an element", async () => {
    const elementRes = await axios.post(
      `${SERVER_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    const updateElementRes = await axios.put(
      `${SERVER_URL}/api/v1/admin/element/${elementRes.data.id}`,
      {
        imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
        width: 2,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(updateElementRes.status).toBe(200);
  });
});

describe("Websocket", () => {
  let userToken;
  let userId;
  let adminToken;
  let adminId;
  let mapId;
  let element1Id;
  let element2Id;
  let spaceId;
  let ws1Messages = [];
  let ws2Messages = [];
  let adminX;
  let adminY;
  let userX;
  let userY;
  function waitForAndPopLatest(messageArray) {
    return new Promise((resolve) => {
      if (messageArray.length > 0) {
        resolve(messageArray.shift());
      } else {
        let interval = setInterval(() => {
          if (messageArray.length > 0) {
            resolve(messageArray.shift());
            clearInterval(interval);
          }
        }, 100);
      }
    });
  }
  async function setupHTTP() {
    const username = "Bob" + Math.random();
    const password = "qwerty123";
    const type = "admin";
    const adminSignupRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
      username,
      password,
      type,
    });
    expect(adminSignupRes.status).toBe(200);

    const adminSigninRes = await axios.post(`${SERVER_URL}/api/v1/signin`, {
      username,
      password,
    });
    expect(adminSigninRes.status).toBe(200);

    adminId = adminSignupRes.data.userId;
    adminToken = adminSigninRes.data.token;
    const UsersignupRes = await axios.post(`${SERVER_URL}/api/v1/signup`, {
      username: username + "_user",
      password,
      type: "user",
    });
    expect(UsersignupRes.status).toBe(200);

    const UsersigninRes = await axios.post(`${SERVER_URL}/api/v1/signin`, {
      username: username + "_user",
      password,
    });
    expect(UsersigninRes.status).toBe(200);

    userToken = UsersigninRes.data.token;
    userId = UsersignupRes.data.userId;
    const element1Res = await axios.post(
      `${SERVER_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(element1Res.status).toBe(200);

    const element2Res = await axios.post(
      `${SERVER_URL}/api/v1/admin/element`,
      {
        imageUrl: "https://www.w3schools.com/howto/img_avatar.png",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(element2Res.status).toBe(200);

    element1Id = element1Res.data.id;
    element2Id = element2Res.data.id;
    const mapRes = await axios.post(
      `${SERVER_URL}/api/v1/admin/map`,
      {
        name: "test",
        thumbnail: "https://www.w3schools.com/howto/img_avatar.png",
        dimension: "100x200",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 13,
            y: 22,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(mapRes.status).toBe(200);

    mapId = mapRes.data.id;
    const spaceRes = await axios.post(
      `${SERVER_URL}/api/v1/space`,
      {
        name: "test",
        dimension: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(spaceRes.status).toBe(200);

    spaceId = spaceRes.data.spaceId;
  }
  async function setupWS() {
    ws1 = new WebSocket(WS_URL);
    ws1.onmessage = (event) => {
      ws1Messages.push(JSON.parse(event.data));
    };
    await new Promise((resolve, reject) => {
      //opopen is a event handler
      // when  the ws connects
      // it calls the function that is assigned to it
      //this stops the wait and moves to next code
      ws1.onopen = resolve;
    });

    ws2 = new WebSocket(WS_URL);
    ws2.onmessage = (event) => {
      ws2Messages.push(JSON.parse(event.data));
    };
    await new Promise((resolve, reject) => {
      ws2.onopen = resolve;
    });
  }

  beforeAll(async () => {
    await setupHTTP();
    await setupWS();
  });
  test("join space and get ack ", async () => {
    ws1.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: adminToken,
        },
      })
    );

    const message1 = await waitForAndPopLatest(ws1Messages);

    ws2.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: userToken,
        },
      })
    );
    const message2 = await waitForAndPopLatest(ws2Messages);

    const message3 = await waitForAndPopLatest(ws1Messages);
    expect(message1.type).toBe("space-joined");
    expect(message2.type).toBe("space-joined");
    expect(message1.payload.users.length).toBe(0);
    expect(message2.payload.users.length).toBe(1);
    expect(message3.type).toBe("user-joined");
    expect(message3.payload.x).toBe(message2.payload.spawn.x);
    expect(message3.payload.y).toBe(message2.payload.spawn.y);
    expect(message3.payload.userId).toBe(userId);

    adminX = message1.payload.spawn.x;
    adminY = message1.payload.spawn.y;
    userX = message2.payload.spawn.x;
    userY = message2.payload.spawn.y;
  });
  test("user cant move outside the boundary", async () => {
    ws1.send(
      JSON.stringify({
        type: "movement",
        payload: {
          x: 10000000,
          y: 20000000,
          userId: adminId,
        },
      })
    );
    const message = await waitForAndPopLatest(ws1Messages);
    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });
  test("user cant move 2 blocks", async () => {
    ws1.send(
      JSON.stringify({
        type: "movement",
        payload: {
          x: adminX + 2,
          y: adminY,
          userId: adminId,
        },
      })
    );
    const message = await waitForAndPopLatest(ws1Messages);
    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });
  test("correct movement should be broadcasted to the other socket in the room", async () => {
    ws1.send(
      JSON.stringify({
        type: "movement",
        payload: {
          x: adminX + 1,
          y: adminY,
          userId: adminId,
        },
      })
    );
    const message = await waitForAndPopLatest(ws2Messages);
    expect(message.type).toBe("movement");
    expect(message.payload.x).toBe(adminX + 1);
    expect(message.payload.y).toBe(adminY);
  });
  test("if user leaves ithers should be informed", async () => {
    ws1.close();
    const message = await waitForAndPopLatest(ws2Messages);
    expect(message.type).toBe("user-left");
    expect(message.payload.userId).toBe(adminId);
  });
});
