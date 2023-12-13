<script lang="ts">
  import {loginStore, parseJwt} from "../stores/login";

  let tokenExp = 0;
  let diffExp = 0;

  loginStore.subscribe(x => {
    if (!x) return;
    let jwt = parseJwt(x?.tokens.access);
    tokenExp = jwt.exp;
  });

  function timeDiff(exp: number) {
    if (exp === 0) return 0;
    return exp * 1000 - new Date().getTime();
  }

  setInterval(() => {
    diffExp = timeDiff(tokenExp);
  }, 500);
</script>

<div style="padding:8px;background-color:#bb7900;">Warning: This is currently still under development</div>

<div>
  <a class="btn-green" href="https://uptime-kuma.1f349.com" target="_blank">Status Dashboard</a>
</div>

<div>{diffExp === 0 ? "No token" : diffExp}</div>
