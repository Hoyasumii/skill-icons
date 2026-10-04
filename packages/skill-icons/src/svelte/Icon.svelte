<script lang="ts">
  import {
    DEFAULT_SIZE,
    iconKey,
    loadIcon,
    peekIcon,
    remoteIconsUrl,
  } from '../core/index.js';
  import Placeholder from './Placeholder.svelte';
  import ThemedImg from './ThemedImg.svelte';
  import { useSources, useThemes } from './theme.svelte.js';
  import type { IconProps } from './types.js';

  let { name, latest, baseUrl, theme, size = DEFAULT_SIZE, ...img }: IconProps = $props();

  const themes = useThemes(() => theme);
  const keys = $derived(latest ? [] : themes().flatMap(t => iconKey(name, t) ?? []));
  const local = useSources(() => keys.join(','), () => keys, peekIcon, loadIcon);
  const remote = $derived(
    latest ? themes().map(t => remoteIconsUrl({ icons: [name], theme: t, perLine: 1, baseUrl })) : [],
  );
</script>

{#if latest}
  <ThemedImg alt={name} {...img} sources={remote} width={size} height={size} />
{:else if keys.length > 0}
  {@const loaded = local()}
  {#if loaded}
    <ThemedImg alt={name} {...img} sources={loaded} width={size} height={size} />
  {:else}
    <Placeholder width={size} height={size} class={img.class} style={img.style} />
  {/if}
{/if}
