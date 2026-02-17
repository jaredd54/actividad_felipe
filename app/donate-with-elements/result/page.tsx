import type { Stripe } from "stripe";
import PrintObject from "@/app/components/PrintObject";
import { stripe } from "@/lib/stripe";
import { JSX } from "react";

// 1. Evita que el build de Vercel falle al intentar generar la página sin datos
export const dynamic = "force-dynamic";

// Definimos el tipo de Props para Next.js 15
type Props = {
  searchParams: Promise<{ payment_intent?: string }>;
};

export default async function ResultPage({
  searchParams,
}: Props): Promise<JSX.Element> {
  // 2. Debemos usar await para acceder a los parámetros en versiones recientes
  const { payment_intent } = await searchParams;

  // 3. Verificamos si existe el ID sin romper la aplicación (evitamos el throw)
  if (!payment_intent) {
    return (
      <div className="p-6 border border-yellow-400 bg-yellow-50 rounded-md">
        <h2 className="text-yellow-700 font-bold">Atención</h2>
        <p>No se encontró el identificador de pago (payment_intent).</p>
      </div>
    );
  }

  // 4. Recuperamos el Payment Intent desde la API de Stripe
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.retrieve(payment_intent);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        Status: <span className="capitalize text-green-600">{paymentIntent.status}</span>
      </h2>
      <h3 className="text-lg font-semibold text-gray-600 mb-2">Payment Intent response:</h3>
      <div className="overflow-hidden rounded-lg border shadow-sm">
        <PrintObject content={paymentIntent} />
      </div>
    </div>
  );
}
