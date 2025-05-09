import Selector from '../components/Selector';
import CerrarSesion from '@/components/CerrarSesion.tsx';
import Titulo from '@/components/Titulo.tsx';

export default function Inicio() {
  return (
    <section className="flex flex-row justify-center">
      <div className="flex flex-col gap-4 items-center justify-center h-screen">
        <Titulo />
        <Selector />
        <CerrarSesion />
      </div>
    </section>
  );
}