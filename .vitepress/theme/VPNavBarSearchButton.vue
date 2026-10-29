<!--
  VitePress 1.6's search button, with the shortcut keys rendered as VitePress 2.0 renders them: both
  key labels drawn by CSS (1.6 already draws the Ctrl / ⌘ glyph that way; here the K too) and the
  keys aria-hidden. A control's visible text must be part of its accessible name (WCAG 2.5.3; axe
  4.14 `label-content-name-mismatch`, which compares the text that is visually on screen), and the
  "K" text node made the visible text "Search K" against the name "Search".
  The alias in config.mjs swaps this file in for the relative import inside VPNavBarSearch.vue; the
  original is imported here for its (global) styles, so the button looks as before.
  tests/site/unit/search-button-override.test.mjs holds this template to the installed original.
-->
<script setup>
import "vitepress/dist/client/theme-default/components/VPNavBarSearchButton.vue";
import { createSearchTranslate } from "vitepress/dist/client/theme-default/support/translation.js";

const translate = createSearchTranslate({ button: { buttonText: "Search", buttonAriaLabel: "Search" } });
</script>

<template>
  <button type="button" class="DocSearch DocSearch-Button" :aria-label="translate('button.buttonAriaLabel')">
    <span class="DocSearch-Button-Container">
      <span class="vp-icon DocSearch-Search-Icon"></span>
      <span class="DocSearch-Button-Placeholder">{{ translate('button.buttonText') }}</span>
    </span>
    <span class="DocSearch-Button-Keys" aria-hidden="true">
      <kbd class="DocSearch-Button-Key"></kbd>
      <kbd class="DocSearch-Button-Key"></kbd>
    </span>
  </button>
</template>

<style>
/* the K, as text the original's font rules still apply to; the first key's glyph is the original's :after */
.DocSearch-Button .DocSearch-Button-Key:last-child:after {
  content: 'K';
}
</style>
