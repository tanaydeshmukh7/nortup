import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Admin ErrorBoundary caught error]:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 sm:p-12 my-6 rounded-2xl bg-[#151515] border border-red-500/30 text-center font-mono max-w-2xl mx-auto shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold uppercase tracking-wider text-[#F5F1EB] mb-2">
            {this.props.title || 'Error Rendering Section'}
          </h2>
          <p className="text-xs text-[#A6A09A] mb-4 leading-relaxed">
            {this.state.error?.message || 'An unexpected rendering error occurred in this view.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-5 py-2.5 rounded-xl bg-[#FF8A3D] hover:bg-[#E96D24] text-black font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Section</span>
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
