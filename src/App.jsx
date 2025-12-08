import AppRoutes from './routes/AppRoutes'
import Navbar from './components/Navbar'
import InstallPWA from './components/InstallPWA'

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <InstallPWA />
    </div>
  )
}

export default App
