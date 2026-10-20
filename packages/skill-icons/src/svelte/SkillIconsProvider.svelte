<script lang="ts">
import type { Snippet } from 'svelte';
import type { ThemeOption } from '../core/index.js';
import { provideTheme, provideTint } from './theme.svelte.js';

interface Props {
  /** Default theme for every Icon and Icons inside. Omit to inherit from an outer provider. */
  theme?: ThemeOption;
  tint?: string;
  children?: Snippet;
}

let { theme, tint, children }: Props = $props();

provideTheme(() => theme);
provideTint(() => tint);
</script>

{@render children?.()}
