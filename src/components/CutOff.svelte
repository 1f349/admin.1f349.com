<div class="cutoff-wrapper">
  <span class="cutoff"><slot /></span>
</div>

<style lang="scss">
  .cutoff-wrapper {
    position: relative;
    width: 100%;
  }

  .cutoff {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    overflow: hidden;
    text-wrap: nowrap;
    text-overflow: ellipsis;
    margin-inline: 15px;
    display: inline-block;
    vertical-align: middle;
    line-height: 1rem;
    transform: translateY(-50%);
  }
</style>
