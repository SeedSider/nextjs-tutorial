import Breadcrumbs from "@/app/ui/breadcrumbs";
import { fetchInvoiceProductsByInvoiceId, fetchSaleInvoiceById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { CalendarIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { formatDateToLocal } from "@/app/lib/utils";
import Table from "@/app/ui/sale-invoices/details/table";

export default async function Page({ params }: { params: { id: string }}) {
    const id = params.id;
    const saleInvoice = await fetchSaleInvoiceById(id);

    if (!saleInvoice) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Sale Invoices', href: '/dashboard/sale-invoices' },
                    {
                      label: 'Sale Invoice Details',
                      href: `/dashboard/sale-invoices/${id}/details`,
                      active: true,
                    },
                ]}
            />
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <div className="mb-1">
                    <label htmlFor="registration-code" className="mb-2 block text-sm font-medium">
                        Tanggal
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                        <input
                            disabled={true}
                            id="registration_code"
                            name="registration_code"
                            type="text"
                            defaultValue={formatDateToLocal(saleInvoice.invoice_date)}
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby='registration_code-error'
                        />
                        <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>
            </div>
            <Table saleInvoice={saleInvoice}/>
        </main>
    )
}
