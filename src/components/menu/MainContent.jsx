import { toast, Toaster, ToastBar } from 'react-hot-toast'
import { FaTimes } from 'react-icons/fa'

export default function MainContent({ titulo, children }) {
  return (
    <div className="seccionPrincipal">
      <h1 className="tituloSeccion">
        {titulo}
      </h1>
      <div>
        <Toaster
          position='top-right'
          reverseOrder={false}
          toastOptions={{
            duration: 2000,
            style: {
              background: '#065f46',
              color: '#fff',
              border: '2px solid #000',
              fontsize: '2px',
            },
          }}
        >
          {t => (
            <ToastBar toast={t}>
              {({ icon, message }) => (
                <>
                  {icon}
                  {message}
                  {t.type !== 'loading' && (
                    <button onClick={() => toast.dismiss(t.id)}>
                      <FaTimes />
                    </button>
                  )}
                </>
              )}
            </ToastBar>
          )}
        </Toaster>
      </div>

      <div className="contenidoPrincipal">
        {children}
      </div>
    </div>
  )
}