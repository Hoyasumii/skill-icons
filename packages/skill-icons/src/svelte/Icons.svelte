<script lang="ts">
import {
  DEFAULT_PER_LINE,
  DEFAULT_SIZE,
  iconKey,
  iconsSize,
  loadIcons,
  peekIcons,
  remoteIconsUrl,
  type Theme,
} from '../core/index.js';
import Placeholder from './Placeholder.svelte';
import ThemedImg from './ThemedImg.svelte';
import { useSources, useThemes, useTint } from './theme.svelte.js';
import type { IconsProps } from './types.js';

let {
  names,
  latest,
  baseUrl,
  theme,
  tint: explicitTint,
  size = DEFAULT_SIZE,
  perLine = DEFAULT_PER_LINE,
  ...img
}: IconsProps = $props();

const themes = useThemes(() => theme);
const tint = useTint(() => explicitTint);
const known = $derived(latest ? [...names] : names.filter(name => iconKey(name)));
const local = useSources(
  () => (latest ? '' : `${known.join(',')}|${themes().join(',')}|${perLine}|${tint() ?? ''}`),
  () => themes(),
  t => peekIcons(known, t as Theme, perLine, tint()),
  t => loadIcons(known, t as Theme, perLine, tint()),
);
const dimensions = $derived(iconsSize(known.length, perLine, size));
const alt = $derived(known.join(', '));
</script>

{#if known.length > 0}
  {#if latest}
    {@const remote = themes().map(t => remoteIconsUrl({ icons: known, theme: t, perLine, baseUrl, tint: tint() }))}
    <ThemedImg {alt} {...img} sources={remote} width={dimensions.width} />
  {:else}
    {@const loaded = local()}
    {#if loaded}
      <ThemedImg {alt} {...img} sources={loaded} width={dimensions.width} />
    {:else}
      <Placeholder
        width={dimensions.width}
        height={dimensions.height}
        class={img.class}
        style={img.style}
      />
    {/if}
  {/if}
{/if}
