import { apiPost } from "@/lib/api/client";

type ConfirmResponse = { guest_id: string; status: string; qr_signature?: string };

export default async function GuestTicketPage({
  params,
}: {
  // Next.js 15+ App Router: dynamic route params are a Promise and must be awaited.
  params: Promise<{ eventSlug: string; guestToken: string }>;
}) {
  const { eventSlug, guestToken } = await params;

  // In a real build, GET the guest's current status first and only POST
  // confirm when they tap "I'm coming" — this fetches eagerly for the demo.
  let data: ConfirmResponse | null = null;
  let error: string | null = null;

  try {
    data = await apiPost<ConfirmResponse>(`/api/guests/${guestToken}/confirm`);
  } catch (e) {
    error = e instanceof Error ? e.message : "Something went wrong";
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>You&apos;re invited</h1>
      <p>Event: {eventSlug}</p>
      {data && (
        <>
          <p>Status: {data.status}</p>
          {data.qr_signature && (
            <p>
              Your ticket signature: <code>{data.qr_signature}</code>
              <br />
              (render this as an actual QR code with a library like{" "}
              <code>qrcode.react</code> in the real build)
            </p>
          )}
        </>
      )}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </main>
  );
}
