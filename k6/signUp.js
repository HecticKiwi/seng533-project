import { check, sleep } from "k6";
import http from "k6/http";

export let options = {
  stages: [
    { duration: "1s", target: 3 },
    // { duration: "20s", target: 10 },
    // { duration: "60s", target: 1000 },
    // { duration: "60s", target: 20000 },
  ],
};

const BASE_URL = "http://host.docker.internal:9099";

export default function () {
  const username = `User${Math.random()}`;

  const payload = JSON.stringify({
    email: `${username}@example.com`,
    username,
    password: `password`,
    returnSecureToken: true,
  });

  const params = {
    headers: { "Content-Type": "application/json" },
  };

  let res = http.post(
    `${BASE_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=123`,
    payload,
    params
  );

  check(res, {
    "is status 200": (r) => r.status === 200,
    "response time < 300ms": (r) => r.timings.duration < 300,
  });

  sleep(1);
}
