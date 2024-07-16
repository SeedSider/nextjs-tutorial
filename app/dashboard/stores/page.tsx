import { lusitana} from "@/app/ui/fonts";
import { fetchStoreByUserId } from "@/app/lib/data";
import { cookies } from "next/headers";
import { BuildingStorefrontIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/solid";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Store',
  };

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
                        <div className="mb-4">
                        <label htmlFor="registration-code" className="mb-2 block text-sm font-medium">
                            Nama Toko
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                            <input
                                id="registration_code"
                                name="registration_code"
                                type="text"
                                placeholder="Masukkan kode registrasi"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby='registration_code-error'
                                defaultValue={store.name}
                                disabled={true}
                            />
                            <BuildingStorefrontIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                            <div id="registration_code-error" aria-live='polite' aria-atomic="true">
                            </div>
                        </div>
                        </div>
                        {/* product name */}
                        <div className="mb-4">
                        <label htmlFor="name" className="mb-2 block text-sm font-medium">
                            Alamat Toko
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Masukkan nama"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby='nama-error'
                                defaultValue={store.address}
                                disabled={true}
                            />
                            <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                        </div>
                        </div>
                        {/* product description */}
                        <div className="mb-4">
                        <label htmlFor="description" className="mb-2 block text-sm font-medium">
                            Kontak
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                            <input
                                id="description"
                                name="description"
                                type="text"
                                placeholder="Masukkan deskripsi produk"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby='description-error'
                                defaultValue={store.contact}
                                disabled={true}
                            />
                            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                            <div id="description-error" aria-live='polite' aria-atomic="true">
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}