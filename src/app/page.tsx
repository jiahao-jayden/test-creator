import { SignIn } from "@/components/sign-in"

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">We0</h1>
          </div>
          <SignIn />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Welcome to We0</h2>
          <p className="text-muted-foreground">Your creative platform</p>
        </div>
      </main>
    </div>
  )
}
