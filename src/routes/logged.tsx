import { createFileRoute } from '@tanstack/react-router'
import Header from '../components/Header'
import Aside from '../components/Aside'

export const Route = createFileRoute('/logged')({
  component: LoggedPage,
})

function LoggedPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <div className="flex">
        <Aside />
        <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)]">
          <h1 className="text-4xl font-bold text-foreground">Hello World</h1>
        </main>
      </div>
    </div>
  )
}
