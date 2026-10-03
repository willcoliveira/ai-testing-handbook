<script setup>
// Meta line and "See also" (both from transformPageData), a reading-progress line,
// ← / → for previous / next, and a plain 404.
import DefaultTheme from "vitepress/theme-without-fonts";
import { useData, withBase } from "vitepress";
import { computed, onMounted, onUnmounted, ref } from "vue";

const { Layout } = DefaultTheme;
const { page } = useData();
const meta = computed(() => page.value.handbook?.meta || "");
const seeAlso = computed(() => page.value.handbook?.seeAlso || []);
const progress = ref(0);

let frame = 0;
function onScroll() {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0;
  });
}

// focus inside something that scrolls sideways (a wide table): the arrows belong to it
function scrollsX(el) {
  for (; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
    if (el.scrollWidth > el.clientWidth + 1 && /auto|scroll/.test(getComputedStyle(el).overflowX)) return true;
  }
  return false;
}
const EDITABLE = 'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="dialog"], [role="combobox"], [role="listbox"], .VPLocalSearchBox';

function onKey(e) {
  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
  if (e.defaultPrevented || e.isComposing || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
  const t = e.target instanceof Element ? e.target : null;
  if (t && (t.isContentEditable || t.closest(EDITABLE) || scrollsX(t))) return;
  if (document.querySelector(".VPLocalSearchBox")) return; // search open
  const a = document.querySelector(`.VPDocFooter .pager-link.${e.key === "ArrowLeft" ? "prev" : "next"}`);
  if (!a) return;
  e.preventDefault();
  a.click();
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("keydown", onKey);
  onScroll();
});
onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("keydown", onKey);
});
</script>

<template>
  <Layout>
    <template #layout-top>
      <div class="hb-progress" aria-hidden="true"><span :style="{ transform: `scaleX(${progress})` }"></span></div>
    </template>
    <template #doc-before>
      <p v-if="meta" class="hb-meta">{{ meta }}</p>
    </template>
    <template #doc-footer-before>
      <nav v-if="seeAlso.length" class="hb-see-also" aria-labelledby="hb-see-also">
        <h2 id="hb-see-also">See also</h2>
        <ul>
          <li v-for="s in seeAlso" :key="s.link"><a :href="withBase(s.link)">{{ s.text }}</a></li>
        </ul>
      </nav>
    </template>
    <template #not-found>
      <div class="hb-404">
        <h1>Page not found</h1>
        <p>Nothing is published at this address. Start from the <a :href="withBase('/')">introduction</a>.</p>
      </div>
    </template>
  </Layout>
</template>
