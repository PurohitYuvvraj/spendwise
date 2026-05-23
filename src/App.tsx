import { useState } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Subscriptions from './pages/Subscriptions'

export default function App() {
  const [activePage, setActivePage] = useState<string>('Dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />
      case 'Transactions':
        return <Transactions />
      case 'Budgets':
        return <Budgets />
      case 'Subscriptions':
        return <Subscriptions />
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {renderPage()}
    </Layout>
  )
}