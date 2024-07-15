import { DeleteSaleInvoice, DetailsSaleInvoice } from '@/app/ui/sale-invoices/buttons';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import { fetchFilteredSaleInvoices } from '@/app/lib/data';

export default async function SaleInvoicesTable({
    query,
    currentPage,
  }: {
    query: string;
    currentPage: number;
  }) {
    const saleInvoices = await fetchFilteredSaleInvoices(query, currentPage);
    return (
        <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {saleInvoices?.map((saleInvoice) => (
                  <div
                    key={saleInvoice.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <p>{formatCurrency(saleInvoice.total_amount)}</p>
                        </div>
                      </div>
                      <p> {saleInvoice.quantity} </p>
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div>
                        <p>{formatDateToLocal(saleInvoice.invoice_date)}</p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <DetailsSaleInvoice id={saleInvoice.id} />
                        <DeleteSaleInvoice id={saleInvoice.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Tanggal
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium text-center">
                      Jumlah Produk
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Harga
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">    
                  {saleInvoices?.map((SaleInvoice) => (
                    <tr
                      key={SaleInvoice.id}
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap px-3 py-3">
                        <p>{formatDateToLocal(SaleInvoice.invoice_date)}</p>
                      </td>
                      <td className="whitespace-nowrap text-center justify-center items-center px-3 py-3">
                        {SaleInvoice.quantity}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {formatCurrency(SaleInvoice.total_amount)}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <DetailsSaleInvoice id={SaleInvoice.id} />
                          <DeleteSaleInvoice id={SaleInvoice.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
  }