export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-card p-4 hidden md:block">
        <nav className="space-y-2">
          <div className="font-bold text-lg mb-4">Presupuesto Claro</div>
          <a href="/" className="block p-2 rounded hover:bg-accent">Dashboard</a>
          <a href="/transactions" className="block p-2 rounded hover:bg-accent">Transacciones</a>
          <a href="/simulations" className="block p-2 rounded hover:bg-accent">Simulaciones</a>
          <a href="/history" className="block p-2 rounded hover:bg-accent">Historial</a>
          <a href="/settings" className="block p-2 rounded hover:bg-accent">Configuración</a>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
