// Default theme, restyled black and white, with the book's Layout slots.
import DefaultTheme from "vitepress/theme-without-fonts";
import "@fontsource/source-serif-4/400.css";
import "@fontsource/source-serif-4/400-italic.css";
import "@fontsource/source-serif-4/600.css";
import "./style.css";
import Layout from "./Layout.vue";

export default { extends: DefaultTheme, Layout };
