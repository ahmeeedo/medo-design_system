/** Sample data for the Account pattern: orders and invoices of one customer. */
import type { BadgeTone } from '@med-o/ui';

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type Order = {
  id: string;
  date: string;
  items: number;
  product: string;
  status: OrderStatus;
  total: number;
};

export type InvoiceStatus = 'Paid' | 'Open' | 'Overdue';
export type Invoice = {
  id: string;
  order: string;
  date: string;
  due: string;
  status: InvoiceStatus;
  amount: number;
};

export const ORDER_TONE: Record<OrderStatus, BadgeTone> = {
  Processing: 'info',
  Shipped: 'brand',
  Delivered: 'success',
  Cancelled: 'neutral',
};
export const INVOICE_TONE: Record<InvoiceStatus, BadgeTone> = {
  Paid: 'success',
  Open: 'info',
  Overdue: 'danger',
};

const products = ['Standing desk', 'Monitor arm', 'Desk lamp', 'Office chair', 'Cable tray', 'Keyboard', 'Headset', 'Webcam'];
const orderStatus: OrderStatus[] = ['Delivered', 'Delivered', 'Shipped', 'Delivered', 'Cancelled', 'Delivered', 'Processing'];
const dayMs = 86400000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
/** A fixed “today”, so the data and the screenshots never change. */
const today = Date.UTC(2026, 9, 15);

export const orders: Order[] = Array.from({ length: 28 }, (_, i) => ({
  id: `ORD-${String(4820 - i * 7)}`,
  date: iso(today - i * 6.5 * dayMs),
  items: 1 + ((i * 3) % 4),
  product: products[i % products.length],
  status: i === 0 ? 'Processing' : i === 1 ? 'Shipped' : orderStatus[(i * 5) % orderStatus.length],
  total: 49 + ((i * 397) % 1400) + (i % 3) * 0.9,
}));

export const invoices: Invoice[] = orders
  .filter((o) => o.status !== 'Cancelled')
  .map((o, i) => ({
    id: `INV-${o.date.slice(0, 4)}-${String(980 - i).padStart(4, '0')}`,
    order: o.id,
    date: o.date,
    due: iso(Date.parse(o.date) + 14 * dayMs),
    status: i < 1 ? 'Open' : i === 2 || i === 4 ? 'Overdue' : i === 3 ? 'Open' : 'Paid',
    amount: o.total,
  }));

export const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
});
export const day = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});
