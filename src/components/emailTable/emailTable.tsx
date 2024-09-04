import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { isFreeEmail, isCompanyEmail } from "free-email-domains-list";
import { hasValidMxRecords } from "@/lib/emailvalidator";

import useEmail from "@/hooks/useEmail"

export default function EmailTable() {
    const emails = useEmail((state: any) => state.emails);
    return (
        <>
            <div className="flex justify-center items-start w-full h-1/2 ">
                {
                    emails?.length > 0 ? (
                        <>
                            <Table className="overflow-hidden">
                                <TableCaption></TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[6.25rem]">Email</TableHead>
                                        <TableHead>MXRecords</TableHead>
                                        <TableHead className="w-[10rem]">Dominio Publico</TableHead>
                                        <TableHead className="text-right">Dominio Privado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        emails?.map((email: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{email}</TableCell>
                                                <TableCell>{"Si"}</TableCell>
                                                <TableCell>{isFreeEmail(email) ? "Sí" : "No"}</TableCell>
                                                <TableCell className="text-right">{isCompanyEmail(email) ? "Sí" : "No"}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </>
                    )
                        :
                        <>
                            <h2 className="scroll-m-20 text-gray-200 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                                Sin Datos
                            </h2>
                        </>
                }
            </div>
        </>
    )
}