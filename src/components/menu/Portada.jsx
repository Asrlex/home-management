export const Portada = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img
        src="/logo.png"
        alt="Logo"
        className="w-32 h-32 mb-4 animate-bounce"
      />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido a Casa</h1>
      <p className="text-gray-600">Tu asistente de hogar</p>
    </div>
  );
}