<!-- Type tests for templates, checked by `svelte-check --tsconfig tsconfig.svelte.json`. -->
<script lang="ts">
import { Icon, Icons, SkillIconsProvider } from '../../src/svelte/index.js';
</script>

<SkillIconsProvider theme="auto">
  <Icon name="react" />
  <Icon name="js" theme="light" size={32} alt="JavaScript" class="icon" />
  <!-- @ts-expect-error unknown names are rejected outside latest mode -->
  <Icon name="nope" />
  <Icon latest name="nope" baseUrl="/x" />
  <!-- @ts-expect-error baseUrl only applies to latest mode -->
  <Icon name="js" baseUrl="/x" />
  <!-- @ts-expect-error not a theme -->
  <Icon name="js" theme="blue" />

  <Icons names={['js', 'ts']} perLine={2} />
  <!-- @ts-expect-error unknown names are rejected outside latest mode -->
  <Icons names={['js', 'nope']} />
  <Icons latest names={['js', 'nope']} />
</SkillIconsProvider>
