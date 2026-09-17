export default function Home() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: '3rem', maxWidth: 640 }}>
      <h1>AGAFARI</h1>
      <p>
        This deployment currently exposes the API only — see <code>/README.md</code> for
        the full route list, database setup, and what still needs building
        (the couple/organizer/admin/scanner/moderator UI pages).
      </p>
    </main>
  );
}
