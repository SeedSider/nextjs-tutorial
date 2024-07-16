'use client';

import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createSaleInvoice } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { ProductsTable, StoreForm } from '@/app/lib/definitions';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '@/redux/store';
import React from 'react';
import { formatCurrency } from '@/app/lib/utils';
import { updateCart } from '@/redux/slices/cartSlice';
import ProductStatus from './status';

interface CartItem {
  product: ProductsTable;
  quantity: number;
}

interface CartState {
  id: number;
  product: ProductsTable;
  quantity: number;
}

export default function Form({ store }: {store: StoreForm}) {
  const dispatchRedux = useDispatch<AppDispatch>();
  const cartArray = useAppSelector((state) => state.cart);

  const state = { message: null, errors: {} };
  const [ProductsTable, setCartItems] = React.useState<CartItem[]>([]);

  useEffect(() => {
    setCartItems(cartArray)
  },[])

  const incrementCartItem = (index: number) => {
    let tempCartItems = cartArray.map((item) => 
      Number(item.product.id) === index && item.quantity < item.product.quantity ? {...item, quantity: item.quantity + 1} : item)
    dispatchRedux(updateCart(tempCartItems)); 
  }
  const decrementCartItem = (index: number) => {
    let tempCartItems = cartArray.map((item) => 
      Number(item.product.id) === index && item.quantity > 1 ? {...item, quantity: item.quantity - 1} : item)
    dispatchRedux(updateCart(tempCartItems)); 
  }
  const removeCartItem = (index: number) => {
    let tempCartItems = [...cartArray];
    tempCartItems.splice(index, 1);
    dispatchRedux(updateCart(tempCartItems)); 
  }
  const createSaleInvoiceProduct = (products: CartState[]) => {
    if(products !== undefined && products.length != 0) {
      createSaleInvoice(store, products)
    }
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="flex rounded-lg text-sm font-medium">
            <div className="flex-1 mt-4 ml-4">
              Nama Produk
            </div>
            <div className="flex-1 mt-4">
              Harga Satuan
            </div>
            <div className="flex-initial w-32 mt-4 mr-8 text-center">
              Jumlah
            </div>
            <div className="flex-initial w-32 mt-4 mr-4">
              Total Harga
            </div>
            <div className="flex-initial w-20 py-3 pl-6 pr-3">
              <span className="sr-only">Edit</span>
            </div>
          </div>
          { cartArray.length === 0 ? <div className="flex-auto text-gray-400 text-sm my-5 text-center">Keranjang kosong</div> : null }
          {cartArray.map((cartItem, index) => (
            <div className="flex rounded-lg text-sm font-medium" key={cartItem.id}>
              <div className="flex-1 mt-4 ml-4">
                {cartItem.product.name}
              </div>
              <div className="flex-1 mt-4">
                {formatCurrency(cartItem.product.price)}
              </div>
              <div className="flex-initial w-32 mt-3 mr-8 text-center">
                <div className="flex justify-center">
                  <button
                    className="flex-initial w-8 py-2 pl-3 pr-3 items-center rounded-md border hover:bg-gray-100"
                    onClick={() => {decrementCartItem(cartItem.id)}}>
                    <MinusIcon className="w-3" />
                  </button>
                  <span className='mx-3'>{cartItem.quantity}</span>
                  <button
                    className="flex-initial w-8 py-2 pl-3 pr-3 items-center rounded-md border hover:bg-gray-100"
                    onClick={() => {incrementCartItem(cartItem.id)}}
                    >
                    <PlusIcon className="w-3" />
                  </button>
                </div>
              </div>
              <div className="flex-initial w-32 mt-4 mr-4">
                {formatCurrency(cartItem.product.price * cartItem.quantity)}
              </div>
              <div className="flex-initial w-20 py-2 pl-6 pr-3">
                <button className="rounded-md border p-2 hover:bg-gray-100"
                  onClick={() => {removeCartItem(index)}}
                >
                  <span className="sr-only">Delete</span>
                    <TrashIcon className="w-5" />
                </button>
            </div>
          </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/sale-invoices"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit" onClick={() => {createSaleInvoiceProduct(cartArray)}}>Create Invoice</Button>
        </div>
      </div>
    </div>
  );
}
