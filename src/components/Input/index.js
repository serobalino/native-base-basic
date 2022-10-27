import {Input, FormControl, Spinner} from 'native-base';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Controller} from 'react-hook-form';
import {useTranslation} from "react-i18next";

export default function Index(props) {
    const {
        name,
        label,
        rules,
        value,
        validation,
        disabled,
        loading,
        refChil,
        InputRightElement,
        ...rest
    } = props;

    const {setValue, control, formState: {errors}} = validation;
    const {t} = useTranslation();

    const [inValue, setInValue] = useState(value[name]);

    useEffect(() => {
        setValue(name, value[name]);
    }, [value])

    const setInputValue = (val) => {
        setInValue(val);
        props.setValue({...value, [name]: val});
    }

    const RightIcon = () => {
        if (loading) {
            return (<Spinner size="sm" mr={1} style={{paddingRight: 10}}/>)
        } else {
            return InputRightElement;
        }
    }
    return (
        <FormControl isRequired={rules.required} isInvalid={name in errors} isDisabled={disabled || loading} pb={1}>
            <FormControl.Label mb={0}>{label}</FormControl.Label>
            <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                    <Input
                        ref={refChil}
                        onBlur={onBlur}
                        onChange={onChange}
                        onChangeText={(aux) => {
                            setInputValue(aux);
                            onChange(aux);
                        }}
                        value={value}
                        isDisabled={disabled || loading}
                        InputRightElement={<RightIcon/>}
                        {...rest}
                    />
                )}
                name={name}
                rules={rules}
                defaultValue={inValue}
            />
            <FormControl.ErrorMessage mt={0}>
                {t('validation.'+errors[name]?.type,{label: label.toLowerCase()})}
            </FormControl.ErrorMessage>
        </FormControl>
    );
}
Index.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    rules: PropTypes.object,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    setValue: PropTypes.func.isRequired,
    InputRightElement: PropTypes.node,
    refChil: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape()
    ])
}
Index.defaultProps = {
    name: "input",
    label: "Label input",
    rules: {},
    disabled: false,
    loading: false,
    InputRightElement: null,
    refChil: null,
}
