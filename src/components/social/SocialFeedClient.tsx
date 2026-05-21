'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface SocialFeedClientProps {
  posts: any[]
  matches: any[]
  leaderboard: any[]
  currentUserId: string
}

const POST_TYPE_CONFIG: Record<string, { emoji: string; label: string; bg: string }> = {
  achievement:  { emoji: '🏆', label: 'Achievement', bg: 'rgba(184,242,208,0.25)' },
  recipe:       { emoji: '📖', label: 'Recipe',       bg: 'rgba(255,185,151,0.2)'  },
  collectible:  { emoji: '✨', label: 'Collectible',  bg: 'rgba(255,209,102,0.2)'  },
  transformation:{ emoji: '⚡', label: 'Progress',   bg: 'rgba(183,167,217,0.2)'  },
  general:      { emoji: '🌸', label: 'Post',         bg: 'transparent'            },
}

function PostCard({ post, currentUserId }: { post: any; currentUserId: string }) {
  const [liked, setLiked] = useState(post.isLiked)
  const [likeCount, setLikeCount] = useState(post.likeCount)

  async function toggleLike() {
    const next = !liked
    setLiked(next)
    setLikeCount((c: number) => next ? c + 1 : c - 1)
    await fetch('/api/social/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: post.id }),
    })
  }

  const typeConfig = POST_TYPE_CONFIG[post.postType] ?? POST_TYPE_CONFIG.general

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="feed-post"
    >
      {/* Post header */}
      <div className="flex items-center gap-3 mb-3">
        <Link href={`/dashboard/user/${post.user.username}`}>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(183,167,217,0.4), rgba(184,242,208,0.4))' }}
          >
            {post.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.user.image} alt="" className="w-full h-full rounded-full object-cover" />
            ) : '🌿'}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold" style={{ color: '#374151' }}>@{post.user.username}</div>
          {post.user.activeTitle && (
            <div className="text-xs" style={{ color: '#9D79D6' }}>{post.user.activeTitle}</div>
          )}
        </div>
        <div className="text-xs flex-shrink-0" style={{ color: '#6B7280' }}>
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </div>
      </div>

      {/* Achievement badge */}
      {post.postType !== 'general' && post.metadata && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3 text-sm font-semibold"
          style={{ background: typeConfig.bg, border: '1px solid rgba(183,167,217,0.2)', color: '#374151' }}
        >
          <span>{typeConfig.emoji}</span>
          <span>
            {post.metadata.streakDays ? `${post.metadata.streakDays}-day ${post.metadata.streakType} streak!` :
             post.metadata.collectibleName ? `New Collectible: ${post.metadata.collectibleName}!` :
             post.metadata.level ? `Level ${post.metadata.level} reached!` :
             typeConfig.label}
          </span>
        </div>
      )}

      {/* Content */}
      <p className="text-sm leading-relaxed mb-3" style={{ color: '#374151' }}>{post.content}</p>

      {/* Image */}
      {post.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.imageUrl} alt="" className="w-full rounded-2xl object-cover mb-3" style={{ maxHeight: 240 }} />
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1" style={{ borderTop: '1px solid rgba(183,167,217,0.15)' }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleLike}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
          style={{
            background: liked ? 'rgba(255,170,165,0.2)' : 'transparent',
            color: liked ? '#FFAAA5' : '#6B7280',
          }}
        >
          {liked ? '❤️' : '🤍'} {likeCount}
        </motion.button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:bg-fog/30" style={{ color: '#6B7280' }}>
          💬 {post.commentCount}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:bg-fog/30 ml-auto" style={{ color: '#6B7280' }}>
          🔗 Share
        </button>
      </div>
    </motion.div>
  )
}

export function SocialFeedClient({ posts, matches, leaderboard, currentUserId }: SocialFeedClientProps) {
  const [activeTab, setActiveTab] = useState<'community' | 'chummies' | 'top'>('community')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const router = useRouter()

  async function handleSendRequest(userId: string) {
    await fetch('/api/social/friend-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId: userId }),
    })
    router.refresh()
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5">
      {/* Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="tab-bar flex-1 mr-3">
            {(['community', 'chummies', 'top'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              >
                {tab === 'community' ? '🌍 Community' : tab === 'chummies' ? '👥 Chummies' : '🏆 Top'}
              </button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCreatePost(true)}
            className="btn-primary px-4 py-2.5 text-xs flex-shrink-0"
          >
            + Share
          </motion.button>
        </div>

        <div className="space-y-3">
          {posts.length === 0 ? (
            <div className="velune-card p-10 text-center">
              <span className="text-4xl">🌸</span>
              <p className="mt-3 font-semibold text-sm" style={{ color: '#374151' }}>No posts yet</p>
              <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Be the first to share your progress!</p>
            </div>
          ) : (
            posts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <PostCard post={post} currentUserId={currentUserId} />
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="space-y-4">
        {/* Nutrition matches */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="velune-card p-5">
          <div className="section-label text-sm">Nutrition Matches 💫</div>
          <div className="space-y-2">
            {matches.slice(0, 4).map((user: any, i: number) => {
              const score = 85 + Math.floor(Math.random() * 12)
              const scoreColor = score >= 90 ? '#95D5B2' : score >= 85 ? '#B7A7D9' : '#FFB997'
              return (
                <div key={user.id} className="flex items-center gap-3 p-2.5 rounded-xl"
                  style={{ background: `rgba(183,167,217,${0.05 + i * 0.02})` }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, rgba(183,167,217,0.3), rgba(184,242,208,0.3))' }}>
                    🌿
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate" style={{ color: '#374151' }}>@{user.username}</div>
                    <div className="text-xs truncate" style={{ color: '#6B7280' }}>
                      {user.blueprint?.dietaryPref?.replace(/_/g, ' ')} · {user.blueprint?.goal?.replace(/_/g, ' ')}
                    </div>
                  </div>
                  <div className="text-sm font-black flex-shrink-0" style={{ color: scoreColor }}>{score}%</div>
                  <button
                    onClick={() => handleSendRequest(user.id)}
                    className="text-xs px-2 py-1 rounded-lg font-bold flex-shrink-0"
                    style={{ background: 'rgba(160,196,255,0.2)', color: '#5B8FD9', border: '1px solid rgba(160,196,255,0.3)' }}
                  >
                    +
                  </button>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Streak leaderboard */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="velune-card p-5">
          <div className="section-label text-sm">Top Streaks 🏆</div>
          <div className="space-y-2">
            {leaderboard.slice(0, 6).map((entry: any, i: number) => {
              const rankEmoji = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`
              const isMe = entry.user.id === currentUserId
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{
                    background: isMe ? 'rgba(183,167,217,0.12)' : 'transparent',
                    border: `1px solid ${isMe ? 'rgba(183,167,217,0.35)' : 'rgba(183,167,217,0.1)'}`,
                  }}
                >
                  <span className="text-sm w-6 text-center">{rankEmoji}</span>
                  <span className="flex-1 text-xs font-bold truncate" style={{ color: isMe ? '#9D79D6' : '#374151' }}>
                    @{entry.user.username}{isMe ? ' (you)' : ''}
                  </span>
                  <span className="text-xs font-black flex-shrink-0" style={{ color: '#9D79D6' }}>
                    🔥 {entry.currentDays}d
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Create post modal */}
      {showCreatePost && (
        <CreatePostModal onClose={() => setShowCreatePost(false)} onPost={() => { setShowCreatePost(false); router.refresh() }} />
      )}
    </div>
  )
}

function CreatePostModal({ onClose, onPost }: { onClose: () => void; onPost: () => void }) {
  const [content, setContent] = useState('')
  const [posting, setPosting] = useState(false)

  async function submit() {
    if (!content.trim()) return
    setPosting(true)
    await fetch('/api/social/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, postType: 'general' }),
    })
    setPosting(false)
    onPost()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(31,41,55,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="velune-card p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold" style={{ color: '#374151' }}>Share with Community 🌸</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-sm" style={{ background: 'rgba(234,231,225,0.8)', color: '#6B7280' }}>✕</button>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your progress, achievements, or motivation... 🌱"
          className="input-velune resize-none h-28 mb-4"
          maxLength={500}
        />
        <div className="flex justify-between items-center">
          <span className="text-xs" style={{ color: '#6B7280' }}>{content.length}/500</span>
          <button onClick={submit} disabled={!content.trim() || posting} className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50">
            {posting ? '✨ Posting...' : '🌸 Post'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
