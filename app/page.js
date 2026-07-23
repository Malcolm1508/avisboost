export default function Home() {
  return (
    <main className="wrap">
      <h1>AvisBoost</h1>
      <p className="sub">Le back-office de tes cartes NFC.</p>
      <div className="card">
        <p>Deux espaces :</p>
        <p><b>/admin</b> — pour créer un nouveau client en 20 secondes.</p>
        <p><b>/&lt;id-du-client&gt;</b> — le tableau de bord que tu donnes au commerçant.</p>
        <p style={{ marginTop: 16 }}><a href="/admin">→ Aller à l'espace admin</a></p>
      </div>
    </main>
  );
}
