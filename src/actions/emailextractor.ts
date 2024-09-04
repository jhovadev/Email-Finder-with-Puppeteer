"use server"

// Scraping Logic
import puppeteer from 'puppeteer-core';
// this is for the chrome-min
import chromium from '@sparticuz/chromium-min';
import chalk from "chalk";
// Host the tar-file yourself
//let tarfile = "https://github.com/Sparticuz/chromium/releases/download/v112.0.0/chromium-v112.0.0-pack.tar"
let tarfile = ""
chromium.setGraphicsMode = false;
chromium.setHeadlessMode = true;

//const chromiumPack = "https://my-domain/chromium-v127.0.0-pack.tar";
//for rerender the page
import { revalidatePath } from 'next/cache';
// /[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}/gm
export const extractor = async (url: string) => {
    try {
        const browser = await puppeteer.launch({
            headless: chromium.headless,
            executablePath: await chromium.executablePath(
                "https://github.com/Sparticuz/chromium/releases/download/v127.0.0/chromium-v127.0.0-pack.tar"
            ),
            //args: [chromium.args, '--proxy-server=127.0.0.1:9876',],
            args: [
                ...chromium.args,
                '--hide-scrollbars',
                '--disable-web-security',
            ],
            defaultViewport: chromium.defaultViewport,
        });
        const page = await browser.newPage();
        /*         const navigationPromise = page.waitForNavigation({
                    waitUntil: "networkidle0",
                    timeout: 300000,
                }); */

        console.log(chalk.black.bgBlue.bold("Yendo A la página"))
        //await page.goto(url, { waitUntil: "networkidle0", timeout: 300000 });
        await page.goto(url, { waitUntil: "networkidle0" });
        //await navigationPromise;

        console.log(chalk.black.bgYellow.bold("Iniciando proceso de extracción"))
        const result = await page.evaluate(() => {
            const matchInContent = (text: string): string[] => {
                let arr: string[] = [];
                const re: RegExp = new RegExp("[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}", "gm");
                let match: RegExpExecArray | null;
                while ((match = re.exec(text)) !== null) {
                    arr.push(match[0]);
                }
                return (arr.length === 0) ? [] : [...new Set(arr)];
            }
            return matchInContent(document.getElementsByTagName("html")[0].outerHTML);
        });
        //console.log(chalk.bgGreen.white("datos:") + "\n" + chalk.white(result));
        await browser.close();
        console.log(chalk.black.bgBlue.bold("Fin proceso de extracción"))
        revalidatePath("/");
        //end of scraping logic
        console.log(chalk.bgYellow.black.bold(JSON.stringify({ result, url })));
        return { result, url };
    } catch (error) {
        console.log(chalk.white.bgRed.bold("Error") + chalk.white.bgBlack.bold(error));
    }
}