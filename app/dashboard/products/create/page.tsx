import Form from "@/app/ui/products/create-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { cookies } from "next/headers";
import { fetchStoreByUserId } from "@/app/lib/data";

export default async function Page() {
    const cookieStore = cookies();
    const user = cookieStore.get('user_id')?.value!;
    const store = await fetchStoreByUserId(user);

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Product', href: '/dashboard/product' },
                    {
                      label: 'Create Product',
                      href: '/dashboard/product/create',
                      active: true,
                    },
                ]}
            />
            <Form store={store}/>
        </main>
    );
}
