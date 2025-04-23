import { useState } from 'react';
import axios from 'axios';
import quickReading from '../assets/QuickReading-bg-removebg-preview.png';
import { motion } from 'framer-motion';
import { QuickReadingApi } from '../client';

export default function TextProcessor() {
  const [inputText, setInputText] = useState('');
  const [processedText, setProcessedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setIsFocused] = useState(false);

  // Función para limpiar el texto
  const handleClear = () => {
    setInputText('');
  };

  const processText = async () => {
    if (!inputText.trim()) {
      setError('Por favor, introduce algún texto para procesar.');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      // Log the API endpoint for debugging
      console.log('Requesting API:', `${QuickReadingApi}/process`);
      
      const response = await axios.post<{ text: string }>(
        `${QuickReadingApi}/process`, 
        { text: inputText }
      );
  
      setProcessedText(response.data.text);
    } catch (err) {
      console.error('Error:', err);
      
      // More detailed error message based on error type
      if ((err as any).isAxiosError) {
        console.log('Error de Axios:', err);
      } else {
        setError('Error al procesar el texto. Por favor, intenta de nuevo.');
      }
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
      <div>
      <div className='mb-12'>
        <motion.div className="flex justify-center mb-2"
          initial={{ x: -200 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", duration: 1.2 }}
        >
          <img src={quickReading} alt="logo RapidRead" className="w-80 h-auto" />
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
        </div>
      </div>
      <div>
        <div>
          <div className="relative">
            <textarea
              id="input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-32 p-4 border bg-gray-700 text-white border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Introduce el texto aquí."
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 100)}
            />
            {inputText && (
              <button
              className="absolute -top-3 -right-3 bg-gray-400 hover:bg-gray-500 text-gray-700 hover:text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors shadow-md z-10"
              onClick={handleClear}
                aria-label="Limpiar texto"
              >
                x
              </button>
            )}
          </div>
        </div>    
      </div>

      <div className="flex justify-center">
        <button
          onClick={processText}
          disabled={isLoading}
          className="w-fit bg-white bg-opacity-10 border border-white text-white py-1 px-2 mt-2 mb-4 rounded-md hover:bg-[#8eb984] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          <div className="p-4 bg-gray-700 text-white rounded-lg border border-gray-200">
            <div dangerouslySetInnerHTML={{ __html: processedText }} />
          </div>
        </div>
      )}
      </div>
    </div>
  );
} 