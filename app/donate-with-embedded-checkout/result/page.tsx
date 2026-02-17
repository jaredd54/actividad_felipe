import type { Stripe } from "stripe";
import PrintObject from "@/app/components/PrintObject";
import { stripe } from "@/lib/stripe";
import { JSX } from "react";

// 1. Obligatorio para que Vercel no intente generar la página sin datos (Static Generation)
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function ResultPage({
  searchParams,
}: Props): Promise<JSX.Element> {
  // 2. Esperamos los parámetros de la URL
  const { session_id } = await searchParams;

  // 3. Validación amigable para no romper el despliegue
  if (!session_id) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Falta el ID de sesión</h2>
        <p>No se pudo recuperar la información del pago.</p>
      </div>
    );
  }

  // 4. Recuperamos la sesión expandiendo los datos necesarios
  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

  // 5. Cast de seguridad para el PaymentIntent
  const paymentIntent = checkoutSession.payment_intent as Stripe.PaymentIntent;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">
        Status: <span className="text-blue-500">{paymentIntent?.status ?? "Procesando..."}</span>
      </h2>
      <h3 className="text-lg font-semibold mb-2">Checkout Session response:</h3>
      <div className="bg-slate-50 p-4 rounded-md border">
        <PrintObject content={checkoutSession} />
      </div>
    </div>
  );
}
