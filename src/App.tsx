import { useState } from 'react'
import type { Role } from './types'
import SummaryCards from './components/SummaryCards';
import Navbar from './components/Navbar';
import AddTransaction from './components/AddTransaction';
import TransactionBlock from './components/TransactionBlock';
import { Toaster } from 'react-hot-toast';

function App() {

  const [role, setRole] = useState<Role>("viewer")

  return (
    <div className='min-h-screen bg-(--bg-main) text-(--text-primary)'>
      <Toaster />
      <Navbar role={role} setRole={setRole} />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <SummaryCards />
        {role == "admin" && <AddTransaction />}
        <TransactionBlock role={role} />
      </div>
    </div>
  )
}

export default App
