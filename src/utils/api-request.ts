import {get} from "svelte/store";
import {getBearer, loginStore} from "../stores/login";

const TOKEN_VERIFY_API = import.meta.env.VITE_SSO_ORIGIN + "/verify";
const TOKEN_REFRESH_API = import.meta.env.VITE_SSO_ORIGIN + "/refresh";

export async function apiRequest(url: string, init?: RequestInit): Promise<Response> {
  // setup authorization header
  if (init == undefined) init = {};
  init.headers = {...init.headers, Authorization: getBearer()};

  let f = await fetch(url, init);
  if (f.status !== 403) return f;

  let refreshResp = await fetch(TOKEN_REFRESH_API, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({token: get(loginStore)?.tokens.refresh}),
  });
  if (refreshResp.status !== 200) {
    loginStore.set(null);
    alert("Failed to refresh login session: please login again to continue");
    throw new Error("403 Unauthorized");
  }
  let refreshJson = await refreshResp.json();
  loginStore.set(refreshJson);

  // update current authorization header
  init.headers = {...init.headers, Authorization: getBearer()};
  return await fetch(url, init);
}

export async function apiVerify() {
  return await apiRequest(TOKEN_VERIFY_API, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
  });
}
