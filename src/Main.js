import {Box, Button, Center, Heading, HStack, Link, Switch, Text, useColorMode, VStack} from "native-base";
import {Input} from "@components";
import React, {useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {F} from "./config/util";

function ToggleDarkMode() {
    const {colorMode, toggleColorMode} = useColorMode();
    return (
        <HStack space={2} alignItems="center">
            <Text>Dark</Text>
            <Switch
                isChecked={colorMode === "light"}
                onToggle={toggleColorMode}
                aria-label={
                    colorMode === "light" ? "switch to dark mode" : "switch to light mode"
                }
            />
            <Text>Light</Text>
        </HStack>
    );
}

function ToggleLang() {
    const {i18n} = useTranslation();
    const [lang,setLang] = useState(true);

    const switchfn =() =>{
        if(lang){
            i18n.changeLanguage('es')
        }else{
            i18n.changeLanguage('en')
        }
        setLang(!lang);
    }
    return (
        <HStack space={2} alignItems="center">
            <Text>ES</Text>
            <Switch
                isChecked={lang}
                onToggle={switchfn}
            />
            <Text>EN</Text>
        </HStack>
    );
}

export default function Main() {
    const validation = useForm({mode: "all"});
    const {t} = useTranslation();

    const {handleSubmit} = validation;
    const [formulario, setFormulario] = useState({});
    const ref_input1 = useRef();
    const ref_input2 = useRef();
    const ref_input3 = useRef();
    const ref_input4 = useRef();
    const ref_input5 = useRef();

    const submit = (formulario) => {
        console.log("submit", formulario);
    }

    return (
        <Center
            _dark={{bg: "blueGray.900"}}
            _light={{bg: "blueGray.50"}}
            px={4}
            flex={1}
        >
            <VStack space={5} alignItems="center">
                <Heading size="lg">Welcome to NativeBase</Heading>
                <HStack space={2} alignItems="center">
                    <Text>Edit</Text>
                    <Box px={2} py={1}>
                        App.js
                    </Box>
                    <Text>and save to reload.</Text>
                </HStack>
                <ToggleLang/>

                <Link href="https://docs.nativebase.io" isExternal>
                    <Text color="primary.500" underline fontSize={"xl"}>
                        {t("base.title")}
                    </Text>
                </Link>
                <ToggleDarkMode/>
            </VStack>
            <Box alignItems="center">
                <Box w="100%" maxWidth="300px" alignItems="center">
                    <Input
                        name="nombre"
                        label={t("fields.firstname")}
                        value={formulario}
                        setValue={setFormulario}
                        rules={{required: true}}
                        validation={validation}
                        returnKeyType="next"
                        onSubmitEditing={() => ref_input2.current.focus()}
                        placeholder={t("placeholders.firstname")}
                        w="100%"
                        refChil={ref_input1}
                    />
                    <Input
                        name="apellido"
                        label={t("fields.lastname")}
                        value={formulario}
                        setValue={setFormulario}
                        rules={{required: true}}
                        validation={validation}
                        returnKeyType="next"
                        onSubmitEditing={() => ref_input3.current.focus()}
                        placeholder={t("placeholders.lastname")}
                        w="100%"
                        refChil={ref_input2}
                    />
                    <Input
                        name="sobrenombre"
                        label={t("fields.nickname")}
                        value={formulario}
                        setValue={setFormulario}
                        rules={{pattern: /[A-Za-z]{10}/}}
                        validation={validation}
                        placeholder={t("placeholders.nickname")}
                        w="100%"
                        refChil={ref_input3}
                        onSubmitEditing={handleSubmit(submit)}
                    />
                    <Input
                        name="dni"
                        label={t("fields.dni")}
                        value={formulario}
                        setValue={setFormulario}
                        rules={{required: true,validate: value => F.ciValidation(value)}}
                        validation={validation}
                        placeholder={t("placeholders.dni")}
                        w="100%"
                        refChil={ref_input4}
                        onSubmitEditing={handleSubmit(submit)}
                    />
                    <VStack space={2} alignItems="center">
                        <Button size="md" onPress={handleSubmit(submit)} ref={ref_input5}>{t("btns.send")}</Button>
                    </VStack>
                </Box>
            </Box>
        </Center>
    )
}
