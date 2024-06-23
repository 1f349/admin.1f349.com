import {loginStore} from "../stores/login";

export const LOGIN = (function () {
  const OAUTH2_AUTHORIZE_API = import.meta.env.VITE_SSO_ORIGIN + "/authorize";
  const OAUTH2_USERINFO_API = import.meta.env.VITE_SSO_ORIGIN + "/userinfo";
  const OAUTH2_CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
  const OAUTH2_CLIENT_SCOPE = import.meta.env.VITE_OAUTH2_CLIENT_SCOPE;
  const OAUTH2_LOGOUT_PAGE = import.meta.env.VITE_LOGOUT_PAGE;

  let access_token: string | null = localStorage.getItem("oauth2_access_token"),
    redirect_uri = window.location.href.slice(0, window.location.href.length - window.location.hash.length).replace(/#$/, "");

  if (window.location.hash.indexOf("access_token") !== -1) {
    access_token = window.location.hash.replace(/^.*access_token=([^&]+).*$/, "$1");
    localStorage.setItem("oauth2_access_token", access_token);
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }

  let hasError: boolean = false;
  if (window.location.search.indexOf("error=") !== -1) {
    localStorage.removeItem("oauth2_access_token");
    hasError = true;
  }

  const redirectToLogin = function () {
    window.location.href =
      OAUTH2_AUTHORIZE_API +
      "?response_type=token" +
      "&redirect_uri=" +
      encodeURIComponent(redirect_uri) +
      "&scope=" +
      encodeURIComponent(OAUTH2_CLIENT_SCOPE) +
      "&client_id=" +
      encodeURIComponent(OAUTH2_CLIENT_ID);
  };

  const clientRequest = function (resource: RequestInfo, options: RequestInit): Promise<Response> {
    const sendRequest = function (): Promise<Response> {
      options.credentials = "include";
      if (!options.headers) options.headers = {};
      options.headers["Authorization"] = "Bearer " + access_token;
      return new Promise(function (res, rej) {
        fetch(resource, options)
          .then(function (x) {
            if (x.status >= 200 && x.status < 300) res(x);
            else throw new Error("invalid status code " + x.status);
          })
          .catch(function (x: Error) {
            if (x.message === "invalid status code 403") redirectToLogin();
            rej(x);
          });
      });
    };

    if (access_token == null) {
      redirectToLogin();
      return Promise.reject("missing access token");
    }

    return sendRequest();
  };

  const LOGIN = {
    hadError: function () {
      return hasError;
    },

    logout: function () {
      access_token = null;
      loginStore.set(null);
      localStorage.removeItem("login-session");
      localStorage.removeItem("oauth2_access_token");
      window.location.href = OAUTH2_LOGOUT_PAGE;
    },

    clientRequest,

    userinfo: function () {
      clientRequest(OAUTH2_USERINFO_API, {})
        .then(x => x.json())
        .then(x => {
          if (access_token == null) throw new Error("missing access token");
          loginStore.set({
            userinfo: x,
            tokens: {access: access_token, refresh: ""},
          });
        })
        .catch(x => {
          console.error(x);
        });
    },
  };

  return LOGIN;
})();
