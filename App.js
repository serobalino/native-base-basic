import React from "react";
import {
    NativeBaseProvider,
} from "native-base";
import Main from "./src/Main";
import {theme} from "@config";
import {i18n} from "@plugins/i18n";

import {useTranslation} from "react-i18next";
const initI18n = i18n;

export default function App() {
    const {t, i18n} = useTranslation();
    return (
        <NativeBaseProvider theme={theme}>
            <Main screenProps={{t, i18n}}/>
        </NativeBaseProvider>
    );
}


