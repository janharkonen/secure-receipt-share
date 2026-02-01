import { Link, useNavigate } from '@tanstack/react-router'
import { FileText, Home, LogOut, Settings, User } from 'lucide-react'
import { authClient } from '../lib/auth-client'

export default function Aside() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await authClient.signOut()
    navigate({ to: '/' })
  }

  return (
    <aside className="w-64 min-h-[calc(100vh-64px)] bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <nav className="p-4 space-y-2">
        <Link
          to="/logged"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-accent transition-colors"
          activeProps={{
            className:
              'flex items-center gap-3 p-3 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 transition-colors',
          }}
        >
          <Home size={20} />
          <span className="font-medium">Home</span>
        </Link>

        <Link
          to="/logged"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          <User size={20} />
          <span className="font-medium">Profile</span>
        </Link>

        <Link
          to="/logged"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          <FileText size={20} />
          <span className="font-medium">Documents</span>
        </Link>

        <Link
          to="/logged"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </Link>

        <div className="pt-4 border-t border-sidebar-border mt-4">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-accent transition-colors w-full text-left"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </nav>
    </aside>
  )
}
