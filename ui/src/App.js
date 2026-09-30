import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchMediaItems, createMediaItem, deleteMediaItem } from './services/api';
import './App.css';

const TYPE_CONFIG = {
  Movie: { label: 'Movie', icon: '🎬', className: 'type-movie' },
  TVShow: { label: 'TV Series', icon: '📺', className: 'type-tvshow' },
  Book: { label: 'Book', icon: '📖', className: 'type-book' },
  Album: { label: 'Album', icon: '🎵', className: 'type-album' },
  Game: { label: 'Game', icon: '🎮', className: 'type-game' },
};

const TYPE_MAP = ['Movie', 'TVShow', 'Book', 'Album', 'Game'];

function normalizeType(type) {
  if (typeof type === 'number') {
    return TYPE_MAP[type] || 'Movie';
  }
  return type || 'Movie';
}

function getStatusClass(status) {
  if (!status) return 'status-plantowatch';
  const s = status.toLowerCase();
  if (s.includes('completed')) return 'status-completed';
  if (s.includes('progress')) return 'status-inprogress';
  return 'status-plantowatch';
}

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Movie',
    creator: '',
    releaseYear: new Date().getFullYear(),
    genre: '',
    overview: '',
    rating: 8.0,
    status: 'Plan to Watch',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMediaItems();
      setItems(data);
    } catch (err) {
      console.error('Failed to load media items:', err);
      setError('Could not connect to the API. Make sure the .NET backend is running on http://localhost:5055.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Statistics
  const stats = useMemo(() => {
    const total = items.length;
    const movies = items.filter((i) => normalizeType(i.type) === 'Movie').length;
    const tvShows = items.filter((i) => normalizeType(i.type) === 'TVShow').length;
    const books = items.filter((i) => normalizeType(i.type) === 'Book').length;
    const albums = items.filter((i) => normalizeType(i.type) === 'Album').length;
    
    const ratedItems = items.filter((i) => i.rating != null);
    const avgRating = ratedItems.length
      ? (ratedItems.reduce((acc, curr) => acc + curr.rating, 0) / ratedItems.length).toFixed(1)
      : 'N/A';

    return { total, movies, tvShows, books, albums, avgRating };
  }, [items]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const itemType = normalizeType(item.type);
        const matchesType = selectedType === 'All' || itemType === selectedType;
        const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
        const term = search.trim().toLowerCase();
        const matchesSearch =
          !term ||
          item.title?.toLowerCase().includes(term) ||
          item.creator?.toLowerCase().includes(term) ||
          item.genre?.toLowerCase().includes(term);

        return matchesType && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'year') {
          return (b.releaseYear || 0) - (a.releaseYear || 0);
        }
        // default newest created
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [items, search, selectedType, selectedStatus, sortBy]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        releaseYear: formData.releaseYear ? parseInt(formData.releaseYear, 10) : null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
      };
      await createMediaItem(payload);
      setIsModalOpen(false);
      setFormData({
        title: '',
        type: 'Movie',
        creator: '',
        releaseYear: new Date().getFullYear(),
        genre: '',
        overview: '',
        rating: 8.0,
        status: 'Plan to Watch',
      });
      await loadData();
    } catch (err) {
      alert(`Error saving media item: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteMediaItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert(`Failed to delete item: ${err.message}`);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="brand">
          <div className="brand-icon">✨</div>
          <div className="brand-text">
            <h1>Media Database</h1>
            <p>Curate and explore your personal library of movies, series, books, and albums</p>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn-secondary" onClick={loadData} title="Refresh collection">
            ↻ Refresh
          </button>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            + Add New Entry
          </button>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <div>
            <strong>API Connection Issue:</strong> {error}
          </div>
          <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem' }} onClick={loadData}>
            Retry
          </button>
        </div>
      )}

      {/* Quick Stats Grid */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#818cf8' }}>📚</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Items</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#818cf8' }}>🎬</div>
          <div className="stat-info">
            <div className="stat-value">{stats.movies}</div>
            <div className="stat-label">Movies</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#fbbf24' }}>📺</div>
          <div className="stat-info">
            <div className="stat-value">{stats.tvShows}</div>
            <div className="stat-label">TV Series</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#34d399' }}>📖</div>
          <div className="stat-info">
            <div className="stat-value">{stats.books}</div>
            <div className="stat-label">Books</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#facc15' }}>⭐</div>
          <div className="stat-info">
            <div className="stat-value">{stats.avgRating}</div>
            <div className="stat-label">Avg Rating</div>
          </div>
        </div>
      </section>

      {/* Control Panel (Search, Filters, Sort) */}
      <section className="controls-panel">
        <div className="controls-row">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, creator, or genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              className="select-control"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by Status"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Plan to Watch">Plan to Watch</option>
            </select>

            <select
              className="select-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort Media"
            >
              <option value="newest">Sort: Recently Added</option>
              <option value="rating">Sort: Top Rated</option>
              <option value="year">Sort: Release Year</option>
              <option value="title">Sort: Title A-Z</option>
            </select>
          </div>
        </div>

        {/* Type Tabs */}
        <div className="filter-tabs">
          <button
            className={`tab-btn ${selectedType === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedType('All')}
          >
            <span>All Types</span>
            <span className="tab-count">{items.length}</span>
          </button>

          {Object.entries(TYPE_CONFIG).map(([typeKey, cfg]) => {
            const count = items.filter((i) => normalizeType(i.type) === typeKey).length;
            return (
              <button
                key={typeKey}
                className={`tab-btn ${selectedType === typeKey ? 'active' : ''}`}
                onClick={() => setSelectedType(typeKey)}
              >
                <span>{cfg.icon}</span>
                <span>{cfg.label}</span>
                <span className="tab-count">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Media Collection Grid */}
      {loading ? (
        <div className="loading-box">
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading media library...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h3>No Media Entries Found</h3>
          <p>
            {search || selectedType !== 'All' || selectedStatus !== 'All'
              ? 'Try adjusting your search query or filters to find what you are looking for.'
              : 'Your media database is currently empty. Add your first entry to get started!'}
          </p>
          {(search || selectedType !== 'All' || selectedStatus !== 'All') && (
            <button
              className="btn-secondary"
              onClick={() => {
                setSearch('');
                setSelectedType('All');
                setSelectedStatus('All');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="media-grid">
          {filteredItems.map((item) => {
            const typeStr = normalizeType(item.type);
            const typeConf = TYPE_CONFIG[typeStr] || TYPE_CONFIG.Movie;
            const genres = item.genre
              ? item.genre.split(',').map((g) => g.trim())
              : [];

            return (
              <article key={item.id} className="media-card">
                <div>
                  <div className="card-header">
                    <span className={`type-pill ${typeConf.className}`}>
                      <span>{typeConf.icon}</span> {typeConf.label}
                    </span>
                    <span className={`status-pill ${getStatusClass(item.status)}`}>
                      <span className="status-dot"></span>
                      {item.status || 'Plan to Watch'}
                    </span>
                  </div>

                  <h2 className="card-title">{item.title}</h2>
                  {item.creator && (
                    <div className="card-creator">
                      <span>👤</span> {item.creator}
                    </div>
                  )}

                  {item.overview && (
                    <p className="card-overview" title={item.overview}>
                      {item.overview}
                    </p>
                  )}

                  {genres.length > 0 && (
                    <div className="card-genres">
                      {genres.map((g, idx) => (
                        <span key={idx} className="genre-tag">
                          {g}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {item.rating != null && (
                      <span className="card-rating">
                        ★ {item.rating.toFixed(1)}
                      </span>
                    )}
                    {item.releaseYear && (
                      <span className="card-year">{item.releaseYear}</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="btn-close"
                    title="Delete item"
                    style={{ fontSize: '1rem', color: '#ef4444' }}
                  >
                    🗑️
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Add New Item Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add to Media Library</h2>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Interstellar, Dune..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    className="form-control"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Movie">Movie</option>
                    <option value="TVShow">TV Series</option>
                    <option value="Book">Book</option>
                    <option value="Album">Album</option>
                    <option value="Game">Game</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="form-control"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Plan to Watch">Plan to Watch</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Creator (Director / Author / Artist)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Christopher Nolan"
                    value={formData.creator}
                    onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Release Year</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="2024"
                    value={formData.releaseYear}
                    onChange={(e) => setFormData({ ...formData, releaseYear: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Genre</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Sci-Fi, Action, Drama"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Rating (0.0 - 10.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    className="form-control"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Overview / Summary</label>
                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Short description or review notes..."
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
