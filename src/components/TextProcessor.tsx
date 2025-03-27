import { useState } from 'react';
import axios from 'axios';
import rapidRead from '../assets/RapidRead-logo-removebg-preview.png';
import {motion , AnimatePresence} from 'framer-motion';

interface ProcessedText {
  text: string;
}

export default function TextProcessor() {
  const [inputText, setInputText] = useState('');
  const [processedText, setProcessedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processText = async () => {
    if (!inputText.trim()) {
      setError('Por favor, introduce algún texto para procesar.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<ProcessedText>('http://localhost:5000/process', {
        text: inputText
      });

      setProcessedText(response.data.text);
    } catch (err) {
      setError('Error al procesar el texto. Por favor, intenta de nuevo.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const limpiarTexto = async () => {
    if (processedText){
      setProcessedText('')
    }
  }

  return (
    <div className="flex flex-col container mx-auto px-4 py-14 max-w-4xl">
      <motion.div className="flex justify-center mb-2"
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", duration: 1.2 }}
      >
        <img src={rapidRead} alt="logo RapidRead" className="w-64 h-auto" />
      </motion.div>
      
      <div className="space-y-4 flex-grow">
        <motion.p
          className='text-white text-center text-xl'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          La <span className='font-bold'>he</span>rramienta de <span className='font-bold'>es</span>critura <span className='font-bold'>he</span>cha <span className='font-bold'>pa</span>ra <span className='font-bold'>me</span>jorar tu <span className='font-bold'>le</span>ctura.
        </motion.p>
      <div>
        <textarea
        id="input"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full h-32 p-4 border mt-12 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        placeholder="Introduce el texto aquí..."
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={processText}
          disabled={isLoading}
          className="w-fit bg-primary-600 text-white py-2 px-4 mb-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Procesando...' : 'Procesar Texto'}
        </button>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>
      )}

      {processedText && (
        <div className="relative">
          <button 
            className="absolute -top-3 -right-3 bg-gray-400 hover:bg-gray-500 text-gray-700 hover:text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors shadow-md z-10"
            onClick={limpiarTexto}
            aria-label="Limpiar texto"
          >
            x
          </button>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div dangerouslySetInnerHTML={{ __html: processedText }} />
          </div>
        </div>
      )}
      </div>
    </div>
  );
} 