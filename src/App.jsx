import AppRoutes from './routes/AppRoutes'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <AppRoutes />
      </main>
    </div>
  )
}

export default App
