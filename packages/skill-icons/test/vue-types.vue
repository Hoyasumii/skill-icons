<!-- Type tests for templates, checked by `vue-tsc -p tsconfig.vue.json`. -->
<script setup lang="ts">
import { Icon, Icons, SkillIconsProvider } from '../src/vue/index.js';
</script>

<template>
  <SkillIconsProvider theme="auto">
    <Icon name="react" />
    <Icon name="js" theme="light" :size="32" alt="JavaScript" class="icon" />
    <!-- @vue-expect-error unknown names are rejected outside latest mode -->
    <Icon name="nope" />
    <Icon latest name="nope" base-url="/x" />
    <!-- @vue-expect-error baseUrl only applies to latest mode -->
    <Icon name="js" base-url="/x" />
    <!-- @vue-expect-error not a theme -->
    <Icon name="js" theme="blue" />

    <Icons :names="['js', 'ts']" :per-line="2" />
    <!-- @vue-expect-error unknown names are rejected outside latest mode -->
    <Icons :names="['js', 'nope']" />
    <Icons latest :names="['js', 'nope']" />
  </SkillIconsProvider>
</template>
