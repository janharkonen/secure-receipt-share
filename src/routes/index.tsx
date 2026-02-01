import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="min-h-screen w-full h-full bg-background flex items-center justify-center">
      <h1 className="text-4xl font-bold text-foreground">Hello World</h1>
    </div>
  )
}
