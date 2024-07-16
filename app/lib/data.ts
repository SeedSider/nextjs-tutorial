import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
  Store,
  ProductsTable,
  ProductForm,
  SaleInvoicesTable,
  SaleInvoice,
  InvoiceProduct,
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoice_products.total_price, products.name, products.image_url, products.description, sale_invoices.id
      FROM invoice_products
      JOIN sale_invoices ON sale_invoices.id = invoice_products.invoice_id
      JOIN products ON invoice_products.product_id = products.id
      ORDER BY sale_invoices.invoice_date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.total_price),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM sale_invoices JOIN invoice_products ON sale_invoices.id = invoice_products.invoice_id`;
    const customerCountPromise = sql`SELECT SUM(invoice_products.quantity) FROM invoice_products`;
    const invoiceTotalPromise = sql`SELECT SUM(invoice_products.total_price) from sale_invoices JOIN invoice_products ON sale_invoices.id = invoice_products.invoice_id`;
    const todayInvoicesPromise = sql`SELECT SUM(invoice_products.total_price) from sale_invoices JOIN invoice_products ON sale_invoices.id = invoice_products.invoice_id
      WHERE date(sale_invoices.invoice_date) = CURRENT_DATE`;
    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceTotalPromise,
      todayInvoicesPromise
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].sum ?? '0');
    const totalInvoices = formatCurrency(data[2].rows[0].sum ?? '0');
    const totalTodayInvoices = formatCurrency(data[3].rows[0].sum ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalInvoices,
      totalTodayInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchFilteredProducts(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const products = await sql<ProductsTable>`
      SELECT
        products.id,
        products.image_url,
        products.name,
        products.description,
        products.price,
        products.quantity
      FROM products
      WHERE
        products.name ILIKE ${`%${query}%`} OR
        products.description ILIKE ${`%${query}%`}
      ORDER BY products.name
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return products.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function fetchProductsPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM products
    WHERE
      products.name ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of products.');
  }
}

export async function fetchFilteredSaleInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const sale_invoices = await sql<SaleInvoicesTable>`
      SELECT
        sale_invoices.id,
        sale_invoices.invoice_date,
        SUM(invoice_products.quantity) AS quantity,
        sale_invoices.total_amount
      FROM sale_invoices
      JOIN invoice_products ON sale_invoices.id = invoice_products.invoice_id
      WHERE
        sale_invoices.invoice_date::text ILIKE ${`%${query}%`}
      GROUP BY sale_invoices.id
      ORDER BY sale_invoices.invoice_date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return sale_invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch sale_invoices.');
  }
}

export async function fetchSaleInvoicesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM sale_invoices
    JOIN invoice_products ON sale_invoices.id = invoice_products.invoice_id
    WHERE
      sale_invoices.invoice_date::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of sale invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchStoreByUserId(id: string) {
  noStore();
  try {
    const data = await sql`
      SELECT
        stores.id,
        stores.user_id,
        stores.name,
        stores.address,
        stores.contact
      FROM stores
      WHERE stores.user_id = ${id};
    `;

    const store = data.rows;

    return store[0] as Store;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch store.');
  }
}

export async function fetchProductById(id: string) {
  noStore();
  try {
    const data = await sql<ProductForm>`
      SELECT
        products.id,
        products.image_url,
        products.registration_code,
        products.name,
        products.description,
        products.price,
        products.quantity
      FROM products
      WHERE products.id = ${id};
    `;

    const product = data.rows.map((product) => ({
      ...product,
    }));

    return product[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product.');
  }
}

export async function fetchSaleInvoiceById(id: string) {
  noStore();
  try {
    const data = await sql<SaleInvoice>`
      SELECT
        sale_invoices.id,
        sale_invoices.invoice_date,
        sale_invoices.total_amount
      FROM sale_invoices
      WHERE sale_invoices.id = ${id};
    `;

    const saleInvoice = data.rows.map((saleInvoice) => ({
      ...saleInvoice,
    }));

    return saleInvoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch sale invoice.');
  }
}

export async function fetchInvoiceProductsByInvoiceId(id: string) {
  noStore();
  try {
    const invoiceProducts = await sql<InvoiceProduct>`
      SELECT
        invoice_products.id,
        products.name AS product_name,
        invoice_products.quantity,
        invoice_products.unit_price,
        invoice_products.total_price
      FROM invoice_products
      JOIN products ON invoice_products.product_id = products.id
      WHERE invoice_products.invoice_id = ${id};
    `;

    return invoiceProducts.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice products.');
  }
}

export async function fetchCustomers() {
  noStore();
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {
  noStore();
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
