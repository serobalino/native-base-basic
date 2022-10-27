export const F = {
    ciValidation(value = '') {
        if (
            typeof value === 'string' &&
            value.length === 10 &&
            /^\d+$/.test(value)
        ) {
            const digitos = value.split('').map(Number)
            const codigoProvincia = digitos[0] * 10 + digitos[1]
            if (
                codigoProvincia >= 1 &&
                (codigoProvincia <= 24 || codigoProvincia === 30)
            ) {
                const digitoVerificador = digitos.pop()
                const digitoCalculado =
                    digitos.reduce(function (valorPrevio, valorActual, indice) {
                        return (
                            valorPrevio -
                            ((valorActual * (2 - (indice % 2))) % 9) -
                            (valorActual === 9) * 9
                        )
                    }, 1000) % 10
                return digitoCalculado === digitoVerificador
            }
        }
        return false
    }
}
