<script lang="ts">
  import type { ImgProps } from './types.js';

  let {
    width,
    height,
    class: className,
    style,
  }: { width: number; height: number } & ImgProps = $props();
</script>

<span
  aria-hidden="true"
  class={className}
  style="display:inline-block;width:{width}px;height:{height}px;{style ?? ''}"
></span>
