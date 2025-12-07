import AppRoutes from './routes/AppRoutes'
import Navbar from './components/Navbar'
import InstallPWA from './components/InstallPWA'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <InstallPWA />
    </div>
  )
}

export default App
