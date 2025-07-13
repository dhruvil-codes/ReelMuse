'use client'

import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { AlertCircle, Sparkles, Play, Music, Video, X, ArrowLeft, Copy, Check } from 'lucide-react'
import { Alert, AlertDescription } from '../components/ui/alert'

interface ContentIdea {
  id: number
  hook: string
  summary: string
  fullScript: {
    hook: string
    body: string
    ending: string
  }
  musicSuggestions: string[]
  brollPrompts: string[]
}

export default function HomePage() {
  const [topic, setTopic] = useState('')
  const [ideas, setIdeas] = useState<ContentIdea[]>([])
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedScript, setCopiedScript] = useState(false)

  const [accessGranted, setAccessGranted] = useState(false)
  const [accessCode, setAccessCode] = useState('')

  const ACCESS_KEY = 'reelmuse123'

  const handleAccess = () => {
    if (accessCode === ACCESS_KEY) {
      setAccessGranted(true)
    } else {
      alert('Invalid code 😶')
    }
  }

  const generateContent = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const data = await response.json()
      setIdeas(data.ideas)
    } catch (err) {
      setError('Failed to generate content. Please try again.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const expandIdea = (idea: ContentIdea) => {
    setSelectedIdea(idea)
  }

  const closeModal = () => {
    setSelectedIdea(null)
  }

  const copyScript = async () => {
    if (!selectedIdea) return

    const fullScript = `${selectedIdea.fullScript.hook}\n\n${selectedIdea.fullScript.body}\n\n${selectedIdea.fullScript.ending}`
    try {
      await navigator.clipboard.writeText(fullScript)
      setCopiedScript(true)
      setTimeout(() => setCopiedScript(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // ⛔ Show invite screen first
  if (!accessGranted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white px-4">
        <div className="max-w-md w-full bg-[#1e1e1e] border border-[#2a2a2a] p-6 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-4">🔐 Invite Only</h2>
          <p className="mb-4 text-[#B0B0B0]">Enter your access code to use ReelMuse</p>
          <Input
            placeholder="Enter access code"
            className="mb-4 bg-[#2a2a2a] border-[#3a3a3a] text-white"
            type="password"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
          />
          <Button onClick={handleAccess} className="w-full bg-[#FF0050] hover:bg-[#e60048] text-white">
            Unlock
          </Button>
          <p className="mt-6 text-xs text-[#555]">
            Built with ❤️ by <a href="https://x.com/bydhruvil" target="_blank" className="underline hover:text-[#00F2EA]">@bydhruvil</a>
          </p>
        </div>
      </div>
    )
  }

  // ✅ Main UI
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF0050] to-[#00F2EA] bg-clip-text text-transparent">
          ReelMuse 🎬
        </h1>
        <p className="text-[#B0B0B0] text-lg max-w-2xl mx-auto px-4">
          Your AI-powered creative partner for viral short-form content
        </p>
      </div>

      {/* Input Section */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="mb-12">
          <div className="backdrop-blur-md bg-[#1E1E1E]/50 rounded-2xl p-8 border border-[#2A2A2A]">
            <label className="block text-lg font-medium mb-4">What's your content vibe today?</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., productivity tips, cooking hacks, fitness motivation..."
                className="flex-1 bg-[#2A2A2A] border-[#3A3A3A] text-white placeholder:text-[#B0B0B0] h-12 text-lg"
                onKeyPress={(e) => e.key === 'Enter' && generateContent()}
              />
              <Button
                onClick={generateContent}
                disabled={loading || !topic.trim()}
                className="bg-gradient-to-r from-[#FF0050] to-[#FF0050]/80 hover:from-[#FF0050]/90 hover:to-[#FF0050]/70 h-12 px-8 text-lg font-medium"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate Ideas
                  </div>
                )}
              </Button>
            </div>

            {/* Quick Topics */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['productivity tips', 'cooking hacks', 'fitness motivation', 'tech news', 'lifestyle'].map((quickTopic) => (
                <Badge
                  key={quickTopic}
                  variant="outline"
                  className="cursor-pointer border-[#3A3A3A] text-[#B0B0B0] hover:border-[#00F2EA] hover:text-[#00F2EA] transition-colors"
                  onClick={() => setTopic(quickTopic)}
                >
                  {quickTopic}
                </Badge>
              ))}
            </div>

            {/* Error Display */}
            {error && (
              <Alert className="mt-4 border-red-500/50 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-300">{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Ideas Grid */}
        {ideas.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea, index) => (
              <Card
                key={idea.id}
                className="backdrop-blur-md bg-[#1E1E1E]/50 border-[#2A2A2A] hover:border-[#FF0050]/50 transition-all duration-300 cursor-pointer group"
                onClick={() => expandIdea(idea)}
              >
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF0050] to-[#00F2EA] flex items-center justify-center flex-shrink-0">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-[#B0B0B0] font-medium">IDEA #{index + 1}</span>
                      <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#FF0050] transition-colors">{idea.hook}</h3>
                      <p className="text-[#B0B0B0] text-sm line-clamp-3">{idea.summary}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-[#3A3A3A] text-[#B0B0B0] hover:border-[#FF0050] hover:text-[#FF0050] hover:bg-[#FF0050]/10 bg-transparent">
                    Expand This Idea
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#2A2A2A]">
            <div className="sticky top-0 bg-[#1E1E1E] border-b border-[#2A2A2A] p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={closeModal} className="text-[#B0B0B0] hover:text-white">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-semibold">Full Script & Assets</h2>
              </div>
              <Button variant="outline" size="sm" onClick={copyScript} className="border-[#3A3A3A] text-[#B0B0B0] hover:border-[#00F2EA] hover:text-[#00F2EA]">
                {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedScript ? 'Copied!' : 'Copy Script'}
              </Button>
            </div>

            <div className="p-6 space-y-8">
              {/* Script Sections */}
              {['hook', 'body', 'ending'].map((part) => (
                <div key={part} className="backdrop-blur-md bg-[#2A2A2A]/50 rounded-lg p-4">
                  <h4 className={`text-sm mb-2 font-medium ${part === 'body' ? 'text-[#00F2EA]' : 'text-[#FF0050]'}`}>
                    {part[0].toUpperCase() + part.slice(1)}
                  </h4>
                  <p className="text-white">{selectedIdea.fullScript[part as keyof typeof selectedIdea.fullScript]}</p>
                </div>
              ))}

              {/* Music Suggestions */}
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  Music Suggestions
                </h3>
                <div className="grid gap-3">
                  {selectedIdea.musicSuggestions.map((music, index) => (
                    <div key={index} className="bg-[#2A2A2A]/50 rounded-lg p-3">
                      <p className="text-[#B0B0B0]">{music}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* B-roll */}
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  B-Roll Prompts
                </h3>
                <div className="grid gap-3">
                  {selectedIdea.brollPrompts.map((b, index) => (
                    <div key={index} className="bg-[#2A2A2A]/50 rounded-lg p-3">
                      <p className="text-[#B0B0B0]">{b}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-[#555] py-8">
        Made with ❤️ by <a href="https://x.com/bydhruvil" target="_blank" className="underline hover:text-[#00F2EA]">@bydhruvil</a>
      </div>
    </div>
  )
}
