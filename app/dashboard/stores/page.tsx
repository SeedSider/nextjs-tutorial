import { CreateInvoice } from "@/app/ui/invoices/buttons";
import { lusitana, inter } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchInvoicesPages, fetchStoreByUserId } from "@/app/lib/data";
import { Metadata } from "next";
import { cookies } from "next/headers";

export default async function Page() {
    const cookieStore = cookies();
    const user = cookieStore.get('user_id')?.value!;
    const store = await fetchStoreByUserId(user);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2x1`}>Detail Toko</h1>
            </div>

            <div className="mt-6 flow-root">
                <div className="inline-block min-w-full align-middle">
                    <div className="rounded-lg bg-gray-50 p-2">
                        <h2 className={`${inter.className} text-2x1 ml-2 mt-2`}>Nama Toko</h2>
                        <div className="mx-2 mb-4 p-2 rounded-md bg-white border-2">
                            <h2 className={`${inter.className} text-xl text-gray-700`}>{store.name}</h2>  
                        </div>
                        <h2 className={`${inter.className} text-2x1 ml-2 mt-2`}>Alamat</h2>
                        <div className="mx-2 mb-4 p-2 rounded-md bg-white border-2">
                            <h2 className={`${inter.className} text-xl text-gray-700`}>{store.address}</h2>  
                        </div>
                        <h2 className={`${inter.className} text-2x1 ml-2 mt-2`}>Kontak</h2>
                        <div className="mx-2 mb-4 p-2 rounded-md bg-white border-2">
                            <h2 className={`${inter.className} text-xl text-gray-700`}>{store.contact}</h2>  
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}