"use client"
//import { extractor } from "@/lib/emailextractor";
import { EmailTable } from "@/components/emailTable";
// fot he form input
import { set, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { extractor } from "@/actions/emailextractor";

//schena
const formSchema = z.object({
    url: z.string({ required_error: "Ingrese la URL" })
        .url({ message: "Url no válida" })
});

// components
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

//Anims
import chalk from "chalk";
import { useState } from "react";
//import { clsx } from "clsx";
import { MagicWandIcon, ReloadIcon } from "@radix-ui/react-icons";
import useEmail from "@/hooks/useEmail";

export default function Extractor() {
    // 1. define the form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: "https://hunter.io/",
        },
    });

    // 2. Define submit handler
    const [isLoading, setIsLoading] = useState(false);

    //3. This is for the Store of Emails
    const emails = useEmail((state: any) => state.emails);
    const addEmail = useEmail((state: any) => state.addEmail);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            console.log(chalk.green(JSON.stringify(values)));
            //scraping logic
            const result = await extractor(values.url);

            console.log(chalk.green(JSON.stringify(result)));
            for (var data of result?.result!) {
                addEmail(data);

            }
            console.log(emails);
            setIsLoading(false);
            /*  const a = new Promise((resolve, reject) => {
                 setTimeout(() => {
                     resolve("hola");
                 }, 2000);
             });
             const b = a.then((res) => {
                 console.log(chalk.green(res));
                 setIsLoading(false);
             });
  */
        } catch (error) {
            setIsLoading(false);
            console.log(chalk.red(error));
        }
        //      const a = await extractor("https://hunter.io/about");
        //console.log(a);
    }

    return (
        <>
            <div className="flex p-8 flex-col w-full h-screen items-center gap-8 justify-center bg-background">
                <h1 className="scroll-m-20 text-2xl  sm:4xl font-extrabold tracking-tight text-center lg:text-5xl">Email Extractor by Jhoan</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row justify-center items-centerspace-x-4 space-y-8 gap-4">
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ingrese la URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://hunter.io/" type="url" {...field} />
                                    </FormControl>
                                    <FormDescription>Ingrese la URL de la página que desea extraer los emails</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" {...{ disabled: isLoading }} className="w-full sm:w-fit">
                            {
                                isLoading ?
                                    <>
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />Espera
                                    </>
                                    :
                                    <>
                                        <MagicWandIcon className="mr-2 h-4 w-4" />Extraer
                                    </>
                            }
                        </Button>
                    </form>
                </Form>
                <EmailTable />
            </div>



        </>
    )
}