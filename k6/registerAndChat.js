import { check, sleep } from "k6";
import http from "k6/http";

export let options = {
  // stages: [
  //   { duration: "20s", target: 50 },
  //   // { duration: "20s", target: 100 },
  //   // { duration: "60s", target: 1000 },
  //   // { duration: "60s", target: 20000 },
  // ],
  //Ramp Testing Parameters
  // stages: [
  //   { duration: "30s", target: 100 },
  //   { duration: "1m", target: 500 },
  //   { duration: "2m", target: 1000 },
  // ],

  //Spike Testing Parameters
  // stages: [
  //   { duration: "10s", target: 1000 },
  //   { duration: "30s", target: 1000 },
  //   { duration: "10s", target: 50 },
  // ],
  //Soak Testing Parameters
  stages: [
    { duration: "5m", target: 500 },
    { duration: "30m", target: 500 },
    { duration: "5m", target: 50 },
  ],
};

const AUTH_URL =
  "http://host.docker.internal:9099/identitytoolkit.googleapis.com/v1";
const FIRESTORE_URL = "http://host.docker.internal:8080/v1";

export default function () {
  const username = `User${Math.random()}`;

  // Sign up
  // https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
  const signUpRes = http.post(
    `${AUTH_URL}/accounts:signUp?key=123`,
    JSON.stringify({
      email: `${username}@example.com`,
      username,
      password: `password`,
      returnSecureToken: true,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(signUpRes, {
    "Sign up: status is 200": (r) => r.status === 200,
  });

  if (signUpRes.status !== 200) return;

  const signUpData = signUpRes.json();
  const idToken = signUpData.idToken;

  // Set displayName
  const updateProfileRes = http.post(
    `${AUTH_URL}/accounts:update?key=123`,
    JSON.stringify({
      idToken,
      displayName: username,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(updateProfileRes, {
    "Update profile: status is 200": (r) => r.status === 200,
  });

  if (updateProfileRes.status !== 200) return;

  // Create user data
  // https://firebase.google.com/docs/reference/rest/auth#section-update-profile
  const createUserDataRes = http.post(
    `${FIRESTORE_URL}/projects/seng401-temp/databases/(default)/documents/users`,
    JSON.stringify({
      fields: {
        username: { stringValue: username },
        level: { integerValue: 1 },
        rankPoints: { integerValue: 1000 },
        musicVolume: { doubleValue: 1.0 },
        gold: { integerValue: 1234 },
        skinShard: { integerValue: 3600 },
        characterShard: { integerValue: 1800 },
        chestLastOpenedOn: { timestampValue: "1970-01-01T00:00:00.000Z" },
        bannerFilepath: { stringValue: "/Account/Banners/Sky.jpg" },
        message: { stringValue: "Hello I am a good slime!" },
        slimeType: { stringValue: "Normal" },
        slimeSkin: { integerValue: 1 },
        status: { stringValue: "ONLINE" },
        slimes: {
          arrayValue: {
            values: [{ stringValue: "Normal1" }],
          },
        },
        friends: { arrayValue: {} },
        friendRequests: { arrayValue: {} },
        bannerUnlocked: { integerValue: 34 },
        unreadMessages: { mapValue: {} },
      },
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(createUserDataRes, {
    "Create user data: status is 200": (r) => r.status === 200,
  });

  if (createUserDataRes.status !== 200) return;

  const userDocumentId = createUserDataRes.json().name;

  // Fetch top 5 users for dashboard
  // https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents/get
  const dashboardUsersRes = http.get(
    `${FIRESTORE_URL}/projects/seng401-temp/databases/(default)/documents/users?pageSize=5&orderBy=rankPoints`,
    {
      headers: { Authorization: `Bearer ${idToken}` },
    }
  );

  check(dashboardUsersRes, {
    "Fetch dashboard users: status is 200": (r) => r.status === 200,
  });

  // Open chest
  // https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents/patch
  const openChestRes = http.patch(
    `${FIRESTORE_URL}/${userDocumentId}?updateMask.fieldPaths=gold&updateMask.fieldPaths=chestLastOpenedOn`,
    JSON.stringify({
      fields: {
        gold: { integerValue: 1284 },
        chestLastOpenedOn: { timestampValue: "1970-01-01T00:00:00.000Z" },
      },
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(openChestRes, {
    "Open chest: status is 200": (r) => r.status === 200,
  });

  if (openChestRes.status !== 200) return;

  if (dashboardUsersRes.status !== 200) return;

  // Fetch global chat
  // https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents/get
  const globalChatRes = http.get(
    `${FIRESTORE_URL}/projects/seng401-temp/databases/(default)/documents/chats/global/messages?pageSize=50`,
    {
      headers: { Authorization: `Bearer ${idToken}` },
    }
  );

  check(globalChatRes, {
    "Fetch global chat messages: status is 200": (r) => r.status === 200,
  });

  if (globalChatRes.status !== 200) return;

  // Send a message to global chat
  // https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents/createDocument
  const sendGlobalMessageRes = http.post(
    `${FIRESTORE_URL}/projects/seng401-temp/databases/(default)/documents/chats/global/messages`,
    JSON.stringify({
      fields: {
        id: { stringValue: idToken },
        username: { stringValue: username },
        slimePath: { stringValue: "assets/GameArt/EarthSlime/EarthSlime1" },
        content: { stringValue: `Message from ${username}` },
        sentAt: { timestampValue: new Date().toISOString() },
      },
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(sendGlobalMessageRes, {
    "Send global chat message: status is 200": (r) => r.status === 200,
  });

  if (sendGlobalMessageRes.status !== 200) return;

  sleep(1);
}
