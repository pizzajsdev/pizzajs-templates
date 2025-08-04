import { appConfig } from '@/config'
import seo from '@/lib/utils/seo'
import { Link } from 'react-router'
import type { Route } from './+types/index'

export function meta({}: Route.MetaArgs) {
  return [seo.title('Dashboard'), seo.description(`Welcome to ${appConfig.name}`)]
}

export default function Page() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <h1 className="text-4xl font-bold">PizzaJS Enterprise Template</h1>
          <img
            src="/images/enterprise.webp"
            alt="enterprise"
            className="w-full h-[300px] object-cover rounded-md border border-gray-800"
          />
          <Link
            to="/dashboard"
            className="text-blue-500 hover:border-blue-700 font-medium p-2 rounded-md border border-blue-500"
          >
            Get Started
          </Link>
        </header>
      </div>
    </main>
  )
}
