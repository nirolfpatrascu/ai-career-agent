export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-text-secondary">Loading...</p>
      </div>
    </main>
  );
}
