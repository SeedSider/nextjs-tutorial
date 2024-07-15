'use server';

import { z } from "zod";
import { sql } from '@vercel/postgres';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import fs from "node:fs/promises";
import { CartState, StoreForm } from "./definitions";

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Pleasee select an invoice status.'
    }),
    date: z.string(),
})

const FormProductSchema = z.object({
    id: z.string(),
    image_url: z.string().nullish().optional(),
    registration_code: z.string().nullish().optional(),
    name: z.string().min(2, { message: 'Nama produk tidak boleh kosong!' }),
    description: z.string().optional(),
    price: z.coerce
        .number()
        .gt(0, { message: 'Masukkan harga di atas Rp 0,00' }),
    quantity: z.coerce
        .number()
})

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreateProduct = FormProductSchema.omit({ id: true});
const UpdateProduct = FormProductSchema.omit({ id: true});

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

export type ProductState = {
    errors?: {
        name?: string[];
        price?: string[];
        quantity?: string[];
    };
    message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Create Invoice.',
        };
      }
    
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
    }
    catch (error) {
        return {
            message: 'Database error: Failed to Create Invoice',
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
    `;
    }
    catch (error) {
        return {
            message: 'Database error: Failed to Update Invoice',
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
    }
    catch (error) {
        return {
            message: 'Database error: Failed to Delete Invoice',
        };
    }
}

export async function createProduct(storeId: string, prevState: ProductState, formData: FormData) {
    const validatedFields = CreateProduct.safeParse({
        registration_code: formData.get('registration_code'),
        name: formData.get('name'),
        description: formData.get('description'),
        quantity: formData.get('quantity'),
        price: formData.get('price'),

    });

    const file = formData.get("image_url") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Data tidak lengkap. Produk gagal diinput.',
        };
      }
    
    const { registration_code, name, description, quantity, price } = validatedFields.data;
    const filename = `/products/${file.name}`

    try {
        await fs.writeFile(`./public/products/${file.name}`, buffer);
        await sql`
        INSERT INTO products (store_id, image_url, registration_code, name, description, quantity, price)
        VALUES (${storeId}, ${filename}, ${registration_code}, ${name}, ${description}, ${quantity}, ${price})
    `;
    }
    catch (error) {
        return {
            message: 'Database error: Failed to Create Product.' + error,
        };
    }

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
}

export async function updateProduct(id: string, prevState: ProductState, formData: FormData) {
    const validatedFields = UpdateProduct.safeParse({
        registration_code: formData.get('registration_code'),
        description: formData.get('description'),
        name: formData.get('name'),
        quantity: formData.get('quantity'),
        price: formData.get('price'),
    });

    const file = formData.get("image_url") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Update Product.',
        };
    }

    const { registration_code, name, description, quantity, price } = validatedFields.data;
    const filename = `/products/${file.name}`

    try {
        await fs.writeFile(`./public/products/${file.name}`, buffer);
        await sql`
        UPDATE products
        SET registration_code = ${registration_code}, image_url = ${filename}, name = ${name}, description = ${description}, quantity = ${quantity}, price = ${price}
        WHERE id = ${id}
    `;
    }
    catch (error) {
        return {
            message: 'Database error: Failed to Update Products' + error,
        };
    }

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
}

export async function deleteProduct(id: string) {
    try {
        await sql`DELETE FROM products WHERE id = ${id}`;
        revalidatePath('/dashboard/products');
        return { message: 'Deleted Product.' };
    }
    catch (error) {
        return {
            message: 'Database error: Failed to Delete Product',
        };
    }
}

export async function createSaleInvoice(store:StoreForm, products: CartState[]) {
    const date = new Date().toISOString();
    const totalPrice = products.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
    try {
        const query = await sql`
            INSERT INTO sale_invoices (store_id, user_id, invoice_date, total_amount)
            VALUES (${store.id}, ${store.user_id}, ${date}, ${totalPrice}) RETURNING id
        `;

        const invoice_id = query.rows[0].id;

        for(let i = 0; i < products.length; i++) {
            await sql`
            INSERT INTO invoice_products (invoice_id, product_id, quantity, unit_price, total_price)
            VALUES (${invoice_id}, ${products[i].product.id}, ${products[i].quantity}, ${products[i].product.price}, ${products[i].product.price * products[i].quantity})
        `;
        }
    }
    catch (error) {
        return {
            message: 'Database error: Failed to Create Product.' + error,
        };
    }

    revalidatePath('/dashboard/sale-invoices');
    redirect('/dashboard/sale-invoices');
}

export async function deleteSaleInvoice(id: string) {
    try {
        await sql`DELETE FROM sale_invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/sale-invoices');
        return { message: 'Deleted Sale Invoice.' };
    }
    catch (error) {
        return {
            message: 'Database error: Failed to Delete Sale Invoice'  + error,
        };
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }