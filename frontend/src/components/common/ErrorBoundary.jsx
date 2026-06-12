import { Component } from 'react'

const wrapStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  fontFamily: 'Inter, sans-serif',
  background: '#F8FAFC',
  textAlign: 'center',
}

const btnStyle = {
  background: '#2563EB',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  padding: '0.75rem 1.5rem',
  fontWeight: 700,
  fontSize: '0.875rem',
  cursor: 'pointer',
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(err, info) {
    console.error('MediAI render error:', err, info)
  }

  render() {
    if (this.state.error) {
      const msg = this.state.error && this.state.error.message
      return (
        <div style={wrapStyle}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            {msg || 'An unexpected error occurred.'}
          </p>
          <button
            style={btnStyle}
            onClick={() => { this.setState({ error: null }); window.location.href = '/' }}
          >
            Reload App
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
