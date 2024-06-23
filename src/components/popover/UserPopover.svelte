<script>
  import {LOGIN} from "../../utils/login";
</script>

<div class="user-popover">
  <a href="https://sso.1f349.com" target="_blank">1f349 Profile</a>
  <button on:click={() => LOGIN.logout()}>Log Out</button>
</div>

<style lang="scss">
  @import "../../values.scss";

  .user-popover {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;

    button,
    a {
      @include button-reset;

      text-align: left;
      font-size: 0.9rem;
      color: #10b981;
      text-decoration: underline;
      padding: 5px;
    }
  }
</style>
