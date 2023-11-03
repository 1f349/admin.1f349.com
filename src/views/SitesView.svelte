<script>
  import {getBearer} from "../stores/login";
</script>

<div class="sites-panel">
  <iframe src="https://sites.1f349.com/panel?token={getBearer()}" title="" />
</div>

<style lang="scss">
  .sites-panel {
    width: 100%;
    height: 100%;
    overflow: hidden;

    iframe {
      border: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
