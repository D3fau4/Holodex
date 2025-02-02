import Vue from "vue";
import Vuetify from "vuetify/lib";
import { primaryColor, secondaryColor } from "@/utils/consts";
import VueI18n from "vue-i18n";

import vuetifyEn from "vuetify/es5/locale/en";
import vuetifyJa from "vuetify/es5/locale/ja";
import vuetifyZh from "vuetify/es5/locale/zh-Hant";
import vuetifyEs from "vuetify/es5/locale/es";
import vuetifyId from "vuetify/es5/locale/id";
import vuetifyFr from "vuetify/es5/locale/fr";
import vuetifyPt from "vuetify/es5/locale/pt";
import vuetifyDe from "vuetify/es5/locale/de";
import vuetifyIt from "vuetify/es5/locale/it";

import enTL from "@/locales/en/ui.yml";
import jaTL from "@/locales/ja-JP/ui.yml";
import esESTL from "@/locales/es-ES/ui.yml";
import esMXTL from "@/locales/es-MX/ui.yml";
import msTL from "@/locales/ms-MY/ui.yml";
import zhTL from "@/locales/zh-TW/ui.yml";
import idTL from "@/locales/id-ID/ui.yml";
import ruTL from "@/locales/ru-RU/ui.yml";
import frTL from "@/locales/fr-FR/ui.yml";
import ptTL from "@/locales/pt-BR/ui.yml";
import deTL from "@/locales/de-DE/ui.yml";
import itTL from "@/locales/it-IT/ui.yml";

// ====== i18n setup ======
Vue.use(VueI18n);

const messages = {
    en: { $vuetify: vuetifyEn, ...enTL },
    ja: { $vuetify: vuetifyJa, ...jaTL },
    ms: { $vuetify: vuetifyEn, ...msTL },
    es: { $vuetify: vuetifyEs, ...esMXTL },
    eses: { $vuetify: vuetifyEs, ...esESTL },
    id: { $vuetify: vuetifyId, ...idTL },
    zh: { $vuetify: vuetifyZh, ...zhTL },
    ru: { $vuetify: vuetifyEn, ...ruTL },
    fr: { $vuetify: vuetifyFr, ...frTL },
    pt: { $vuetify: vuetifyPt, ...ptTL },
    de: { $vuetify: vuetifyDe, ...deTL },
    it: { $vuetify: vuetifyIt, ...itTL },
};

export const langs = [
    { val: "en", display: "English", credit: "@Holodex" },
    { val: "ja", display: "日本語", credit: "Yourein#3960" },
    { val: "zh", display: "繁體中文", credit: "angel84326#7887" },
    { val: "eses", display: "Español España", credit: "TraduSquare (Darkc0m y D3fau4)" },
    { val: "es", display: "Español México", credit: "Aldo#3682" },
    { val: "ms", display: "Bahasa Melayu", credit: "Admiy#8261" },
    { val: "id", display: "Bahasa Indonesia", credit: "alcyneous#2803" },
    { val: "ru", display: "Русский язык", credit: "kirillbarnaul#8499" },
    { val: "fr", display: "Français", credit: "pinembour#7770" },
    { val: "pt", display: "Português Brasileiro", credit: "Ash Niartis#5090" },
    { val: "de", display: "Deutsch", credit: "DatJocab#1803" },
    { val: "it", display: "Italiano", credit: "テオさん#0139" },
];

export const dayjsLangs = {
    async en() {
        await import("dayjs/locale/en");
    },
    async ja() {
        await import("dayjs/locale/ja");
    },
    async zh() {
        await import("dayjs/locale/zh-tw");
    },
    async es() {
        await import("dayjs/locale/es");
    },
    async eses() {
        await import("dayjs/locale/es");
    },
    async ms() {
        await import("dayjs/locale/ms");
    },
    async id() {
        await import("dayjs/locale/id");
    },
    async ru() {
        await import("dayjs/locale/ru");
    },
    async fr() {
        await import("dayjs/locale/fr");
    },
    async pt() {
        await import("dayjs/locale/pt-br");
    },
    async de() {
        await import("dayjs/locale/de");
    },
    async it() {
        await import("dayjs/locale/it");
    },
};

export const i18n = new VueI18n({
    locale: "en", // Set locale
    fallbackLocale: "en",
    messages, // Set locale messages,
    pluralizationRules: {
        /**
         * @param choice {number} a choice index given by the input to $tc: `$tc ('path.to.rule', choiceIndex)`
         * @param choicesLength {number} an overall amount of available choices
         * @returns a final choice index to select plural word by
         */
        ru(choice, choicesLength) {
            // this === VueI18n instance, so the locale property also exists here
            if (choice === 0) {
                return 0;
            }
            // If 'choice' is number, how tf it can end with 'k'?
            // choice = choice.toString().toLowerCase().endsWith("k") ? parseInt(choice, 10) : choice;

            const teen = choice > 10 && choice < 20;
            const endsWithOne = choice % 10 === 1;

            if (choicesLength < 4) {
                return !teen && endsWithOne ? 1 : 2;
            }
            if (!teen && endsWithOne) {
                return 1;
            }
            if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
                return 2;
            }

            return choicesLength < 4 ? 2 : 3;
        },
    },
});
// ====== end i18n setup ======

export const config = {
    treeShake: true,
    icons: {
        iconfont: "mdiSvg",
    },
    theme: {
        themes: {
            dark: {
                primary: primaryColor,
                secondary: secondaryColor,
                background: "#121212",
            },
            light: {
                primary: primaryColor,
                secondary: secondaryColor,
                background: "#f2f2f2", // Not automatically applied
            },
        },
    },
    lang: {
        t: (key, ...params) => i18n.t(key, params),
    },
};

Vue.use(Vuetify);

export const vuetify = new Vuetify(config);
