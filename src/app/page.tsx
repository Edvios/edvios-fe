export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-center">
          Welcome to Edvios
        </h1>
        
        <p className="text-lg text-muted-foreground text-center">
          Your Next.js application is ready!
        </p>
        
        <div className="flex gap-4">
          <div className="p-6 rounded-lg bg-card border border-border">
            <h2 className="text-xl font-semibold mb-2">Clean Interface</h2>
            <p className="text-muted-foreground">Modern and professional design</p>
          </div>
          
          <div className="p-6 rounded-lg bg-card border border-border">
            <h2 className="text-xl font-semibold mb-2">Ready to Build</h2>
            <p className="text-muted-foreground">Start creating your features</p>
          </div>
        </div>
      </main>
    </div>
  );
}

