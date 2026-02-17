import type { Stripe } from "stripe";
import PrintObject from "@/app/components/PrintObject";
import { stripe } from "@/lib/stripe";
import { JSX } from "react";

// 1. Forzamos que la página sea dinámica para evitar el error de prerenderizado en Vercel
export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function ResultPage({
  searchParams,
}: Props): Promise<JSX.Element> {
  // 2. En versiones nuevas de Next.js, debemos esperar (await) los searchParams
  const { session_id } = await searchParams;

  // 3. Manejo de error amigable (sin 'throw') para que el build no truene
  if (!session_id) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-red-500 font-bold text-xl">Error</h2>
        <p>No se proporcionó un ID de sesión de Stripe válido.</p>
      </div>
    );
  }

  // 4. Obtención de datos de Stripe
  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

  const paymentIntent = checkoutSession.payment_intent as Stripe.PaymentIntent;

  return (
    <main className="p-8">
      <h2 className="text-2xl font-semibold mb-4">
        Status: <span className="text-blue-600">{paymentIntent?.status ?? "desconocido"}</span>
      </h2>
      <h3 className="text-lg font-medium mb-2 text-gray-700">Checkout Session response:</h3>
      <div className="bg-gray-100 p-4 rounded-lg border">
        <PrintObject content={checkoutSession} />
      </div>
    </main>
  );
}
