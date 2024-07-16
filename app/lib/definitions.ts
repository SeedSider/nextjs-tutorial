// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Store = {
  id: string;
  user_id: string;
  name: string;
  address: string;
  contact: string;
};

export type Product = {
  id: string;
  store_id: string;
  registration_code: string;
  image_url: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
};

export type SaleInvoice = {
  id: string;
  invoice_date: string;
  total_amount: number;
}

export type InvoiceProduct = {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

export type LatestSaleInvoice = {
  id: string;
  name: string;
  image_url: string;
  description: string;
  total_price: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestSaleInvoice, 'total_price'> & {
  total_price: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type ProductsTable = {
  id: string;
  image_url: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
};

export type SaleInvoicesTable = {
  id: string;
  invoice_date: string;
  quantity: number;
  total_amount: number;
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type StoreForm = {
  id: string;
  user_id: string;
  name: string;
  address: string;
  contact: string;
};

export type ProductForm = {
  id: string;
  image_url: string;
  registration_code: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
};

export type CartState = {
  id: number;
  product: ProductsTable;
  quantity: number;
}