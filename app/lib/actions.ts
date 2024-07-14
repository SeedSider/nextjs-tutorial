'use server';

import { z } from "zod";
import { sql } from '@vercel/postgres';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import fs from "node:fs/promises";

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
    
    const { registration_code, name, quantity, price } = validatedFields.data;
    const filename = `/products/${file.name}`

    try {
        await fs.writeFile(`./public/products/${file.name}`, buffer);
        await sql`
        INSERT INTO products (store_id, image_url, registration_code, name, quantity, price)
        VALUES (${storeId}, ${filename}, ${registration_code}, ${name}, ${quantity}, ${price})
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

export async function updateProduct(id: string, prevState: State, formData: FormData) {
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