import Image from 'next/image';
import { UpdateProduct, DeleteProduct } from '@/app/ui/products/buttons';
import ProductStatus from '@/app/ui/products/status';
import { formatCurrency } from '@/app/lib/utils';
import { fetchFilteredProducts } from '@/app/lib/data';

export default async function ProductsTable({
    query,
    currentPage,
  }: {
    query: string;
    currentPage: number;
  }) {
    const products = await fetchFilteredProducts(query, currentPage);
    return (
        <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {products?.map((product) => (
                  <div
                    key={product.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                        { product.image_url && (
                          <Image
                            src={product.image_url}
                            className="mr-2 rounded-full"
                            width={28}
                            height={28}
                            alt={`${product.name} picture`}
                          />
                        )}
                          <p>{product.name}</p>
                        </div>
                        <p className="text-sm text-gray-500">{product.description}</p>
                      </div>
                      <ProductStatus quantity={product.quantity} />
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div>
                        <p className="text-xl font-medium">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <UpdateProduct id={product.id} />
                        <DeleteProduct id={product.id} />
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
                    <th scope="col" className="px-3 py-5 font-medium">
                      Deskripsi
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium text-center">
                      Stok
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Harga
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">    
                  {products?.map((product) => (
                    <tr
                      key={product.id}
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                        { product.image_url && (
                          <Image
                            src={product.image_url}
                            className="rounded-full"
                            width={28}
                            height={28}
                            alt={`${product.name} picture`}
                          />
                        )}
                          <p>{product.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <p>{product.description}</p>
                      </td>
                      <td className="whitespace-nowrap text-center justify-center items-center px-3 py-3">
                        <ProductStatus quantity={product.quantity} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateProduct id={product.id} />
                          <DeleteProduct id={product.id} />
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