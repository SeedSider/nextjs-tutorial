import Form from "@/app/ui/sale-invoices/create-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { cookies } from "next/headers";
import { fetchFilteredProducts, fetchProductsPages, fetchStoreByUserId } from "@/app/lib/data";
import Search from "@/app/ui/search";
import { Suspense } from "react";
import { ProductsTableSkeleton } from "@/app/ui/skeletons";
import Table from "@/app/ui/sale-invoices/create/table";
import Pagination from "@/app/ui/pagination";

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const cookieStore = cookies();
    const user = cookieStore.get('user_id')?.value!;
    const store = await fetchStoreByUserId(user);

    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;    

    const totalPages = await fetchProductsPages(query);
    const products = await fetchFilteredProducts(query, currentPage);
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Sale Invoice', href: '/dashboard/sale-invoices' },
                    {
                      label: 'Create Sale Invoice',
                      href: '/dashboard/sale-invoices/create',
                      active: true,
                    },
                ]}
            />
            <div className="w-full mb-4">
                <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                    <Search placeholder="Search products..." />
                </div>
                <Suspense key={query + currentPage} fallback={<ProductsTableSkeleton />}>
                    <Table products={products} />
                </Suspense>
                <div className="mt-5 flex w-full justify-center">
                    <Pagination totalPages={totalPages} />
                </div>
            </div>
            
            <Form store={store}/>
        </main>
    );
}
