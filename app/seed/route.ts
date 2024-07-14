// import { db } from '@vercel/postgres';
// import { stores, products, invoice_products, sale_invoices } from '../lib/placeholder-data';

// const client = await db.connect();

// async function seedStores() {

//     await client.sql`
//         CREATE TABLE IF NOT EXISTS stores (
//         id SERIAL PRIMARY KEY,
//         user_id UUID NOT NULL REFERENCES users(id),
//         name VARCHAR(100) NOT NULL,
//         address TEXT,
//         contact VARCHAR(50)
//         );
//     `;

//     const insertedStores = await Promise.all(
//         stores.map(
//             (store) => client.sql`
//             INSERT INTO stores (id, user_id, name, address, contact)
//             VALUES (${store.id}, ${store.user_id}, ${store.name}, ${store.address}, ${store.contact})
//             ON CONFLICT (id) DO NOTHING;
//             `,
//         ),
//     );

//     return insertedStores;
// }

// async function seedProducts() {

//     await client.sql`
//         CREATE TABLE IF NOT EXISTS products (
//         id SERIAL PRIMARY KEY,
//         store_id INT NOT NULL REFERENCES stores(id),
//         registration_code VARCHAR(500),
//         name VARCHAR(100) NOT NULL,
//         price DECIMAL(10, 2) NOT NULL,
//         quantity INT NOT NULL
//         );
//     `;

//     const insertedProducts = await Promise.all(
//         products.map(
//             (product) => client.sql`
//             INSERT INTO products (id, store_id, registration_code, name, price, quantity)
//             VALUES (${product.id}, ${product.store_id}, ${product.registration_code}, ${product.name}, ${product.price}, ${product.quantity})
//             ON CONFLICT (id) DO NOTHING;
//             `,
//         ),
//     );

//     return insertedProducts;
// }

// async function seedSaleInvoices() {

//   await client.sql`
//     CREATE TABLE IF NOT EXISTS sale_invoices (
//       id SERIAL PRIMARY KEY,
//       store_id INT NOT NULL REFERENCES stores(id),
//       user_id UUID NOT NULL REFERENCES users(id),
//       invoice_date DATE NOT NULL,
//       total_amount DECIMAL(12, 2) NOT NULL
//     );
//   `;

//   const insertedSaleInvoices = await Promise.all(
//     sale_invoices.map(
//       (sale_invoice) => client.sql`
//         INSERT INTO sale_invoices (id, store_id, user_id, invoice_date, total_amount)
//         VALUES (${sale_invoice.id}, ${sale_invoice.store_id}, ${sale_invoice.user_id}, ${sale_invoice.invoice_date}, ${sale_invoice.total_amount})
//         ON CONFLICT (id) DO NOTHING;
//       `,
//     ),
//   );

//   return insertedSaleInvoices;
// }

// async function seedInvoiceProducts() {

//     await client.sql`
//       CREATE TABLE IF NOT EXISTS invoice_products (
//         id SERIAL PRIMARY KEY,
//         invoice_id INT NOT NULL REFERENCES sale_invoices(id),
//         product_id INT NOT NULL REFERENCES products(id),
//         quantity INT NOT NULL,
//         unit_price DECIMAL(10, 2) NOT NULL,
//         total_price DECIMAL(12, 2) NOT NULL
//       );
//     `;
  
//     const insertedInvoiceProducts = await Promise.all(
//       invoice_products.map(
//         (invoice_product) => client.sql`
//           INSERT INTO invoice_products (invoice_id, product_id, quantity, unit_price, total_price)
//           VALUES (${invoice_product.invoice_id}, ${invoice_product.product_id}, ${invoice_product.quantity}, ${invoice_product.unit_price}, ${invoice_product.total_price})
//           ON CONFLICT (id) DO NOTHING;
//         `,
//       ),
//     );
  
//     return insertedInvoiceProducts;
//   }

export async function GET() {
    return Response.json({
        message:
          'Uncomment this file and remove this line. You can delete this file when you are finished.',
      });
    // try {
    //   await client.sql`BEGIN`;
    //   await seedStores();
    //   await seedProducts();
    //   await seedSaleInvoices();
    //   await seedInvoiceProducts();
    //   await client.sql`COMMIT`;
  
    //   return Response.json({ message: 'Database seeded successfully' });
    // } catch (error) {
    //   await client.sql`ROLLBACK`;
    //   return Response.json({ error }, { status: 500 });
    // }
  }