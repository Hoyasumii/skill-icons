<script lang="ts">
  import type { ThemeOption } from '../../src/core/index.js';
  import { Icon, SkillIconsProvider } from '../../src/svelte/index.js';

  let { outer, inner, theme }: { outer?: ThemeOption; inner?: ThemeOption; theme?: ThemeOption } =
    $props();
</script>

<SkillIconsProvider theme={outer}>
  <SkillIconsProvider theme={inner}>
    <Icon latest name="x" {theme} />
  </SkillIconsProvider>
</SkillIconsProvider>
