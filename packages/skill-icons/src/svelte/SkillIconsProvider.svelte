<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ThemeOption } from '../core/index.js';
  import { provideTheme } from './theme.svelte.js';

  interface Props {
    /** Default theme for every Icon and Icons inside. Omit to inherit from an outer provider. */
    theme?: ThemeOption;
    children?: Snippet;
  }

  let { theme, children }: Props = $props();

  provideTheme(() => theme);
</script>

{@render children?.()}
