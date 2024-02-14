import {get} from "svelte/store";
import {getBearer, loginStore} from "../stores/login";
import {POP2} from "./pop2";

const TOKEN_AUTHORIZE_API = import.meta.env.VITE_SSO_ORIGIN + "/authorize";
const TOKEN_USERINFO_API = import.meta.env.VITE_SSO_ORIGIN + "/userinfo";
const OAUTH2_CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;

export const LOGIN = {
  init: () => {
    POP2.init(TOKEN_AUTHORIZE_API, OAUTH2_CLIENT_ID, "openid profile name", 500, 600);
  },
  clientRequest: (resource: string, options: RequestInit, refresh: boolean) => {
    return POP2.clientRequest(resource, options, refresh);
  },
  userinfo: (popup: boolean) => {
    console.info("userinfo", popup);
    POP2.getToken((token: string) => {
      POP2.clientRequest(TOKEN_USERINFO_API, {}, popup)
        .then(x => x.json())
        .then(x => {
          console.log(token, x);
          loginStore.set({
            userinfo: x,
            tokens: {access: token, refresh: ""},
          });
        })
        .catch(x => {
          console.error(x);
        });
    }, popup);
  },
};
