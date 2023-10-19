import {writable} from "svelte/store";

export interface LoginStore {
  userinfo: {
    email: string;
    name: string;
    sub: string;
    picture: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

export const loginStore = writable<LoginStore | null>(
  (() => {
    try {
      return JSON.parse(localStorage.getItem("login-session") || "");
    } catch (_) {
      return null;
    }
  })(),
);

loginStore.subscribe(x => {
  localStorage.setItem("login-session", JSON.stringify(x));
});
