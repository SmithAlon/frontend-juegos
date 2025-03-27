import TextProcessor from './components/TextProcessor'

function App() {
  return (
    <div className="min-h-screen flex flex-col">        <TextProcessor />
      <footer className="text-center text-gray-400 p-2 mt-auto">  
        <div className='flex flex-col items-center mb-2'>
          <a href="https://github.com/SmithAlon/RapidRead" target="_blank" rel="noopener noreferrer" className='text-lg text-center text-white hover:underline underline-offset-1'>
            Proyecto de código abierto
          </a>
        </div>
        Hecho por <a href="https://portfolio-pied-beta-21.vercel.app/" target="_blank" rel="noopener noreferrer" className='underline underline-offset-1'>Alonso Smith</a>
      </footer>
    </div>
  )
}

export default App