import { formatCurrency} from '@/app/lib/utils';
import { fetchInvoiceProductsByInvoiceId } from '@/app/lib/data';
import { SaleInvoice } from '@/app/lib/definitions';

export default async function InvoiceProductsTable({
    saleInvoice
  }: {
    saleInvoice: SaleInvoice;
  }) {
    const invoiceProducts = await fetchInvoiceProductsByInvoiceId(saleInvoice.id);
    return (
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {invoiceProducts?.map((invoiceProduct) => (
                <div
                  key={invoiceProduct.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <p>{invoiceProduct.product_name}</p>
                      </div>
                      <p className="text-sm text-gray-500">@ {formatCurrency(invoiceProduct.unit_price)}</p>
                    </div>
                    <p>{invoiceProduct.quantity}</p>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">
                        {formatCurrency(invoiceProduct.total_price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Nama Produk
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium text-center">
                    Jumlah
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Harga Satuan
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Total Harga
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">    
                {invoiceProducts?.map((invoiceProduct) => (
                  <tr
                    key={invoiceProduct.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <p>{invoiceProduct.product_name}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap text-center justify-center items-center px-3 py-3">
                      <p>{invoiceProduct.quantity}</p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatCurrency(invoiceProduct.unit_price)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatCurrency(invoiceProduct.total_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                  <td className="whitespace-nowrap px-3 py-3">
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-semibold">
                    Total
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-semibold">
                    {formatCurrency(saleInvoice.total_amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  }