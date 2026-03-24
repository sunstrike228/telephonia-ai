export async function GET() {
  const stripeAvailable = !!(
    process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY
  );
  const liqpayAvailable = !!(
    process.env.LIQPAY_PUBLIC_KEY && process.env.LIQPAY_PRIVATE_KEY
  );

  return Response.json({ stripe: stripeAvailable, liqpay: liqpayAvailable });
}
