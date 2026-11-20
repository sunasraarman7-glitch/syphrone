import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import haptic from '../utils/haptics';

import { BLOG_POSTS } from '../data/blogPosts';

export default function BlogPage({ onNavigateTab, onShowKeyPairGen }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Auto-detect and open article from URL (e.g. /blog/free-online-encryption-tool-2026 or #blog/free-online-encryption-tool-2026)
  useEffect(() => {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
    const hash = window.location.hash.replace(/^#\/?/, '');

    let targetArticleId = '';
    if (path.startsWith('blog/')) {
      targetArticleId = path.replace('blog/', '');
    } else if (hash.startsWith('blog/')) {
      targetArticleId = hash.replace('blog/', '');
    }

    if (targetArticleId) {
      const match = BLOG_POSTS.find(p => p.id === targetArticleId || (p.aliases && p.aliases.includes(targetArticleId)));
      if (match) {
        setSelectedPost(match);
      }
    }
  }, []);

  // Update SEO tags dynamically when reading a post
  useEffect(() => {
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    const metaDesc = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');

    if (selectedPost) {
      document.title = `${selectedPost.title} — Syphrone Blog`;
      if (metaDesc) metaDesc.setAttribute('content', selectedPost.summary);
      if (canonicalLink) canonicalLink.setAttribute('href', `https://syphrone.netlify.app/blog/${selectedPost.id}`);
      if (ogTitle) ogTitle.setAttribute('content', selectedPost.title);
      if (ogDesc) ogDesc.setAttribute('content', selectedPost.summary);
      if (ogUrl) ogUrl.setAttribute('content', `https://syphrone.netlify.app/blog/${selectedPost.id}`);
    } else {
      document.title = 'Syphrone Blog — Encryption, Privacy & Security Guides';
      if (metaDesc) metaDesc.setAttribute('content', 'Learn about AES-GCM encryption, steganography, client-side cryptography, and web security with articles from the Syphrone team.');
      if (canonicalLink) canonicalLink.setAttribute('href', 'https://syphrone.netlify.app/blog');
    }
  }, [selectedPost]);

  const openPost = (post) => {
    setSelectedPost(post);
    if (window.location.pathname !== `/blog/${post.id}`) {
      window.history.pushState({ article: post.id }, '', `/blog/${post.id}`);
    }
    haptic.light();
  };

  const closePost = () => {
    setSelectedPost(null);
    if (window.location.pathname !== '/blog') {
      window.history.pushState({}, '', '/blog');
    }
    haptic.light();
  };

  const categories = ['All', 'Guides', 'Cryptography', 'Steganography', 'Security', 'Asymmetric Keys', 'Ciphers', 'Tools'];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAction = (target) => {
    haptic.light();
    if (target === 'keypair') {
      onShowKeyPairGen?.();
    } else if (target === 'vault') {
      onNavigateTab?.('vault');
    } else if (target === 'history') {
      onNavigateTab?.('history');
    } else if (target === 'settings') {
      onNavigateTab?.('settings');
    } else if (target === 'about') {
      onNavigateTab?.('about');
    } else if (target === 'developer') {
      onNavigateTab?.('developer');
    } else if (target === 'faq') {
      onNavigateTab?.('faq');
    } else {
      onNavigateTab?.('home');
    }
    closePost();
  };

  // Helper to render markdown text with interactive internal links
  const renderFormattedParagraph = (text) => {
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const linkText = match[1];
      const linkTarget = match[2].replace('#', '');
      parts.push(
        <button
          key={match.index}
          onClick={() => handleAction(linkTarget)}
          className="text-blue-400 font-semibold underline hover:text-blue-300 transition-colors mx-1 cursor-pointer"
        >
          {linkText}
        </button>
      );
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts;
  };

  return (
    <div className="flex-grow px-4 pb-28 relative z-10 max-w-4xl mx-auto">
      {/* Hero Header */}
      <div className="py-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-syphrone-border flex items-center justify-center">
            <i className="fa-solid fa-newspaper text-blue-400 text-lg" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Security <span className="text-gradient">Blog & Guides</span>
            </h1>
            <p className="text-syphrone-muted text-xs mt-0.5">Learn secret message encryption, steganography & privacy tools</p>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-syphrone-muted text-xs" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by keyword: secret message encryptor, AES-256, steganography, RSA..."
            className="w-full input-field rounded-xl pl-10 pr-4 py-3 text-xs"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-syphrone-muted hover:text-white text-xs">
              &times;
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-[0_0_10px_rgba(74,106,255,0.2)]'
                  : 'bg-syphrone-card text-syphrone-muted border-syphrone-border hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map(post => (
          <motion.div
            key={post.id}
            whileHover={{ y: -3 }}
            onClick={() => openPost(post)}
            className="glass-card rounded-2xl p-5 border border-syphrone-border hover:border-blue-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${post.bg} flex items-center justify-center`}>
                    <i className={`fa-solid ${post.icon} ${post.color} text-sm`} />
                  </div>
                  <span className="text-[11px] font-semibold text-white bg-syphrone-border/40 px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                </div>
                <span className="text-[10px] text-syphrone-muted">{post.readTime}</span>
              </div>

              <h2 className="text-base font-bold text-white mb-2 line-clamp-2 hover:text-blue-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-xs text-syphrone-muted leading-relaxed line-clamp-3 mb-4">
                {post.summary}
              </p>
            </div>

            <div>
              {/* Keywords chips */}
              <div className="flex flex-wrap gap-1 mb-4">
                {post.keywords.map(kw => (
                  <span key={kw} className="text-[9px] px-2 py-0.5 rounded bg-syphrone-bg text-syphrone-muted border border-syphrone-border">
                    #{kw}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-syphrone-border text-xs">
                <span className="text-syphrone-muted text-[10px]">{post.date}</span>
                <span className="text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Article <i className="fa-solid fa-arrow-right text-[10px]" />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 glass-card rounded-2xl border border-syphrone-border">
          <p className="text-syphrone-muted text-sm">No articles match your search query.</p>
          <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-3 text-xs text-blue-400 underline">
            Reset search filters
          </button>
        </div>
      )}

      {/* Reader Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="modal-overlay" onClick={closePost}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="modal-container"
              style={{ maxWidth: 640 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-syphrone-border backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${selectedPost.bg} flex items-center justify-center`}>
                    <i className={`fa-solid ${selectedPost.icon} ${selectedPost.color} text-base`} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400">{selectedPost.category}</span>
                    <h2 className="text-sm font-bold text-white truncate max-w-xs">{selectedPost.title}</h2>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  onClick={closePost}
                  className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-syphrone-muted hover:text-white"
                >
                  <i className="fa-solid fa-xmark" />
                </motion.button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between text-xs text-syphrone-muted pb-3 border-b border-syphrone-border">
                  <span>Published on {selectedPost.date}</span>
                  <span>{selectedPost.readTime}</span>
                </div>

                <div className="prose prose-invert prose-sm max-w-none space-y-4 text-syphrone-text text-sm leading-relaxed">
                  {selectedPost.content.trim().split('\n\n').map((paragraph, idx) => {
                    if (paragraph.trim().startsWith('###')) {
                      return <h3 key={idx} className="text-base font-bold text-white mt-4 mb-2 flex items-center gap-2">{paragraph.replace('###', '').trim()}</h3>;
                    }
                    if (paragraph.trim().startsWith('-')) {
                      return (
                        <ul key={idx} className="list-disc pl-5 space-y-1 text-syphrone-muted">
                          {paragraph.trim().split('\n').map((li, lidx) => (
                            <li key={lidx}>{renderFormattedParagraph(li.replace('-', '').trim())}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={idx} className="text-syphrone-muted">{renderFormattedParagraph(paragraph.trim())}</p>;
                  })}
                </div>

                {/* Internal Link CTA */}
                <div className="glass-card rounded-2xl p-5 border border-blue-500/30 bg-blue-500/5 mt-6 text-center space-y-3">
                  <h4 className="text-sm font-bold text-white">Ready to test this encryption method?</h4>
                  <p className="text-xs text-syphrone-muted">
                    Try {selectedPost.title} directly in your browser with zero data storage.
                  </p>
                  <button
                    onClick={() => handleAction(selectedPost.actionTarget)}
                    className="px-6 py-2.5 rounded-xl btn-gradient text-white font-bold text-xs shadow-lg inline-flex items-center gap-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-bolt" /> {selectedPost.actionText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
