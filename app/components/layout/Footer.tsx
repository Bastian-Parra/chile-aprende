export default function Footer() {
  return (
    <footer className="w-full h-16 flex items-center bg-headerbg border-t border-t-gray-200">
      <div className="w-6xl m-auto flex justify-between">
        <p className="text-xl font-bold">Chile<span className="text-primarygreen">Aprende</span></p>
        <ul className="flex gap-5">
          <li>Nosotros</li>
          <li>Contacto</li>
          <li>Privacidad</li>
          <li>Términos y Condiciones</li>
        </ul>
        <p>© 2025 ChileAprende. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
