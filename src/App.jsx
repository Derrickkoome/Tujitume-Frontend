import PostGigPage from './components/PostGigPage'
import FirebaseAuth from './components/FirebaseAuth'

function App() {
  return (
    <div className="p-6">
      <FirebaseAuth />
      <div className="mt-6">
        <PostGigPage />
      </div>
    </div>
  )
}

export default App
