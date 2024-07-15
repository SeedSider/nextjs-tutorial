'use client';

import { ProductForm } from '@/app/lib/definitions';
import {
  CurrencyDollarIcon, InformationCircleIcon, PhotoIcon, QrCodeIcon, Square2StackIcon, TagIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateProduct } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { useRef } from 'react';

export default function EditProductForm({
  product
}: {
  product: ProductForm;
}) {
  const initialState = { message: null, errors: {} };
  const updateProductWithId = updateProduct.bind(null, product.id);
  const [state, dispatch] = useFormState(updateProductWithId, initialState);
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* product image upload */}
        <div className="mb-4">
          <label htmlFor="image-upload" className="mb-2 block text-sm font-medium">
            Foto Produk
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="image_url"
                name="image_url"
                type="file"
                ref={fileInput}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby='image_upload-error'
              />
              <PhotoIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="image_upload-error" aria-live='polite' aria-atomic="true">
            </div>
          </div>
        </div>
        {/* product registration code */}
        <div className="mb-4">
          <label htmlFor="registration-code" className="mb-2 block text-sm font-medium">
            Kode Registrasi
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="registration_code"
                name="registration_code"
                type="text"
                placeholder="Masukkan kode registrasi"
                defaultValue={product.registration_code}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby='registration_code-error'
              />
              <QrCodeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="registration_code-error" aria-live='polite' aria-atomic="true">
            </div>
          </div>
        </div>
        {/* product name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Nama Produk
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Masukkan nama"
                defaultValue={product.name}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby='nama-error'
              />
              <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="name-error" aria-live='polite' aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>
        {/* product description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Deskripsi Produk
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="description"
                name="description"
                type="text"
                placeholder="Masukkan deskripsi produk"
                defaultValue={product.description}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby='description-error'
              />
              <InformationCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="description-error" aria-live='polite' aria-atomic="true">
            </div>
          </div>
        </div>
        {/* product Price */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Harga Produk
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="price"
                name="price"
                type="number"
                step="1"
                placeholder="Masukkan harga produk"
                defaultValue={product.price}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby='price-error'
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="price-error" aria-live='polite' aria-atomic="true">
            {state.errors?.price &&
              state.errors.price.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>
        {/* product quantity */}
        <div className="mb-4">
          <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
            Stok
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="Masukkan stok produk"
                defaultValue={product.quantity}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby='quantity-error'
              />
              <Square2StackIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="quantity-error" aria-live='polite' aria-atomic="true">
            {state.errors?.quantity &&
              state.errors.quantity.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div id="any-error" aria-live='polite' aria-atomic="true">
          <p className="mt-2 text-sm text-red-500">{state.message}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/products"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Product</Button>
      </div>
    </form>
  );
}
