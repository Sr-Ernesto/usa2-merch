"use client";

// Footer mínimo — conversion-beast standard (sin distracciones)

export function Footer() {
  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Tu Marca. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition-colors">Términos</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacidad</a>
          <a href="#" className="hover:text-foreground transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
