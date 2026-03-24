import { createHash } from "crypto";

/**
 * LiqPay payment helper
 * https://www.liqpay.ua/documentation/api/aquiring/pay/doc
 */

const LIQPAY_PUBLIC_KEY = process.env.LIQPAY_PUBLIC_KEY || "";
const LIQPAY_PRIVATE_KEY = process.env.LIQPAY_PRIVATE_KEY || "";

export function isLiqPayConfigured(): boolean {
  return !!(LIQPAY_PUBLIC_KEY && LIQPAY_PRIVATE_KEY);
}

export interface LiqPayParams {
  action: string;
  amount: number;
  currency: string;
  description: string;
  order_id: string;
  version: number;
  public_key: string;
  subscribe_date_start?: string;
  subscribe_periodicity?: string;
  result_url?: string;
  server_url?: string;
  [key: string]: string | number | undefined;
}

/**
 * Encode params to base64 data string for LiqPay form
 */
export function encodeData(params: LiqPayParams): string {
  const jsonString = JSON.stringify(params);
  return Buffer.from(jsonString).toString("base64");
}

/**
 * Create LiqPay signature: base64(sha1(private_key + data + private_key))
 */
export function createSignature(data: string): string {
  const signString = LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY;
  return createHash("sha1").update(signString).digest("base64");
}

/**
 * Verify LiqPay callback signature
 */
export function verifySignature(data: string, signature: string): boolean {
  const expectedSignature = createSignature(data);
  return expectedSignature === signature;
}

/**
 * Decode base64 data string from LiqPay callback
 */
export function decodeData(data: string): Record<string, unknown> {
  const jsonString = Buffer.from(data, "base64").toString("utf-8");
  return JSON.parse(jsonString);
}

/**
 * Create payment form data for LiqPay subscription
 */
export function createPaymentData(opts: {
  planId: string;
  amount: number;
  orderId: string;
  description: string;
  resultUrl: string;
  serverUrl: string;
}): { data: string; signature: string } {
  const now = new Date();
  const dateStart = now.toISOString().split("T")[0] + " 00:00:00"; // YYYY-MM-DD HH:mm:ss

  const params: LiqPayParams = {
    public_key: LIQPAY_PUBLIC_KEY,
    version: 3,
    action: "subscribe",
    amount: opts.amount,
    currency: "UAH",
    description: opts.description,
    order_id: opts.orderId,
    subscribe_date_start: dateStart,
    subscribe_periodicity: "month",
    result_url: opts.resultUrl,
    server_url: opts.serverUrl,
  };

  const data = encodeData(params);
  const signature = createSignature(data);

  return { data, signature };
}
