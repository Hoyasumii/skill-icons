<script lang="ts">
import type { ThemeOption } from '../../src/core/index.js';
import { Icon, SkillIconsProvider } from '../../src/svelte/index.js';

let {
  outer,
  inner,
  theme,
  outerTint,
  tint,
}: {
  outer?: ThemeOption;
  inner?: ThemeOption;
  theme?: ThemeOption;
  outerTint?: string;
  tint?: string;
} = $props();
</script>

<SkillIconsProvider theme={outer} tint={outerTint}>
  <SkillIconsProvider theme={inner}>
    <Icon latest name="x" {theme} {tint} />
  </SkillIconsProvider>
</SkillIconsProvider>
