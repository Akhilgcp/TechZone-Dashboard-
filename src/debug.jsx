import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root'))
root.render(
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#111',
        color: '#0f0',
        fontSize: '2rem',
        fontFamily: 'monospace'
    }}>
        DEBUG MODE: ENVIRONMENT IS WORKING
    </div>
)
