// Verification Logic
import * as dns from "node:dns";
import chalk from "chalk";
/*
MxRecords: Te permite confirmar que el dominio al que pertenece el correo
electrónico puede recibir mensajes. Si el dominio no tiene registros MX válidos,
es probable que no pueda recibir correos, lo que hace que la dirección sea
inválida para propósitos de comunicación. es
*/
export async function hasValidMxRecords(email: string) {
    try {
        const mxRecords = await dns.promises.resolveMx(obtenerDominio(email));
        if (mxRecords.length > 0) {
            if (mxRecords.every((x) => !x.exchange && !x.priority)) {
                return false;
            }
            return true;
        }
        return false;
    } catch (e: any) {
        switch (e.code) {
            case "ENOTFOUND":
                console.log(chalk.white.bgRed("No se encontró ningún dominio en la base de datos DNS"));
                break;
            case "ENODATA":
                console.log(chalk.white.bgRed("No se encontró ningún registro MX en la base de datos DNS"));
                break;
            case "EAI_AGAIN":
                console.log(chalk.white.bgRed("No se pudo conectar con la base de datos DNS"));
                break;
            default:
                console.log(chalk.white.bgRed("Error inesperado"));
                break;
        }
        //return { errno: e.errno, code: e.code, status: false };
        console.log({ errno: e.errno, code: e.code, status: false });
        return false;
    }
}

/*
hasValidMxRecords("gmail.com").then((result) => {
    console.log(result, "asdasd");
});
 */

export function obtenerDominio(email: string) {
    // Encuentra el índice del símbolo '@'
    const indiceArroba = email.indexOf('@');

    // Verifica si el símbolo '@' existe en la cadena
    if (indiceArroba === -1) {
        throw new Error('El correo electrónico no es válido.');
    }

    // Obtén el dominio a partir del índice del símbolo '@'
    const dominio = email.substring(indiceArroba + 1);

    return dominio;
}

export type output = {
    index: number;
    email: string;
    publicDomain: boolean;
    privateDomain: boolean;
    validMxRecords: boolean;
    //    disposable: boolean;
}

/* 
hasValidMxRecords("gmail.com").then((result) => {
    console.log(result, "asdasd");
});

 */