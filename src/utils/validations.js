export const cedula = (value) =>{
    let flag = false;
    if (typeof value === 'string') {
        const digitos = value.split('').map(Number);
        const codigoProvincia = digitos[0] * 10 + digitos[1];
        if (codigoProvincia >= 1 && (codigoProvincia <= 24 || codigoProvincia === 30)) {
            const digitoVerificador = digitos.pop()
            const digitoCalculado = digitos.reduce(
                function (valorPrevio, valorActual, indice) {
                    return valorPrevio - (valorActual * (2 - indice % 2)) % 9 - (valorActual === 9) * 9
                }, 1000) % 10
            flag = digitoCalculado === digitoVerificador;
        }
    }
    return flag || "Ingresa una cedula valida";
}