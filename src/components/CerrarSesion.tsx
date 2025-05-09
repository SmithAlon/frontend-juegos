import { useAuth } from '@/lib/auth/AuthContext';

const CerrarSesion = () => {    
    const { logout } = useAuth();

    return (
        <div className="flex flex-col gap-4 items-center justify-center mt-6">
            <button
            onClick={logout}
            className="border bg-[#F8F9FA] p-1 text-[#181616] text-sm"
            >
            Cerrar Sesión
            </button>
        </div>
    );
}

export default CerrarSesion;