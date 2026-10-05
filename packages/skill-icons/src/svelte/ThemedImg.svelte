<script lang="ts">
import type { HTMLImgAttributes } from 'svelte/elements';
import { LIGHT_MEDIA } from '../core/index.js';

// An <img>, wrapped in a <picture> that swaps to the light source when there is one.
let { sources, ...img }: { sources: string[] } & HTMLImgAttributes = $props();
const src = $derived(sources[0]);
const lightSrc = $derived(sources[1]);
</script>

{#if !lightSrc || lightSrc === src}
  <img {...img} {src} />
{:else}
  <picture>
    <source media={LIGHT_MEDIA} srcset={lightSrc} />
    <img {...img} {src} />
  </picture>
{/if}
