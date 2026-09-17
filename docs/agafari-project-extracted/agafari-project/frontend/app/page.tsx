export default function HomePage() {
  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Agafari (አጋፋሪ)</h1>
      <p>
        This is the platform shell. Guests arrive via a signed link at{" "}
        <code>/e/[eventSlug]/[guestToken]</code>. Staff and admin screens live
        under <code>/scanner</code> and <code>/admin</code>.
      </p>
    </main>
  );
}
