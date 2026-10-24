import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Network, 
  LayoutGrid, 
  Search, 
  Plus, 
  Filter, 
  Sparkles, 
  Tag as TagIcon, 
  Star, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  ChevronRight, 
  Layers, 
  Flame, 
  Clock, 
  Gauge, 
  Cpu, 
  BookOpen, 
  CheckCircle2, 
  CircleDot, 
  Archive, 
  Share2, 
  RotateCcw,
  SlidersHorizontal,
  Info
} from 'lucide-react';

// Predefined tag category color palettes and configurations
const TAG_CATEGORIES = {
  domain: { label: 'Domain', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  tech: { label: 'Tech / Medium', color: 'bg-sky-500/10 text-sky-400 border-sky-500/30' },
  effort: { label: 'Effort', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  impact: { label: 'Impact', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  interest: { label: 'Interest', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
};

const DEFAULT_PRESETS = [
  { id: 'all', label: 'All Ideas', icon: Layers, tags: [] },
  { id: 'weekend', label: 'Weekend Hacks', icon: Flame, tags: ['Quick (< 1 wk)', 'Low Effort', 'Fun'] },
  { id: 'high-impact', label: 'High Impact', icon: Sparkles, tags: ['High Impact', 'Open Source'] },
  { id: 'deep-tech', label: 'Deep Technical', icon: Cpu, tags: ['Deep Tech', 'High Effort', 'Rust', 'AI/ML'] },
  { id: 'creative', label: 'Creative & Design', icon: BookOpen, tags: ['Design / UI', 'Audio / Visual', 'Creative'] },
  { id: 'favs', label: 'Favorites', icon: Star, filterFn: (idea) => idea.favorite }
];

const INITIAL_IDEAS = [
  {
    id: 'idea-1',
    title: 'Local-First Markdown Neural Canvas',
    summary: 'A bi-directional infinite canvas linking markdown files with spatial graph nodes and vector semantic embeddings.',
    notes: 'Could use CRDTs (Yjs) for seamless multi-device peer sync. WebGL or Canvas rendering for handling 10k+ nodes without stuttering.',
    status: 'In Progress',
    favorite: true,
    tags: [
      { name: 'Productivity', category: 'domain' },
      { name: 'AI/ML', category: 'tech' },
      { name: 'Rust', category: 'tech' },
      { name: 'High Impact', category: 'impact' },
      { name: 'High Effort', category: 'effort' },
      { name: 'Obsessed', category: 'interest' }
    ],
    updatedAt: '2026-03-12'
  },
  {
    id: 'idea-2',
    title: 'Ambient Lo-Fi Synth Companion (Hardware)',
    summary: 'Desktop physical knob-controller with e-ink display that generates generative procedural ambient music tailored to your typing speed.',
    notes: 'RP2040 micro-controller, TinyUSB interface, WebAudio bridge or native FM synth chip.',
    status: 'Idea',
    favorite: true,
    tags: [
      { name: 'Hardware', category: 'domain' },
      { name: 'Audio / Visual', category: 'tech' },
      { name: 'Creative', category: 'domain' },
      { name: 'Medium Effort', category: 'effort' },
      { name: 'High Impact', category: 'impact' },
      { name: 'High Interest', category: 'interest' }
    ],
    updatedAt: '2026-03-24'
  },
  {
    id: 'idea-3',
    title: 'Micro-SaaS Static API Stash',
    summary: 'Zero-config CLI that bundles local SQLite queries into instantaneous edge-cached read-only REST and GraphQL endpoints.',
    notes: 'Targeting indie-hackers who need fast static data delivery without provisioning databases.',
    status: 'Idea',
    favorite: false,
    tags: [
      { name: 'Developer Tools', category: 'domain' },
      { name: 'Cloud / Edge', category: 'tech' },
      { name: 'Quick (< 1 wk)', category: 'effort' },
      { name: 'Low Effort', category: 'effort' },
      { name: 'Medium Impact', category: 'impact' },
      { name: 'Curious', category: 'interest' }
    ],
    updatedAt: '2026-02-18'
  },
  {
    id: 'idea-4',
    title: 'Algorithmic Bonsai Growth Simulator',
    summary: 'Interactive 3D procedural plant morphology generator based on L-systems, environmental light constraints, and virtual pruning.',
    notes: 'Three.js / WebGL shader integration with exportable glTF 3D models for 3D printing miniature branches.',
    status: 'Idea',
    favorite: false,
    tags: [
      { name: 'Creative', category: 'domain' },
      { name: 'Design / UI', category: 'domain' },
      { name: 'WebGL', category: 'tech' },
      { name: 'Fun', category: 'interest' },
      { name: 'Medium Effort', category: 'effort' }
    ],
    updatedAt: '2026-01-10'
  },
  {
    id: 'idea-5',
    title: 'Personal Semantic Search for Browser History',
    summary: 'Self-hosted lightweight browser extension running on-device transformer models to search any page you ever read by concept.',
    notes: 'Using WebLLM / Transformers.js directly in Web Worker. Absolute privacy guaranteed.',
    status: 'Backlog',
    favorite: true,
    tags: [
      { name: 'AI/ML', category: 'tech' },
      { name: 'Productivity', category: 'domain' },
      { name: 'High Impact', category: 'impact' },
      { name: 'Deep Tech', category: 'tech' },
      { name: 'High Effort', category: 'effort' },
      { name: 'Obsessed', category: 'interest' }
    ],
    updatedAt: '2026-03-01'
  },
  {
    id: 'idea-6',
    title: 'Minimalist Focus Timer with Mechanical Soundscapes',
    summary: 'Ultra-clean keyboard-driven timer that plays physically modeled keyclicks, relays, and clockwork spring sounds as you focus.',
    notes: 'Pure Canvas audio synthesizer using synthesized physical harmonics instead of static MP3 loops.',
    status: 'Idea',
    favorite: false,
    tags: [
      { name: 'Productivity', category: 'domain' },
      { name: 'Audio / Visual', category: 'tech' },
      { name: 'Quick (< 1 wk)', category: 'effort' },
      { name: 'Low Effort', category: 'effort' },
      { name: 'Fun', category: 'interest' }
    ],
    updatedAt: '2026-02-28'
  },
  {
    id: 'idea-7',
    title: 'Smart Home Mesh Sensor for Plants & Soil',
    summary: 'Ultra low-power ESP32 capacitive probe that reports moisture, sunlight, and temp over ESP-NOW to a Raspberry Pi dashboard.',
    notes: 'Power optimization down to 15uA deep sleep. Solar trickle charger.',
    status: 'Idea',
    favorite: false,
    tags: [
      { name: 'Hardware', category: 'domain' },
      { name: 'IoT', category: 'tech' },
      { name: 'Medium Effort', category: 'effort' },
      { name: 'Medium Impact', category: 'impact' }
    ],
    updatedAt: '2026-01-22'
  },
  {
    id: 'idea-8',
    title: 'Community Open-Source Micro-Grant Tracker',
    summary: 'Decentralized transparency ledger highlighting small developers needing $50-$500 mini-sponsorships to ship tooling.',
    notes: 'Crowdfunded matching pools with simple verification and social proofs.',
    status: 'Backlog',
    favorite: false,
    tags: [
      { name: 'Open Source', category: 'domain' },
      { name: 'High Impact', category: 'impact' },
      { name: 'Cloud / Edge', category: 'tech' },
      { name: 'High Interest', category: 'interest' }
    ],
    updatedAt: '2026-03-04'
  }
];

export default function App() {
  // Persistence state
  const [ideas, setIdeas] = useState(() => {
    try {
      const stored = localStorage.getItem('ideasphere_projects');
      return stored ? JSON.parse(stored) : INITIAL_IDEAS;
    } catch {
      return INITIAL_IDEAS;
    }
  });

  // App UI State
  const [viewMode, setViewMode] = useState('graph'); // 'graph' | 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [activePreset, setActivePreset] = useState('all');
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewIdeaModalOpen, setIsNewIdeaModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sync with local storage
  useEffect(() => {
    try {
      localStorage.setItem('ideasphere_projects', JSON.stringify(ideas));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [ideas]);

  // Extract all unique tags organized by category
  const allTagsWithMetadata = useMemo(() => {
    const map = new Map();
    ideas.forEach(idea => {
      idea.tags.forEach(t => {
        if (!map.has(t.name)) {
          map.set(t.name, { name: t.name, category: t.category || 'domain', count: 1 });
        } else {
          map.get(t.name).count += 1;
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [ideas]);

  // Tag categories with their tags
  const tagsByCategory = useMemo(() => {
    const groups = { domain: [], tech: [], effort: [], impact: [], interest: [] };
    allTagsWithMetadata.forEach(tag => {
      const cat = groups[tag.category] ? tag.category : 'domain';
      groups[cat].push(tag);
    });
    return groups;
  }, [allTagsWithMetadata]);

  // Filter ideas
  const filteredIdeas = useMemo(() => {
    return ideas.filter(idea => {
      // Search matching
      const matchesSearch = 
        !searchQuery.trim() ||
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tags.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Preset filter check
      const currentPresetObj = DEFAULT_PRESETS.find(p => p.id === activePreset);
      if (currentPresetObj?.filterFn && !currentPresetObj.filterFn(idea)) {
        return false;
      }

      // Multi-tag match (AND logic)
      if (selectedTags.length > 0) {
        const ideaTagNames = idea.tags.map(t => t.name);
        const hasAllTags = selectedTags.every(t => ideaTagNames.includes(t));
        if (!hasAllTags) return false;
      }

      return true;
    });
  }, [ideas, searchQuery, selectedTags, activePreset]);

  // Active selected idea object
  const activeIdea = useMemo(() => {
    return ideas.find(i => i.id === selectedIdeaId) || null;
  }, [ideas, selectedIdeaId]);

  // Related ideas calculation based on tag overlap
  const relatedIdeas = useMemo(() => {
    if (!activeIdea) return [];
    const activeTagSet = new Set(activeIdea.tags.map(t => t.name));

    return ideas
      .filter(i => i.id !== activeIdea.id)
      .map(i => {
        const sharedTags = i.tags.filter(t => activeTagSet.has(t.name));
        return { idea: i, sharedCount: sharedTags.length, sharedTags };
      })
      .filter(item => item.sharedCount > 0)
      .sort((a, b) => b.sharedCount - a.sharedCount)
      .slice(0, 4);
  }, [ideas, activeIdea]);

  // Tag click handler (toggle)
  const toggleTag = (tagName) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
    setActivePreset('custom');
  };

  // Preset click handler
  const handlePresetSelect = (preset) => {
    setActivePreset(preset.id);
    if (preset.tags && preset.tags.length > 0) {
      setSelectedTags(preset.tags);
    } else {
      setSelectedTags([]);
    }
  };

  // Toggle Favorite
  const toggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    setIdeas(prev => prev.map(item => item.id === id ? { ...item, favorite: !item.favorite } : item));
  };

  // Delete Idea
  const handleDeleteIdea = (id) => {
    setIdeas(prev => prev.filter(item => item.id !== id));
    if (selectedIdeaId === id) setSelectedIdeaId(null);
  };

  // Save Idea (from Drawer or Modal)
  const handleSaveIdea = (updatedIdea) => {
    setIdeas(prev => {
      const exists = prev.some(item => item.id === updatedIdea.id);
      if (exists) {
        return prev.map(item => item.id === updatedIdea.id ? updatedIdea : item);
      } else {
        return [updatedIdea, ...prev];
      }
    });
    setSelectedIdeaId(updatedIdea.id);
    setIsEditing(false);
    setIsNewIdeaModalOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* LEFT SIDEBAR: Tag Hierarchy & Filters */}
      <aside 
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 ease-in-out border-r border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex flex-col shrink-0 overflow-hidden relative z-20`}
      >
        <div className="p-4 border-b border-slate-800/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Network className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-wide text-white">IdeaSphere</h1>
              <p className="text-[11px] text-slate-400">Tag Cross-Referenced Map</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Collapse Filter Panel"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="p-3 border-b border-slate-800/60">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 px-2 mb-2 flex items-center justify-between">
            <span>Quick Presets</span>
            {selectedTags.length > 0 && (
              <button 
                onClick={() => { setSelectedTags([]); setActivePreset('all'); }} 
                className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 lowercase"
              >
                <RotateCcw className="w-2.5 h-2.5" /> reset
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {DEFAULT_PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isActive = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30' 
                      : 'bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-Dimensional Tag Filter Groups */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {Object.entries(TAG_CATEGORIES).map(([catKey, catMeta]) => {
            const tags = tagsByCategory[catKey] || [];
            if (tags.length === 0) return null;

            return (
              <div key={catKey} className="space-y-1.5">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {catMeta.label}
                  </span>
                  <span className="text-[10px] text-slate-500">{tags.length}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 px-1">
                  {tags.map(tag => {
                    const isSelected = selectedTags.includes(tag.name);
                    return (
                      <button
                        key={tag.name}
                        onClick={() => toggleTag(tag.name)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-500 border-indigo-400 text-white font-medium shadow-sm shadow-indigo-500/25 scale-[1.02]'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-500 hover:text-slate-100'
                        }`}
                      >
                        <span>{tag.name}</span>
                        <span className={`text-[10px] rounded-full px-1 py-0.2 ${isSelected ? 'bg-indigo-600/60 text-white' : 'bg-slate-700/50 text-slate-400'}`}>
                          {tag.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Statistics */}
        <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Showing <strong className="text-slate-200">{filteredIdeas.length}</strong> of {ideas.length} ideas</span>
          {selectedTags.length > 0 && (
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded text-[10px]">
              {selectedTags.length} active tags
            </span>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* TOP TOOLBAR */}
        <header className="h-14 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md px-4 flex items-center justify-between gap-4 z-10 shrink-0">
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Expand Filter Panel"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}

            {/* Live Search Input */}
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ideas, topics, technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/70 rounded-lg pl-9 pr-8 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Active Tags Quick Strip */}
          {selectedTags.length > 0 && (
            <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto max-w-xs xl:max-w-md py-1">
              <span className="text-[11px] text-slate-500 shrink-0">Filtered by:</span>
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  className="bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0"
                >
                  {tag}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-white" 
                    onClick={() => toggleTag(tag)}
                  />
                </span>
              ))}
            </div>
          )}

          {/* View Toggles & Actions */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-800/90 p-1 rounded-lg border border-slate-700/70 flex items-center gap-0.5">
              <button
                onClick={() => setViewMode('graph')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'graph'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Interactive Mind Map Node View"
              >
                <Network className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Graph Map</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Card Matrix Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Card Grid</span>
              </button>
            </div>

            {/* Add Idea Button */}
            <button
              onClick={() => {
                setIsEditing(false);
                setIsNewIdeaModalOpen(true);
              }}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Idea</span>
            </button>
          </div>
        </header>

        {/* DUAL VIEW CONTAINER */}
        <div className="flex-1 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
          {filteredIdeas.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="p-4 rounded-full bg-slate-800/50 border border-slate-700/50 mb-3 text-slate-400">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-slate-200">No project ideas matched</h3>
              <p className="text-sm text-slate-400 max-w-sm mt-1">
                Try loosening your tag filters or clear your search term to view cross-referenced projects.
              </p>
              <button
                onClick={() => { setSelectedTags([]); setSearchQuery(''); setActivePreset('all'); }}
                className="mt-4 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'graph' ? (
            <InteractiveMindMap
              ideas={filteredIdeas}
              selectedIdeaId={selectedIdeaId}
              onSelectIdea={(id) => setSelectedIdeaId(id)}
              onTagClick={toggleTag}
              selectedTags={selectedTags}
            />
          ) : (
            <CardGridView
              ideas={filteredIdeas}
              selectedIdeaId={selectedIdeaId}
              onSelectIdea={(id) => setSelectedIdeaId(id)}
              onTagClick={toggleTag}
              selectedTags={selectedTags}
              onToggleFavorite={toggleFavorite}
              onDelete={handleDeleteIdea}
            />
          )}
        </div>
      </main>

      {/* DETAIL DRAWER / INSPECTOR */}
      {activeIdea && (
        <IdeaDetailDrawer
          idea={activeIdea}
          onClose={() => setSelectedIdeaId(null)}
          onEdit={() => { setIsEditing(true); }}
          onDelete={handleDeleteIdea}
          onToggleFavorite={toggleFavorite}
          onTagClick={toggleTag}
          selectedTags={selectedTags}
          relatedIdeas={relatedIdeas}
          onSelectRelated={(id) => setSelectedIdeaId(id)}
        />
      )}

      {/* MODAL: CREATE / EDIT IDEA */}
      {(isNewIdeaModalOpen || isEditing) && (
        <IdeaFormModal
          isOpen={isNewIdeaModalOpen || isEditing}
          initialData={isEditing ? activeIdea : null}
          existingTags={allTagsWithMetadata}
          onClose={() => { setIsNewIdeaModalOpen(false); setIsEditing(false); }}
          onSave={handleSaveIdea}
        />
      )}
    </div>
  );
}

// -------------------------------------------------------------------------------------
// INTERACTIVE GRAPH / MIND MAP COMPONENT (Canvas + Physics-like Spring Simulation)
// -------------------------------------------------------------------------------------
function InteractiveMindMap({ ideas, selectedIdeaId, onSelectIdea, onTagClick, selectedTags }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Transform states (Pan / Zoom)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isDraggingCanvas = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const draggedNode = useRef(null);
  const hoveredNode = useRef(null);

  // Graph network state
  const nodesRef = useRef([]);
  const linksRef = useRef([]);
  const animFrameId = useRef(null);

  // Build graph nodes & links from current filtered ideas
  useEffect(() => {
    const nodes = [];
    const links = [];
    const tagNodeMap = new Map();

    const width = containerRef.current ? containerRef.current.clientWidth : 800;
    const height = containerRef.current ? containerRef.current.clientHeight : 600;
    const centerX = width / 2;
    const centerY = height / 2;

    // 1. Add Idea Nodes
    ideas.forEach((idea, idx) => {
      const angle = (idx / (ideas.length || 1)) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.3 + (Math.random() * 60 - 30);
      
      const ideaNode = {
        id: idea.id,
        type: 'idea',
        label: idea.title,
        data: idea,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: 22,
        color: idea.favorite ? '#eab308' : '#6366f1'
      };
      nodes.push(ideaNode);

      // 2. Link with Tags
      idea.tags.forEach(t => {
        if (!tagNodeMap.has(t.name)) {
          const tNode = {
            id: `tag-${t.name}`,
            type: 'tag',
            label: t.name,
            category: t.category,
            data: t,
            x: centerX + (Math.random() - 0.5) * (width * 0.5),
            y: centerY + (Math.random() - 0.5) * (height * 0.5),
            vx: 0,
            vy: 0,
            radius: 14,
            color: getCategoryHex(t.category)
          };
          tagNodeMap.set(t.name, tNode);
          nodes.push(tNode);
        }

        links.push({
          source: idea.id,
          target: `tag-${t.name}`,
          weight: 1
        });
      });
    });

    nodesRef.current = nodes;
    linksRef.current = links;
  }, [ideas]);

  // Color helper
  const getCategoryHex = (cat) => {
    switch(cat) {
      case 'domain': return '#10b981'; // emerald
      case 'tech': return '#0284c7';   // sky
      case 'effort': return '#f59e0b'; // amber
      case 'impact': return '#a855f7'; // purple
      case 'interest': return '#f43f5e'; // rose
      default: return '#64748b';
    }
  };

  // Continuous physics tick & render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      if (containerRef.current && canvas) {
        canvas.width = containerRef.current.clientWidth * window.devicePixelRatio;
        canvas.height = containerRef.current.clientHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const stepSimulation = () => {
      const nodes = nodesRef.current;
      const links = linksRef.current;
      const k = 0.04; // Spring stiffness
      const repulsion = 1200; // Node repulsion
      const damping = 0.85; // Damping

      // Repulsion between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 320) {
            const force = repulsion / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            n1.vx -= fx;
            n1.vy -= fy;
            n2.vx += fx;
            n2.vy += fy;
          }
        }
      }

      // Spring forces for links
      const nodeMap = new Map(nodes.map(n => [n.id, n]));
      for (const link of links) {
        const s = nodeMap.get(link.source);
        const t = nodeMap.get(link.target);
        if (!s || !t) continue;
        const dx = t.x - s.x;
        const dy = t.y - s.y;
        const dist = Math.hypot(dx, dy) || 1;
        const desiredDist = s.type === 'idea' && t.type === 'tag' ? 85 : 120;
        const displacement = dist - desiredDist;
        const fx = (dx / dist) * displacement * k;
        const fy = (dy / dist) * displacement * k;

        s.vx += fx;
        s.vy += fy;
        t.vx -= fx;
        t.vy -= fy;
      }

      // Center gravity force
      const w = containerRef.current ? containerRef.current.clientWidth : 800;
      const h = containerRef.current ? containerRef.current.clientHeight : 600;
      const cx = w / 2;
      const cy = h / 2;

      for (const n of nodes) {
        n.vx += (cx - n.x) * 0.003;
        n.vy += (cy - n.y) * 0.003;

        // Apply velocity if not currently dragged
        if (draggedNode.current !== n) {
          n.x += n.vx;
          n.y += n.vy;
          n.vx *= damping;
          n.vy *= damping;
        } else {
          n.vx = 0;
          n.vy = 0;
        }
      }
    };

    const render = () => {
      const width = containerRef.current ? containerRef.current.clientWidth : 800;
      const height = containerRef.current ? containerRef.current.clientHeight : 600;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      // Apply Pan & Zoom
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.scale, transform.scale);

      const nodes = nodesRef.current;
      const links = linksRef.current;
      const nodeMap = new Map(nodes.map(n => [n.id, n]));

      // 1. Draw Links
      for (const link of links) {
        const s = nodeMap.get(link.source);
        const t = nodeMap.get(link.target);
        if (!s || !t) continue;

        const isLinkActive = 
          selectedIdeaId === s.id || 
          (t.type === 'tag' && selectedTags.includes(t.label));

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.strokeStyle = isLinkActive ? 'rgba(129, 140, 248, 0.7)' : 'rgba(51, 65, 85, 0.4)';
        ctx.lineWidth = isLinkActive ? 2 : 1;
        if (isLinkActive) {
          ctx.setLineDash([4, 2]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // 2. Draw Nodes
      for (const n of nodes) {
        const isSelected = n.id === selectedIdeaId || (n.type === 'tag' && selectedTags.includes(n.label));
        const isHovered = hoveredNode.current === n;

        // Node Glow / Halo
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 6, 0, Math.PI * 2);
          ctx.fillStyle = n.type === 'idea' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(56, 189, 248, 0.25)';
          ctx.fill();
        }

        // Main Node Body
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.type === 'idea' ? '#1e1b4b' : '#0f172a';
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#a5b4fc' : n.color;
        ctx.lineWidth = isSelected ? 3 : (n.type === 'idea' ? 2.5 : 1.5);
        ctx.stroke();

        // Node Inner Icon / Dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.type === 'idea' ? 7 : 4, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();

        // Node Label
        ctx.font = n.type === 'idea' ? '600 12px Inter, sans-serif' : '500 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Background pill for label legibility
        const labelText = n.label.length > 22 ? n.label.slice(0, 20) + '...' : n.label;
        const textMetrics = ctx.measureText(labelText);
        const padding = 4;
        const textY = n.y + n.radius + 5;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(
          n.x - textMetrics.width / 2 - padding,
          textY - 2,
          textMetrics.width + padding * 2,
          15
        );

        ctx.fillStyle = isSelected ? '#ffffff' : (n.type === 'idea' ? '#e2e8f0' : '#94a3b8');
        ctx.fillText(labelText, n.x, textY);
      }

      ctx.restore();

      stepSimulation();
      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [transform, selectedIdeaId, selectedTags]);

  // Coordinate conversion utility
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    return {
      x: (rawX - transform.x) / transform.scale,
      y: (rawY - transform.y) / transform.scale
    };
  };

  const findNodeAt = (x, y) => {
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dist = Math.hypot(n.x - x, n.y - y);
      if (dist <= n.radius + 6) return n;
    }
    return null;
  };

  // Mouse / Touch handlers for dragging nodes and panning canvas
  const handleMouseDown = (e) => {
    const coords = getCanvasCoords(e);
    const node = findNodeAt(coords.x, coords.y);
    if (node) {
      draggedNode.current = node;
    } else {
      isDraggingCanvas.current = true;
      dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
    }
  };

  const handleMouseMove = (e) => {
    const coords = getCanvasCoords(e);

    if (draggedNode.current) {
      draggedNode.current.x = coords.x;
      draggedNode.current.y = coords.y;
    } else if (isDraggingCanvas.current) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      }));
    } else {
      const node = findNodeAt(coords.x, coords.y);
      hoveredNode.current = node;
      if (canvasRef.current) {
        canvasRef.current.style.cursor = node ? 'pointer' : 'grab';
      }
    }
  };

  const handleMouseUp = (e) => {
    if (draggedNode.current) {
      const coords = getCanvasCoords(e);
      const dist = Math.hypot(draggedNode.current.x - coords.x, draggedNode.current.y - coords.y);
      
      // If minimal drag, trigger selection
      if (dist < 10) {
        if (draggedNode.current.type === 'idea') {
          onSelectIdea(draggedNode.current.id);
        } else if (draggedNode.current.type === 'tag') {
          onTagClick(draggedNode.current.label);
        }
      }
    }
    draggedNode.current = null;
    isDraggingCanvas.current = false;
  };

  // Zoom handling
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = 1.08;
    const delta = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
    setTransform(prev => {
      const newScale = Math.min(Math.max(prev.scale * delta, 0.4), 2.5);
      return { ...prev, scale: newScale };
    });
  };

  const resetView = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-5 left-5 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 p-1.5 rounded-xl shadow-xl flex items-center gap-1">
        <button
          onClick={() => setTransform(t => ({ ...t, scale: Math.min(t.scale * 1.2, 2.5) }))}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTransform(t => ({ ...t, scale: Math.max(t.scale / 1.2, 0.4) }))}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-700 mx-0.5" />
        <button
          onClick={resetView}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Reset Zoom & Pan"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Mind map guidance hint */}
      <div className="absolute top-4 right-4 bg-slate-900/70 backdrop-blur-md border border-slate-800/80 rounded-lg px-3 py-1.5 text-[11px] text-slate-400 pointer-events-none flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-indigo-400" />
        <span>Drag ideas & tags to re-cluster. Click tag nodes to filter.</span>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------------------
// CARD MATRIX / GRID VIEW
// -------------------------------------------------------------------------------------
function CardGridView({ ideas, selectedIdeaId, onSelectIdea, onTagClick, selectedTags, onToggleFavorite, onDelete }) {
  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {ideas.map((idea) => {
          const isSelected = selectedIdeaId === idea.id;
          return (
            <div
              key={idea.id}
              onClick={() => onSelectIdea(idea.id)}
              className={`group relative rounded-xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900/90 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500'
                  : 'bg-slate-900/40 hover:bg-slate-900/70 border-slate-800/80 hover:border-slate-700 shadow-lg'
              }`}
            >
              <div>
                {/* Header: Title & Favorite */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-slate-100 group-hover:text-indigo-300 text-base leading-snug transition-colors line-clamp-2">
                    {idea.title}
                  </h3>
                  <button
                    onClick={(e) => onToggleFavorite(idea.id, e)}
                    className="p-1 text-slate-400 hover:text-amber-400 transition-colors shrink-0"
                    title={idea.favorite ? 'Unfavorite' : 'Mark as Favorite'}
                  >
                    <Star className={`w-4 h-4 ${idea.favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {idea.summary}
                </p>
              </div>

              <div>
                {/* Cross-reference Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {idea.tags.map(tag => {
                    const isFiltered = selectedTags.includes(tag.name);
                    const catMeta = TAG_CATEGORIES[tag.category] || TAG_CATEGORIES.domain;
                    return (
                      <button
                        key={tag.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTagClick(tag.name);
                        }}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md border transition-all ${
                          isFiltered 
                            ? 'bg-indigo-600 border-indigo-500 text-white font-semibold' 
                            : `${catMeta.color} hover:brightness-125`
                        }`}
                      >
                        {tag.name}
                      </button>
                    );
                  })}
                </div>

                {/* Card Footer: Status & Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <CircleDot className="w-3 h-3 text-emerald-400" />
                    <span>{idea.status || 'Idea'}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px]">{idea.updatedAt || 'Recently'}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(idea.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                      title="Delete idea"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------------------
// DETAIL DRAWER: CROSS-REFERENCE INSPECTOR
// -------------------------------------------------------------------------------------
function IdeaDetailDrawer({ idea, onClose, onEdit, onDelete, onToggleFavorite, onTagClick, selectedTags, relatedIdeas, onSelectRelated }) {
  return (
    <aside className="w-96 border-l border-slate-800/90 bg-slate-900/90 backdrop-blur-xl flex flex-col h-full shadow-2xl relative z-30 shrink-0">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
          Project Details
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onToggleFavorite(idea.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
            title="Toggle Favorite"
          >
            <Star className={`w-4 h-4 ${idea.favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
            title="Edit Idea"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(idea.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Delete Idea"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        {/* Title & Status */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CircleDot className="w-2.5 h-2.5" /> {idea.status || 'Idea'}
            </span>
            <span className="text-[11px] text-slate-500">Updated {idea.updatedAt}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 leading-snug">{idea.title}</h2>
        </div>

        {/* Summary */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Overview</label>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
            {idea.summary}
          </p>
        </div>

        {/* Detailed Notes */}
        {idea.notes && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Architectural & Tech Notes</label>
            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 whitespace-pre-line font-mono">
              {idea.notes}
            </div>
          </div>
        )}

        {/* Cross-Referenced Tags */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Associated Characteristics</label>
          <div className="flex flex-wrap gap-1.5">
            {idea.tags.map(tag => {
              const catMeta = TAG_CATEGORIES[tag.category] || TAG_CATEGORIES.domain;
              const isFiltered = selectedTags.includes(tag.name);
              return (
                <button
                  key={tag.name}
                  onClick={() => onTagClick(tag.name)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-all flex items-center gap-1.5 ${
                    isFiltered 
                      ? 'bg-indigo-600 border-indigo-400 text-white font-medium shadow-sm shadow-indigo-500/20' 
                      : `${catMeta.color} hover:brightness-125`
                  }`}
                >
                  <TagIcon className="w-3 h-3 opacity-70" />
                  <span>{tag.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RELATED IDEAS / CROSS-REFERENCE SUGGESTIONS */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Cross-Referenced Ideas</span>
            </label>
            <span className="text-[10px] text-slate-500">{relatedIdeas.length} related</span>
          </div>

          {relatedIdeas.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No other ideas share matching tags yet.</p>
          ) : (
            <div className="space-y-2">
              {relatedIdeas.map(({ idea: relIdea, sharedCount, sharedTags }) => (
                <div
                  key={relIdea.id}
                  onClick={() => onSelectRelated(relIdea.id)}
                  className="p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-medium text-slate-200 group-hover:text-indigo-300 truncate max-w-[200px]">
                      {relIdea.title}
                    </h4>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20">
                      {sharedCount} shared {sharedCount === 1 ? 'tag' : 'tags'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {sharedTags.map(st => (
                      <span key={st.name} className="text-[9px] text-slate-400 bg-slate-900/60 px-1 rounded">
                        #{st.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

// -------------------------------------------------------------------------------------
// MODAL: CREATE / EDIT IDEA WITH DYNAMIC TAG ASSIGNMENT
// -------------------------------------------------------------------------------------
function IdeaFormModal({ isOpen, initialData, existingTags, onClose, onSave }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [status, setStatus] = useState(initialData?.status || 'Idea');
  const [tags, setTags] = useState(initialData?.tags || []);
  
  // Custom tag input
  const [newTagName, setNewTagName] = useState('');
  const [newTagCategory, setNewTagCategory] = useState('domain');

  if (!isOpen) return null;

  const handleAddTag = (name, category = 'domain') => {
    if (!name.trim()) return;
    const cleanName = name.trim();
    if (tags.some(t => t.name.toLowerCase() === cleanName.toLowerCase())) return;

    setTags([...tags, { name: cleanName, category }]);
    setNewTagName('');
  };

  const handleRemoveTag = (tagName) => {
    setTags(tags.filter(t => t.name !== tagName));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: initialData?.id || `idea-${Date.now()}`,
      title: title.trim(),
      summary: summary.trim(),
      notes: notes.trim(),
      status,
      favorite: initialData?.favorite || false,
      tags,
      updatedAt: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-100">
            {initialData ? 'Edit Project Idea' : 'Create New Project Idea'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Local-First Canvas"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Short Summary / Hook</label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="One or two sentences explaining the core essence of the project..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Idea">Idea (Conceptual)</option>
                <option value="In Progress">In Progress</option>
                <option value="Backlog">Backlog / On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Quick Add Tag from Existing</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    const found = existingTags.find(t => t.name === e.target.value);
                    if (found) handleAddTag(found.name, found.category);
                    e.target.value = '';
                  }
                }}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select a tag...</option>
                {existingTags.map(t => (
                  <option key={t.name} value={t.name}>{t.name} ({t.category})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tag Management */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Assigned Characteristics & Tags</label>
            <div className="flex flex-wrap gap-1.5 min-h-[42px] p-2 bg-slate-950/40 border border-slate-800 rounded-lg mb-2">
              {tags.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No tags attached yet. Add tags below to enable graph cross-referencing.</span>
              ) : (
                tags.map(t => (
                  <span
                    key={t.name}
                    className="text-xs bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 px-2 py-0.5 rounded-md flex items-center gap-1.5"
                  >
                    <span>{t.name}</span>
                    <button type="button" onClick={() => handleRemoveTag(t.name)} className="hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Custom Tag input row */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New tag label..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(newTagName, newTagCategory);
                  }
                }}
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={newTagCategory}
                onChange={(e) => setNewTagCategory(e.target.value)}
                className="bg-slate-800/80 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="domain">Domain</option>
                <option value="tech">Tech / Medium</option>
                <option value="effort">Effort</option>
                <option value="impact">Impact</option>
                <option value="interest">Interest</option>
              </select>
              <button
                type="button"
                onClick={() => handleAddTag(newTagName, newTagCategory)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
              >
                Add Tag
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Architecture, Links & Implementation Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Technical libraries to try, hardware pinouts, reference links..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium shadow-md shadow-indigo-600/20 transition-colors"
            >
              Save Project Idea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
