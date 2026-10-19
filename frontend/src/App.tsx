import { useEffect, useMemo, useState, type ReactNode } from 'react'

type Page =
  | 'home'
  | 'article'
  | 'video'
  | 'dashboard'
  | 'new-article'
  | 'upload-video'
  | 'login'
  | 'signup'
  | 'profile'
  | 'settings'
  | 'friends'
  | 'messages'
  | 'not-found'
type IconName =
  | 'search'
  | 'sun'
  | 'moon'
  | 'play'
  | 'heart'
  | 'message'
  | 'share'
  | 'bookmark'
  | 'arrow'
  | 'more'
  | 'volume'
  | 'expand'
  | 'pause'
  | 'chart'
  | 'file'
  | 'upload'
  | 'edit'
  | 'trash'
  | 'image'
  | 'link'
  | 'quote'
  | 'bold'
  | 'italic'
  | 'chevron'
  | 'check'
  | 'user'
  | 'settings'
  | 'logout'
  | 'lock'
  | 'mail'
  | 'bell'
  | 'friends'
  | 'send'
  | 'paperclip'

const photos = {
  train:
    'https://images.unsplash.com/photo-1559210184-48359006cdb4?auto=format&fit=crop&w=1600&q=88',
  tracks:
    'https://images.unsplash.com/photo-1785899593716-564f20ea62ac?auto=format&fit=crop&w=1400&q=85',
  village:
    'https://images.unsplash.com/photo-1787493504554-f7a067bfa656?auto=format&fit=crop&w=1200&q=85',
  study:
    'https://images.unsplash.com/photo-1758608631036-7a2370684905?auto=format&fit=crop&w=1200&q=85',
  books:
    'https://images.unsplash.com/photo-1763098844932-7240ee8ff180?auto=format&fit=crop&w=1200&q=85',
  pasta:
    'https://images.unsplash.com/photo-1727355819370-5646696bf71d?auto=format&fit=crop&w=1400&q=88',
  cooking:
    'https://images.unsplash.com/photo-1742197997971-133f6741720f?auto=format&fit=crop&w=1200&q=85',
}

const iconPaths: Record<IconName, ReactNode> = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" /></>,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
  play: <path d="m9 7 8 5-8 5V7Z" />,
  pause: <><path d="M9 8v8M15 8v8" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
  message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />,
  share: <><circle cx="18" cy="5" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="19" r="2" /><path d="m8 11 8-5M8 13l8 5" /></>,
  bookmark: <path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-4-6 4V4Z" />,
  arrow: <><path d="m15 18-6-6 6-6" /></>,
  more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  volume: <><path d="M11 5 6 9H2v6h4l5 4V5ZM15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" /></>,
  expand: <><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" /></>,
  chart: <><path d="M4 19V9M10 19V5M16 19v-7M22 19V2" /><path d="M2 19h22" /></>,
  file: <><path d="M6 2h8l4 4v16H6V2Z" /><path d="M14 2v5h5M9 13h6M9 17h5" /></>,
  upload: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M5 14v6h14v-6" /></>,
  edit: <><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" /><path d="m14 7 3 3" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m3 17 5-5 4 4 3-3 6 6" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1" /><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1" /></>,
  quote: <><path d="M9 11H4a5 5 0 0 1 5-5v12H4v-3M20 11h-5a5 5 0 0 1 5-5v12h-5v-3" /></>,
  bold: <><path d="M7 5h6a4 4 0 0 1 0 8H7V5ZM7 13h7a4 4 0 0 1 0 8H7v-8Z" /></>,
  italic: <><path d="M10 4h8M6 20h8M14 4 10 20" /></>,
  chevron: <path d="m8 10 4 4 4-4" />,
  check: <path d="m5 12 4 4L19 6" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M13 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
  friends: <><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M17 14a6 6 0 0 1 5 3" /></>,
  send: <><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></>,
  paperclip: <path d="m21.4 11.6-8.9 8.9a6 6 0 0 1-8.5-8.5l9.6-9.6a4 4 0 0 1 5.7 5.7l-9.6 9.6a2 2 0 1 1-2.8-2.8l8.9-8.9" />,
}

function Icon({ name, size = 20, fill = false }: { name: IconName; size?: number; fill?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  )
}

function Button({
  children,
  variant = 'primary',
  className = '',
  onClick,
  label,
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon'
  className?: string
  onClick?: () => void
  label?: string
}) {
  return (
    <button className={`button button-${variant} ${className}`} onClick={onClick} aria-label={label}>
      {children}
    </button>
  )
}

function Avatar({ initials, tone = 'navy', size = 'md' }: { initials: string; tone?: string; size?: 'sm' | 'md' | 'lg' }) {
  return <span className={`avatar avatar-${size} tone-${tone}`}>{initials}</span>
}

function Header({
  page,
  navigate,
  dark,
  setDark,
  query,
  setQuery,
}: {
  page: Page
  navigate: (page: Page) => void
  dark: boolean
  setDark: (value: boolean) => void
  query: string
  setQuery: (value: string) => void
}) {
  const [createOpen, setCreateOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notificationsRead, setNotificationsRead] = useState(false)
  const isCreatorPage = page === 'dashboard' || page === 'new-article' || page === 'upload-video'
  const go = (nextPage: Page) => {
    setCreateOpen(false)
    setAvatarOpen(false)
    setNotificationsOpen(false)
    navigate(nextPage)
  }
  return (
    <header className="site-header">
      <div className="nav-shell">
        <button className="brand" onClick={() => navigate('home')} aria-label="Inkreel home">
          <span className="brand-mark">i</span>
          <span>Inkreel</span>
        </button>
        {page === 'home' ? (
          <label className="search-box">
            <Icon name="search" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search stories, videos, creators..."
              aria-label="Search"
            />
            <kbd>⌘ K</kbd>
          </label>
        ) : isCreatorPage ? (
          <nav className="creator-nav" aria-label="Creator navigation">
            <button className={page === 'dashboard' ? 'active' : ''} onClick={() => navigate('dashboard')}>Dashboard</button>
            <button className={page === 'new-article' ? 'active' : ''} onClick={() => navigate('new-article')}>Write</button>
            <button className={page === 'upload-video' ? 'active' : ''} onClick={() => navigate('upload-video')}>Upload</button>
          </nav>
        ) : (
          <button className="back-link" onClick={() => navigate('home')}>
            <Icon name="arrow" size={18} /> Back to feed
          </button>
        )}
        <div className="nav-actions">
          <div className="menu-wrap">
            <Button
              variant="icon"
              className="notification-button"
              onClick={() => { setNotificationsOpen(!notificationsOpen); setAvatarOpen(false); setCreateOpen(false) }}
              label="Open notifications"
            >
              <Icon name="bell" size={19} />{!notificationsRead && <span className="notification-dot">4</span>}
            </Button>
            {notificationsOpen && (
              <div className={notificationsRead ? 'nav-menu notification-menu all-read' : 'nav-menu notification-menu'}>
                <div className="notification-heading"><strong>Notifications</strong><button onClick={() => setNotificationsRead(true)}>{notificationsRead ? 'All caught up' : 'Mark all read'}</button></div>
                <button onClick={() => go('profile')}><span className="notification-symbol"><Icon name="user" size={16} /></span><span><strong>Noah Williams followed you</strong><small>12 minutes ago</small></span><i /></button>
                <button onClick={() => go('article')}><span className="notification-symbol"><Icon name="message" size={16} /></span><span><strong>Elena commented on your story</strong><small>“This made me want to take the slow train…” · 1h</small></span><i /></button>
                <button onClick={() => go('video')}><span className="notification-symbol"><Icon name="heart" size={16} /></span><span><strong>Jonas liked your latest reel</strong><small>3 hours ago</small></span><i /></button>
                <button onClick={() => go('friends')}><span className="notification-symbol"><Icon name="friends" size={16} /></span><span><strong>Aisha sent you a friend request</strong><small>Yesterday</small></span><i /></button>
              </div>
            )}
          </div>
          <Button variant="icon" onClick={() => setDark(!dark)} label={dark ? 'Use light mode' : 'Use dark mode'}>
            <Icon name={dark ? 'sun' : 'moon'} size={19} />
          </Button>
          <div className="menu-wrap">
            <Button className="create-button" onClick={() => { setCreateOpen(!createOpen); setAvatarOpen(false); setNotificationsOpen(false) }}>
              Create <span>+</span>
            </Button>
            {createOpen && (
              <div className="nav-menu create-menu">
                <button onClick={() => go('new-article')}><Icon name="edit" size={18} /><span><strong>New article</strong><small>Write and publish a story</small></span></button>
                <button onClick={() => go('upload-video')}><Icon name="upload" size={18} /><span><strong>Upload video</strong><small>Share your latest reel</small></span></button>
              </div>
            )}
          </div>
          <div className="menu-wrap">
            <button className="avatar-button" onClick={() => { setAvatarOpen(!avatarOpen); setCreateOpen(false); setNotificationsOpen(false) }} aria-label="Open profile menu">
              <Avatar initials="MC" tone="amber" />
            </button>
            {avatarOpen && (
              <div className="nav-menu avatar-menu">
                <div className="menu-profile"><Avatar initials="MC" tone="amber" /><span><strong>Maya Chen</strong><small>@mayawanders</small></span></div>
                <button onClick={() => go('dashboard')}><Icon name="chart" size={17} />Creator dashboard</button>
                <button onClick={() => go('profile')}><Icon name="user" size={17} />View profile</button>
                <button onClick={() => go('friends')}><Icon name="friends" size={17} />Friends</button>
                <button onClick={() => go('messages')}><Icon name="mail" size={17} />Messages</button>
                <button onClick={() => go('settings')}><Icon name="settings" size={17} />Settings</button>
                <button onClick={() => go('new-article')}><Icon name="edit" size={17} />New article</button>
                <button onClick={() => go('upload-video')}><Icon name="upload" size={17} />Upload video</button>
                <button className="logout-menu-item" onClick={() => go('login')}><Icon name="logout" size={17} />Log out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

const feedItems = [
  { id: 1, type: 'video', category: 'Travel', image: photos.village, title: '48 Hours in Rural Japan', creator: 'Maya Chen', initials: 'MC', duration: '08:42', likes: '12.8k' },
  { id: 2, type: 'article', category: 'Study', image: photos.study, title: 'The quiet ritual that fixed my focus', excerpt: 'A gentler approach to deep work, built around attention instead of willpower.', creator: 'Noah Williams', initials: 'NW', meta: '6 min read · May 24' },
  { id: 3, type: 'article', category: 'Food', image: photos.pasta, title: 'Sunday pasta, made slowly', excerpt: 'A forgiving handmade pasta recipe for long afternoons and crowded tables.', creator: 'Elena Rossi', initials: 'ER', meta: '8 min read · May 22' },
  { id: 4, type: 'video', category: 'Lifestyle', image: photos.cooking, title: 'A Week of Simple Dinners', creator: 'Elena Rossi', initials: 'ER', duration: '12:16', likes: '8.4k' },
  { id: 5, type: 'video', category: 'Study', image: photos.books, title: 'My 6AM Library Routine', creator: 'Noah Williams', initials: 'NW', duration: '06:24', likes: '6.1k' },
  { id: 6, type: 'article', category: 'Travel', image: photos.tracks, title: 'Notes from the slow train north', excerpt: 'Small stations, window-seat lunches, and everything you notice when you stop rushing.', creator: 'Maya Chen', initials: 'MC', meta: '5 min read · May 18' },
]

function EmptyState({
  icon = 'file',
  title,
  description,
  action,
}: {
  icon?: IconName
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Icon name={icon} size={24} /></span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action && <div>{action}</div>}
    </div>
  )
}

function FeedSkeleton() {
  return (
    <section className="skeleton-grid" aria-label="Loading stories" aria-busy="true">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <div className={`skeleton-card skeleton-${item % 2 ? 'short' : 'tall'}`} key={item}>
          <span className="skeleton-media" />
          <div><i /><i /><i /></div>
        </div>
      ))}
    </section>
  )
}

function HomePage({
  navigate,
  query,
}: {
  navigate: (page: Page) => void
  query: string
}) {
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(true)
  const categories = ['All', 'Travel', 'Food', 'Tech', 'Lifestyle', 'Study']
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 850)
    return () => window.clearTimeout(timer)
  }, [])
  const filtered = useMemo(() => {
    return feedItems.filter((item) => {
      const matchesCategory = active === 'All' || item.category === active
      const haystack = `${item.title} ${item.creator} ${item.category}`.toLowerCase()
      return matchesCategory && haystack.includes(query.toLowerCase())
    })
  }, [active, query])

  return (
    <main className="feed-page">
      <section className="feed-intro">
        <div>
          <p className="eyebrow">Stories worth lingering over</p>
          <h1>Watch a little. <em>Read a little.</em></h1>
        </div>
        <p className="intro-copy">A thoughtful corner for people who capture life in frames and in words.</p>
      </section>
      <nav className="category-row" aria-label="Feed categories">
        {categories.map((category) => (
          <button key={category} className={active === category ? 'chip active' : 'chip'} onClick={() => setActive(category)}>
            {category}
          </button>
        ))}
      </nav>
      {loading ? (
        <FeedSkeleton />
      ) : filtered.length ? (
        <section className="masonry-grid" aria-label="Latest stories">
          {filtered.map((item) =>
            item.type === 'video' ? (
              <VideoCard item={item} key={item.id} onOpen={() => navigate('video')} />
            ) : (
              <ArticleCard item={item} key={item.id} onOpen={() => navigate('article')} />
            ),
          )}
        </section>
      ) : (
        <EmptyState icon="search" title="No stories found" description="Try another category or a broader search." />
      )}
    </main>
  )
}

function VideoCard({ item, onOpen }: { item: (typeof feedItems)[number]; onOpen: () => void }) {
  const [liked, setLiked] = useState(false)
  return (
    <article className="feed-card video-card">
      <button className="media-button portrait-media" onClick={onOpen} aria-label={`Watch ${item.title}`}>
        <img src={item.image} alt="" />
        <span className="media-scrim" />
        <span className="play-badge"><Icon name="play" size={24} fill /></span>
        <span className="duration">{item.duration}</span>
        <span className="category-label">{item.category}</span>
      </button>
      <div className="card-body">
        <button className="card-title-link" onClick={onOpen}><h2>{item.title}</h2></button>
        <div className="card-footer">
          <div className="creator">
            <Avatar initials={item.initials!} tone={item.id === 4 ? 'olive' : 'navy'} size="sm" />
            <span>{item.creator}</span>
          </div>
          <button className={liked ? 'mini-action liked' : 'mini-action'} onClick={() => setLiked(!liked)} aria-label="Like">
            <Icon name="heart" size={17} fill={liked} /> {liked ? '12.9k' : item.likes}
          </button>
        </div>
      </div>
    </article>
  )
}

function ArticleCard({ item, onOpen }: { item: (typeof feedItems)[number]; onOpen: () => void }) {
  return (
    <article className="feed-card article-card">
      <button className="media-button article-media" onClick={onOpen} aria-label={`Read ${item.title}`}>
        <img src={item.image} alt="" />
        <span className="category-label">{item.category}</span>
      </button>
      <div className="card-body">
        <button className="card-title-link" onClick={onOpen}><h2>{item.title}</h2></button>
        <p className="excerpt">{item.excerpt}</p>
        <div className="card-footer article-footer">
          <div className="creator">
            <Avatar initials={item.initials!} tone={item.id === 3 ? 'rose' : 'blue'} size="sm" />
            <span>{item.creator}</span>
          </div>
          <span className="card-meta">{item.meta}</span>
        </div>
      </div>
    </article>
  )
}

function FollowButton() {
  const [following, setFollowing] = useState(false)
  return (
    <Button variant={following ? 'secondary' : 'primary'} onClick={() => setFollowing(!following)}>
      {following ? 'Following' : 'Follow'}
    </Button>
  )
}

function ReactionButton({ icon, children }: { icon: IconName; children: ReactNode }) {
  const [active, setActive] = useState(false)
  return (
    <button className={active ? 'reaction active' : 'reaction'} onClick={() => setActive(!active)}>
      <Icon name={icon} size={20} fill={active && (icon === 'heart' || icon === 'bookmark')} />
      <span>{children}</span>
    </button>
  )
}

function AuthorRow() {
  return (
    <div className="author-row">
      <div className="author-info">
        <Avatar initials="MC" tone="amber" size="lg" />
        <div>
          <strong>Maya Chen</strong>
          <span>Travel filmmaker & writer · May 28</span>
        </div>
      </div>
      <FollowButton />
    </div>
  )
}

function Comments() {
  return (
    <section className="comments-section">
      <div className="section-heading">
        <h2>Conversation</h2>
        <span>24 comments</span>
      </div>
      <div className="comment-composer">
        <Avatar initials="YO" tone="cream" />
        <button>Join the conversation...</button>
      </div>
      <div className="comment">
        <Avatar initials="JM" tone="blue" />
        <div>
          <div className="comment-name"><strong>Jonas Miller</strong><span>2 hours ago</span></div>
          <p>This made me want to book the slowest train I can find. The part about leaving room for surprise really stayed with me.</p>
          <button className="text-action">Reply</button>
        </div>
      </div>
      <div className="comment">
        <Avatar initials="AK" tone="rose" />
        <div>
          <div className="comment-name"><strong>Aisha Khan</strong><span>5 hours ago</span></div>
          <p>Your framing is beautiful, but I loved the written details even more. Please make this a series.</p>
          <button className="text-action">Reply</button>
        </div>
      </div>
    </section>
  )
}

function ArticlePage() {
  return (
    <main className="article-page">
      <section className="article-hero">
        <p className="eyebrow">Travel · Field notes</p>
        <h1>The long way north: notes from Japan’s quietest train</h1>
        <p className="article-deck">On trading an itinerary for an open window, a paper map, and the particular joy of not knowing what comes next.</p>
        <AuthorRow />
      </section>
      <div className="article-cover">
        <img src={photos.train} alt="A red local train winding through a lush Japanese landscape" />
        <span>Somewhere north of Kyoto, where the timetable begins to loosen.</span>
      </div>
      <div className="article-layout">
        <aside className="article-actions">
          <ReactionButton icon="heart">2.8k</ReactionButton>
          <ReactionButton icon="message">24</ReactionButton>
          <ReactionButton icon="bookmark">Save</ReactionButton>
        </aside>
        <article className="article-copy">
          <p className="lead">The train arrived without announcement, two red carriages humming at the edge of the platform. I had no reservation and, for once, nowhere I needed to be before dark.</p>
          <p>Most travel plans begin as a list. Mine had become one too: temples before nine, noodles at noon, the right hillside at sunset. It was efficient and oddly airless. So on the fifth morning, I folded the list into a square and left it beneath my coffee cup.</p>
          <h2>A window, left open</h2>
          <p>The local line ran north through fields the color of green tea. At every stop, one or two people stepped off. A student in a navy uniform. An old man carrying leeks wrapped in newspaper. A woman who bowed to the driver before crossing the empty tracks.</p>
          <blockquote>“The best journeys leave enough white space for the place to write back.”</blockquote>
          <p>I started recording the small things I would normally miss: the click of the conductor’s brass punch, curtains breathing from an open window, persimmons lined up on a station bench with a handwritten honesty box.</p>
          <figure>
            <img src={photos.tracks} alt="Quiet rural railway tracks and crossing signals" />
            <figcaption>The last crossing before the mountains, 4:17 in the afternoon.</figcaption>
          </figure>
          <h2>What the camera doesn’t keep</h2>
          <p>I filmed a great deal that day, but the moments I remember best never made it into the vlog. They live somewhere between image and sentence: too quiet for one, too bright for the other.</p>
          <p>By dusk, the train had carried me farther north than I intended. I found a room above a bakery, ate two warm buns for dinner, and watched the last local return south without me.</p>
          <div className="article-end">End note</div>
        </article>
      </div>
      <div className="content-width"><Comments /></div>
    </main>
  )
}

function VideoPlayer() {
  const [playing, setPlaying] = useState(false)
  return (
    <button className="video-player" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause video' : 'Play video'}>
      <img src={photos.village} alt="Rural Japanese village and rice fields" />
      <span className="video-overlay" />
      {!playing && <span className="large-play"><Icon name="play" size={34} fill /></span>}
      <span className="player-controls">
        <Icon name={playing ? 'pause' : 'play'} size={20} fill />
        <span>0:00</span>
        <span className="progress"><i /></span>
        <span>8:42</span>
        <Icon name="volume" size={19} />
        <Icon name="expand" size={18} />
      </span>
    </button>
  )
}

function VideoPage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <main className="video-page">
      <div className="video-layout">
        <section className="video-primary">
          <VideoPlayer />
          <p className="eyebrow video-eyebrow">Travel vlog · Japan</p>
          <h1>48 Hours in Rural Japan</h1>
          <div className="video-byline">
            <div className="author-info">
              <Avatar initials="MC" tone="amber" size="lg" />
              <div><strong>Maya Chen</strong><span>184k followers</span></div>
            </div>
            <FollowButton />
          </div>
          <div className="video-actions">
            <ReactionButton icon="heart">12.8k</ReactionButton>
            <ReactionButton icon="share">Share</ReactionButton>
            <ReactionButton icon="bookmark">Save</ReactionButton>
            <Button variant="icon" label="More options"><Icon name="more" /></Button>
          </div>
          <div className="video-description">
            <strong>124k views · 3 days ago</strong>
            <p>Two days, one local train, and no fixed plan. Come along as I explore mountain villages, tiny stations, and the quiet food counters of rural Japan.</p>
            <button>Read the full field notes <span>→</span></button>
          </div>
          <Comments />
        </section>
        <aside className="related">
          <div className="section-heading">
            <h2>More from Inkreel</h2>
          </div>
          <RelatedItem image={photos.pasta} title="Sunday pasta, made slowly" meta="Elena Rossi · 8 min read" onClick={() => navigate('article')} />
          <RelatedItem image={photos.books} title="My 6AM library routine" meta="Noah Williams · 6:24" />
          <RelatedItem image={photos.tracks} title="The night train to nowhere" meta="Maya Chen · 10:08" />
          <RelatedItem image={photos.cooking} title="A week of simple dinners" meta="Elena Rossi · 12:16" />
        </aside>
      </div>
    </main>
  )
}

function RelatedItem({ image, title, meta, onClick }: { image: string; title: string; meta: string; onClick?: () => void }) {
  return (
    <button className="related-item" onClick={onClick}>
      <span><img src={image} alt="" /><i><Icon name="play" size={16} fill /></i></span>
      <span><strong>{title}</strong><small>{meta}</small></span>
    </button>
  )
}

function CreatorPageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <div className="creator-page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="heading-actions">{actions}</div>}
    </div>
  )
}

const initialPosts = [
  { id: 1, title: '48 Hours in Rural Japan', type: 'Video', status: 'Published', views: '124,820', likes: '12,843', image: photos.village },
  { id: 2, title: 'The long way north', type: 'Article', status: 'Published', views: '38,240', likes: '2,841', image: photos.train },
  { id: 3, title: 'What the camera doesn’t keep', type: 'Article', status: 'Draft', views: '—', likes: '—', image: photos.tracks },
  { id: 4, title: 'Morning markets of Kyoto', type: 'Video', status: 'Draft', views: '—', likes: '—', image: photos.cooking },
]

function DashboardPage({ navigate }: { navigate: (page: Page) => void }) {
  const [posts, setPosts] = useState(initialPosts)
  const stats = [
    { label: 'Total views', value: '486.2k', change: '+18.4%', icon: 'chart' as IconName },
    { label: 'Likes', value: '42.8k', change: '+12.1%', icon: 'heart' as IconName },
    { label: 'Comments', value: '3,294', change: '+8.7%', icon: 'message' as IconName },
    { label: 'Followers', value: '184.3k', change: '+4.2%', icon: 'file' as IconName },
  ]

  return (
    <main className="creator-page">
      <CreatorPageHeading
        eyebrow="Creator studio"
        title="Good morning, Maya."
        description="Here’s how your stories have been doing over the last 30 days."
        actions={<><Button variant="secondary" onClick={() => navigate('new-article')}><Icon name="edit" size={17} />Write</Button><Button onClick={() => navigate('upload-video')}><Icon name="upload" size={17} />Upload</Button></>}
      />
      <section className="stat-grid" aria-label="Creator summary">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <div><span className="stat-icon"><Icon name={stat.icon} size={19} /></span><span className="stat-change">{stat.change}</span></div>
            <strong>{stat.value}</strong>
            <p>{stat.label}</p>
          </article>
        ))}
      </section>
      <section className="analytics-card">
        <div className="analytics-heading">
          <div><h2>Views over time</h2><p>Across articles and videos</p></div>
          <span>Last 30 days <Icon name="chevron" size={15} /></span>
        </div>
        <div className="chart-wrap">
          <div className="chart-y"><span>24k</span><span>16k</span><span>8k</span><span>0</span></div>
          <svg viewBox="0 0 900 240" preserveAspectRatio="none" role="img" aria-label="Line chart showing a rising trend in views">
            <g className="chart-grid"><path d="M0 20H900M0 87H900M0 154H900M0 220H900" /></g>
            <polyline points="0,194 35,184 70,190 105,162 140,170 175,146 210,154 245,121 280,131 315,105 350,116 385,92 420,110 455,79 490,88 525,54 560,73 595,46 630,62 665,34 700,49 735,25 770,41 805,18 840,37 875,14 900,24" />
            <circle cx="875" cy="14" r="5" />
          </svg>
          <div className="chart-x"><span>May 1</span><span>May 8</span><span>May 15</span><span>May 22</span><span>May 30</span></div>
        </div>
      </section>
      <section className="posts-card">
        <div className="analytics-heading">
          <div><h2>Your posts</h2><p>{posts.length} stories in your library</p></div>
          <Button variant="secondary" onClick={() => navigate('new-article')}>New post <span>+</span></Button>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Post</th><th>Type</th><th>Status</th><th>Views</th><th>Likes</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td><div className="post-cell"><img src={post.image} alt="" /><strong>{post.title}</strong></div></td>
                  <td><span className="type-cell"><Icon name={post.type === 'Video' ? 'play' : 'file'} size={15} />{post.type}</span></td>
                  <td><span className={`status-pill ${post.status.toLowerCase()}`}>{post.status}</span></td>
                  <td>{post.views}</td><td>{post.likes}</td>
                  <td><div className="table-actions"><button onClick={() => navigate(post.type === 'Video' ? 'upload-video' : 'new-article')} aria-label={`Edit ${post.title}`}><Icon name="edit" size={16} /></button><button onClick={() => setPosts(posts.filter((item) => item.id !== post.id))} aria-label={`Delete ${post.title}`}><Icon name="trash" size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

function FormField({ label, hint, children, className = '' }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`form-field ${className}`}>
      <span>{label}{hint && <small>{hint}</small>}</span>
      {children}
    </label>
  )
}

function PublishBar({ onSave, onPublish, status }: { onSave: () => void; onPublish: () => void; status: string }) {
  return (
    <div className="publish-bar">
      <span className={status ? 'save-state visible' : 'save-state'}>{status && <><Icon name="check" size={15} />{status}</>}</span>
      <Button variant="secondary" onClick={onSave}>Save draft</Button>
      <Button onClick={onPublish}>Publish</Button>
    </div>
  )
}

function NewArticlePage() {
  const [cover, setCover] = useState<string>('')
  const [tags, setTags] = useState('slow travel, japan')
  const [status, setStatus] = useState('')
  const announce = (message: string) => {
    setStatus(message)
    window.setTimeout(() => setStatus(''), 2500)
  }
  const addCover = (file?: File) => {
    if (file) setCover(URL.createObjectURL(file))
  }
  const format = (command: string) => {
    if (command === 'createLink') {
      const url = window.prompt('Paste a link')
      if (url) document.execCommand(command, false, url)
    } else {
      document.execCommand(command)
    }
  }

  return (
    <main className="creator-page editor-page">
      <CreatorPageHeading eyebrow="New story" title="Write an article" description="Shape an idea into something worth lingering over." />
      <div className="editor-layout">
        <section className="editor-main">
          <FormField label="Title">
            <input className="title-input" placeholder="Give your story a memorable title" />
          </FormField>
          <FormField label="Cover image" hint="Recommended 1600 × 900">
            <span className={cover ? 'cover-upload has-image' : 'cover-upload'}>
              {cover ? <img src={cover} alt="Selected article cover preview" /> : <><span className="upload-icon"><Icon name="image" size={24} /></span><strong>Add a cover image</strong><small>JPEG, PNG or WebP up to 10 MB</small></>}
              <input type="file" accept="image/*" onChange={(event) => addCover(event.target.files?.[0])} />
              {cover && <i>Change image</i>}
            </span>
          </FormField>
          <div className="form-field">
            <span>Story</span>
            <div className="rich-editor">
              <div className="editor-toolbar" aria-label="Text formatting">
                <select onChange={(event) => document.execCommand('formatBlock', false, event.target.value)} aria-label="Text style" defaultValue="p">
                  <option value="p">Paragraph</option><option value="h2">Heading</option>
                </select>
                <i />
                <button onClick={() => format('bold')} aria-label="Bold"><Icon name="bold" size={17} /></button>
                <button onClick={() => format('italic')} aria-label="Italic"><Icon name="italic" size={17} /></button>
                <button onClick={() => document.execCommand('formatBlock', false, 'blockquote')} aria-label="Quote"><Icon name="quote" size={17} /></button>
                <i />
                <button onClick={() => format('createLink')} aria-label="Add link"><Icon name="link" size={17} /></button>
                <button onClick={() => document.getElementById('inline-image')?.click()} aria-label="Add image"><Icon name="image" size={17} /></button>
                <input
                  id="inline-image"
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const image = event.target.files?.[0]
                    if (image) document.execCommand('insertImage', false, URL.createObjectURL(image))
                  }}
                />
              </div>
              <div className="editor-canvas" contentEditable suppressContentEditableWarning data-placeholder="Start writing your story...">
                <p>There is a moment on every journey when the plan gives way to the place.</p>
              </div>
              <div className="word-count">12 words</div>
            </div>
          </div>
        </section>
        <aside className="editor-settings">
          <h2>Story settings</h2>
          <FormField label="Category">
            <select defaultValue="Travel"><option>Travel</option><option>Food</option><option>Tech</option><option>Lifestyle</option><option>Study</option></select>
          </FormField>
          <FormField label="Tags" hint="Separate with commas">
            <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Add tags" />
          </FormField>
          <div className="tag-preview">
            {tags.split(',').filter(Boolean).map((tag) => <span key={tag}>{tag.trim()}</span>)}
          </div>
          <div className="editor-note"><Icon name="file" size={18} /><p><strong>A thoughtful title helps.</strong> Titles between 40–60 characters tend to invite more readers in.</p></div>
        </aside>
      </div>
      <PublishBar status={status} onSave={() => announce('Draft saved')} onPublish={() => announce('Article published')} />
    </main>
  )
}

function UploadVideoPage() {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [thumbnail, setThumbnail] = useState(0)

  useEffect(() => {
    if (!file || progress >= 100) return
    const timer = window.setInterval(() => setProgress((value) => Math.min(value + 4, 100)), 90)
    return () => window.clearInterval(timer)
  }, [file, progress])

  const chooseFile = (selected?: File) => {
    if (selected) {
      setFile(selected)
      setProgress(0)
    }
  }
  const announce = (message: string) => {
    setStatus(message)
    window.setTimeout(() => setStatus(''), 2500)
  }

  return (
    <main className="creator-page editor-page">
      <CreatorPageHeading eyebrow="New reel" title="Upload a video" description="Bring your latest story to life, one frame at a time." />
      <div className="upload-layout">
        <section className="upload-main">
          <FormField label="Video file">
            <span
              className={file ? 'video-dropzone has-file' : 'video-dropzone'}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]) }}
            >
              <input type="file" accept="video/*" onChange={(event) => chooseFile(event.target.files?.[0])} />
              <span className="upload-icon"><Icon name={file ? 'check' : 'upload'} size={25} /></span>
              {file ? <><strong>{file.name}</strong><small>{progress < 100 ? 'Uploading your video…' : 'Upload complete · Ready to publish'}</small></> : <><strong>Drop your video here</strong><small>or click to browse · MP4, MOV up to 5 GB</small></>}
              {file && <span className="upload-progress"><progress value={progress} max={100} /><em>{progress}%</em></span>}
            </span>
          </FormField>
          <div className="form-grid">
            <FormField label="Title"><input placeholder="Name your video" /></FormField>
            <FormField label="Category"><select defaultValue="Travel"><option>Travel</option><option>Food</option><option>Tech</option><option>Lifestyle</option><option>Study</option></select></FormField>
          </div>
          <FormField label="Caption" hint="0 / 500">
            <textarea placeholder="Tell viewers what this reel is about..." rows={5} />
          </FormField>
          <FormField label="Thumbnail" hint="Choose a frame or upload your own">
            <span className="thumbnail-grid">
              {[photos.village, photos.tracks, photos.train].map((image, index) => (
                <button key={image} className={thumbnail === index ? 'selected' : ''} onClick={() => setThumbnail(index)}>
                  <img src={image} alt={`Thumbnail option ${index + 1}`} />{thumbnail === index && <i><Icon name="check" size={15} /></i>}
                </button>
              ))}
              <label className="custom-thumbnail"><Icon name="image" size={20} /><span>Upload</span><input type="file" accept="image/*" /></label>
            </span>
          </FormField>
        </section>
        <aside className="upload-tips">
          <h2>Before you publish</h2>
          <ul><li><Icon name="check" size={15} />Use a clear, inviting thumbnail</li><li><Icon name="check" size={15} />Keep titles concise and specific</li><li><Icon name="check" size={15} />Add a category to help discovery</li><li><Icon name="check" size={15} />Review your caption and credits</li></ul>
          <div className="editor-note"><Icon name="upload" size={18} /><p>Uploads continue while you fill in the details. You can safely save as a draft at any time.</p></div>
        </aside>
      </div>
      <PublishBar status={status} onSave={() => announce('Video draft saved')} onPublish={() => announce('Video published')} />
    </main>
  )
}

const people = [
  { id: 1, name: 'Noah Williams', username: '@noahstudies', initials: 'NW', tone: 'blue', note: 'Study filmmaker in London' },
  { id: 2, name: 'Elena Rossi', username: '@elenacooks', initials: 'ER', tone: 'rose', note: 'Food stories from Florence' },
  { id: 3, name: 'Jonas Miller', username: '@jonasoutside', initials: 'JM', tone: 'olive', note: 'Hiking, film and field notes' },
  { id: 4, name: 'Priya Shah', username: '@priyamakes', initials: 'PS', tone: 'navy', note: 'Designing a slower life' },
  { id: 5, name: 'Aisha Khan', username: '@aishawanders', initials: 'AK', tone: 'amber', note: 'Sent a request two days ago' },
  { id: 6, name: 'Theo Park', username: '@theopark', initials: 'TP', tone: 'blue', note: 'Sent a request last week' },
  { id: 7, name: 'Sofia Bell', username: '@sofiainframes', initials: 'SB', tone: 'rose', note: '12 mutual friends' },
  { id: 8, name: 'Liam Brooks', username: '@liamwanders', initials: 'LB', tone: 'olive', note: '8 mutual friends' },
  { id: 9, name: 'Hana Ito', username: '@hanaonfilm', initials: 'HI', tone: 'navy', note: '21 mutual friends' },
]

function FriendsPage({ navigate }: { navigate: (page: Page) => void }) {
  const [tab, setTab] = useState<'Friends' | 'Requests' | 'Find people'>('Friends')
  const [relations, setRelations] = useState<Record<number, 'friend' | 'request' | 'none'>>({
    1: 'friend', 2: 'friend', 3: 'friend', 4: 'friend', 5: 'request', 6: 'request', 7: 'none', 8: 'none', 9: 'none',
  })
  const visible = people.filter((person) => tab === 'Friends' ? relations[person.id] === 'friend' : tab === 'Requests' ? relations[person.id] === 'request' : relations[person.id] === 'none')
  const update = (id: number, status: 'friend' | 'none') => setRelations({ ...relations, [id]: status })

  return (
    <main className="social-page">
      <CreatorPageHeading
        eyebrow="Your circle"
        title="Friends"
        description="Keep up with the people who make Inkreel feel like home."
        actions={<Button variant="secondary" onClick={() => navigate('messages')}><Icon name="mail" size={17} />Messages</Button>}
      />
      <section className="people-card">
        <nav className="people-tabs" aria-label="Friend lists">
          {(['Friends', 'Requests', 'Find people'] as const).map((item) => (
            <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>
              {item}
              <span>{item === 'Friends' ? Object.values(relations).filter((value) => value === 'friend').length : item === 'Requests' ? Object.values(relations).filter((value) => value === 'request').length : ''}</span>
            </button>
          ))}
        </nav>
        <div className="people-list">
          {visible.length ? visible.map((person) => (
            <article className="person-row" key={person.id}>
              <button className="person-profile" onClick={() => navigate('profile')}>
                <Avatar initials={person.initials} tone={person.tone} size="lg" />
                <span><strong>{person.name}</strong><small>{person.username}</small><em>{person.note}</em></span>
              </button>
              <div className="person-actions">
                {tab === 'Friends' && <><Button variant="secondary" onClick={() => navigate('messages')}>Message</Button><Button variant="ghost" className="remove-button" onClick={() => update(person.id, 'none')}>Remove</Button></>}
                {tab === 'Requests' && <><Button onClick={() => update(person.id, 'friend')}>Accept</Button><Button variant="secondary" onClick={() => update(person.id, 'none')}>Decline</Button></>}
                {tab === 'Find people' && <Button onClick={() => update(person.id, 'friend')}>Add friend</Button>}
              </div>
            </article>
          )) : <EmptyState icon="friends" title="All caught up" description="There’s no one waiting here right now." />}
        </div>
      </section>
    </main>
  )
}

const conversations = [
  { id: 1, name: 'Elena Rossi', initials: 'ER', tone: 'rose', preview: 'The station café sounds perfect.', time: '2m', unread: 2, online: true },
  { id: 2, name: 'Noah Williams', initials: 'NW', tone: 'blue', preview: 'I’ll send the reading list tonight!', time: '38m', unread: 0, online: true },
  { id: 3, name: 'Aisha Khan', initials: 'AK', tone: 'amber', preview: 'That last frame was beautiful.', time: '3h', unread: 1, online: false },
  { id: 4, name: 'Jonas Miller', initials: 'JM', tone: 'olive', preview: 'Are you free to film next weekend?', time: 'Tue', unread: 0, online: false },
  { id: 5, name: 'Priya Shah', initials: 'PS', tone: 'navy', preview: 'Loved your notes from Kyoto.', time: 'Sun', unread: 0, online: false },
]

type ChatMessage = { id: number; mine: boolean; text: string; time: string }

const initialThreads: Record<number, ChatMessage[]> = {
  1: [
    { id: 1, mine: false, text: 'Your new train film made my whole morning. The pacing is so lovely.', time: '10:24 AM' },
    { id: 2, mine: true, text: 'That means so much coming from you. I nearly cut the station scene!', time: '10:27 AM' },
    { id: 3, mine: false, text: 'I’m so glad you kept it. Where was the little café near the end?', time: '10:31 AM' },
    { id: 4, mine: true, text: 'Two stops north of Kyoto. I’ll send you the pin — the owner makes the best tamago sandwich.', time: '10:33 AM' },
    { id: 5, mine: false, text: 'The station café sounds perfect. Adding it to my list right now.', time: '10:34 AM' },
  ],
  2: [{ id: 1, mine: false, text: 'I found a few essays you might like for the focus piece.', time: 'Yesterday' }, { id: 2, mine: true, text: 'Please send them over when you have a moment!', time: 'Yesterday' }],
  3: [{ id: 1, mine: false, text: 'That last frame was beautiful. It felt like a memory.', time: 'Monday' }],
  4: [{ id: 1, mine: false, text: 'Are you free to film next weekend?', time: 'Tuesday' }],
  5: [{ id: 1, mine: false, text: 'Loved your notes from Kyoto.', time: 'Sunday' }],
}

function MessagesPage() {
  const [selected, setSelected] = useState(1)
  const [threads, setThreads] = useState(initialThreads)
  const [draft, setDraft] = useState('')
  const [panelNotice, setPanelNotice] = useState('')
  const conversation = conversations.find((item) => item.id === selected)!
  const send = () => {
    if (!draft.trim()) return
    setThreads({ ...threads, [selected]: [...threads[selected], { id: Date.now(), mine: true, text: draft.trim(), time: 'Now' }] })
    setDraft('')
  }
  const attach = (file?: File) => {
    if (!file) return
    setThreads({ ...threads, [selected]: [...threads[selected], { id: Date.now(), mine: true, text: `Shared an image: ${file.name}`, time: 'Now' }] })
  }
  const notify = (message: string) => {
    setPanelNotice(message)
    window.setTimeout(() => setPanelNotice(''), 1800)
  }

  return (
    <main className="messages-page">
      <div className="messages-shell">
        <aside className="conversation-panel">
          <div className="conversation-heading"><div><p className="eyebrow">Your circle</p><h1>Messages</h1></div><button onClick={() => notify('Choose a friend to start a conversation')} aria-label="New message"><Icon name="edit" size={18} /></button></div>
          <label className="conversation-search"><Icon name="search" size={16} /><input placeholder="Search conversations" /></label>
          <div className="conversation-list">
            {conversations.map((item) => (
              <button key={item.id} className={selected === item.id ? 'conversation-item active' : 'conversation-item'} onClick={() => setSelected(item.id)}>
                <span className="conversation-avatar"><Avatar initials={item.initials} tone={item.tone} />{item.online && <i />}</span>
                <span className="conversation-copy"><span><strong>{item.name}</strong><time>{item.time}</time></span><small>{item.preview}</small></span>
                {item.unread > 0 && <em>{item.unread}</em>}
              </button>
            ))}
          </div>
        </aside>
        <section className="chat-panel">
          <header className="chat-header">
            <span className="conversation-avatar"><Avatar initials={conversation.initials} tone={conversation.tone} />{conversation.online && <i />}</span>
            <div><strong>{conversation.name}</strong><small>{conversation.online ? 'Online now' : 'Last seen recently'}</small></div>
            <button onClick={() => notify('Conversation options opened')} aria-label="Conversation options"><Icon name="more" size={20} /></button>
          </header>
          <div className="chat-thread">
            <span className="chat-date">Today</span>
            {threads[selected].map((message) => (
              <div className={message.mine ? 'message-row mine' : 'message-row'} key={message.id}>
                {!message.mine && <Avatar initials={conversation.initials} tone={conversation.tone} size="sm" />}
                <div><p>{message.text}</p><time>{message.time}</time></div>
              </div>
            ))}
          </div>
          <form className="message-composer" onSubmit={(event) => { event.preventDefault(); send() }}>
            <label className="attach-button" aria-label="Attach an image"><Icon name="paperclip" size={20} /><input type="file" accept="image/*" onChange={(event) => attach(event.target.files?.[0])} /></label>
            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Message ${conversation.name.split(' ')[0]}…`} />
            <button type="submit" aria-label="Send message"><Icon name="send" size={18} /></button>
          </form>
          <span className={panelNotice ? 'chat-notice visible' : 'chat-notice'}>{panelNotice}</span>
        </section>
      </div>
    </main>
  )
}

function AuthPage({ mode, navigate }: { mode: 'login' | 'signup'; navigate: (page: Page) => void }) {
  const isLogin = mode === 'login'
  const [showPassword, setShowPassword] = useState(false)
  return (
    <main className="auth-page">
      <button className="brand auth-brand" onClick={() => navigate('home')} aria-label="Inkreel home">
        <span className="brand-mark">i</span><span>Inkreel</span>
      </button>
      <section className="auth-card">
        <p className="eyebrow">{isLogin ? 'Welcome back' : 'Join the story'}</p>
        <h1>{isLogin ? 'Log in to Inkreel' : 'Create your account'}</h1>
        <p className="auth-intro">{isLogin ? 'Your next story is waiting right where you left it.' : 'A home for the moments you film and the stories you write.'}</p>
        <form onSubmit={(event) => { event.preventDefault(); navigate(isLogin ? 'home' : 'profile') }}>
          <FormField label="Email address">
            <span className="auth-input"><Icon name="mail" size={17} /><input type="email" placeholder="you@example.com" required /></span>
          </FormField>
          <FormField label="Password">
            <span className="auth-input"><Icon name="lock" size={17} /><input type={showPassword ? 'text' : 'password'} placeholder={isLogin ? 'Enter your password' : 'At least 8 characters'} minLength={8} required /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></span>
          </FormField>
          {isLogin && <button type="button" className="forgot-link">Forgot password?</button>}
          <button className="auth-continue" type="submit">Continue <span>→</span></button>
        </form>
        <p className="auth-switch">
          {isLogin ? 'New to Inkreel?' : 'Already have an account?'}
          <button onClick={() => navigate(isLogin ? 'signup' : 'login')}>{isLogin ? 'Sign up' : 'Log in'}</button>
        </p>
      </section>
      <p className="auth-note">By continuing, you agree to our Terms and Privacy Policy.</p>
    </main>
  )
}

const profileVideos = [
  { image: photos.village, title: '48 Hours in Rural Japan', meta: '124k views · 8:42' },
  { image: photos.tracks, title: 'The Night Train to Nowhere', meta: '86k views · 10:08' },
  { image: photos.cooking, title: 'Morning Markets of Kyoto', meta: '54k views · 6:16' },
]
const profileArticles = [
  { image: photos.train, title: 'The long way north', meta: '6 min read · May 28' },
  { image: photos.books, title: 'What the camera doesn’t keep', meta: '5 min read · May 16' },
  { image: photos.study, title: 'On making room for surprise', meta: '8 min read · Apr 30' },
]

function ProfileContentCard({ item, type, navigate }: { item: (typeof profileVideos)[number]; type: 'video' | 'article'; navigate: (page: Page) => void }) {
  return (
    <button className="profile-content-card" onClick={() => navigate(type)}>
      <span className="profile-card-media">
        <img src={item.image} alt="" />
        {type === 'video' && <i><Icon name="play" size={20} fill /></i>}
      </span>
      <strong>{item.title}</strong>
      <small>{item.meta}</small>
    </button>
  )
}

function ProfilePage({ navigate }: { navigate: (page: Page) => void }) {
  const [tab, setTab] = useState<'Videos' | 'Articles' | 'Saved'>('Videos')
  const [following, setFollowing] = useState(false)
  const items = tab === 'Videos' ? profileVideos : tab === 'Articles' ? profileArticles : []
  return (
    <main className="profile-page">
      <section className="profile-banner">
        <img src={photos.train} alt="A red train passing through green countryside" />
      </section>
      <section className="profile-header">
        <div className="profile-avatar">MC</div>
        <div className="profile-primary">
          <div>
            <h1>Maya Chen</h1>
            <span>@mayawanders</span>
          </div>
          <Button variant={following ? 'secondary' : 'primary'} onClick={() => setFollowing(!following)}>{following ? 'Following' : 'Follow'}</Button>
        </div>
        <p>Travel filmmaker and field-note collector. I take the slow way, film the quiet parts, and write down what the camera misses.</p>
        <div className="profile-counts">
          <span><strong>184k</strong> followers</span>
          <span><strong>328</strong> following</span>
          <span><strong>42</strong> stories</span>
        </div>
      </section>
      <section className="profile-content">
        <nav className="profile-tabs" aria-label="Profile content">
          {(['Videos', 'Articles', 'Saved'] as const).map((item) => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}<span>{item === 'Videos' ? 18 : item === 'Articles' ? 24 : 0}</span></button>)}
        </nav>
        {items.length ? (
          <div className="profile-grid">{items.map((item) => <ProfileContentCard key={item.title} item={item} type={tab === 'Videos' ? 'video' : 'article'} navigate={navigate} />)}</div>
        ) : (
          <EmptyState icon="bookmark" title="No posts here yet" description="Stories you save will appear here, ready for a quiet moment." action={<Button variant="secondary" onClick={() => navigate('home')}>Explore the feed</Button>} />
        )}
      </section>
    </main>
  )
}

function SettingsPage({ dark, setDark, navigate }: { dark: boolean; setDark: (value: boolean) => void; navigate: (page: Page) => void }) {
  const [status, setStatus] = useState('')
  const save = (message: string) => {
    setStatus(message)
    window.setTimeout(() => setStatus(''), 2200)
  }
  return (
    <main className="settings-page">
      <CreatorPageHeading eyebrow="Your account" title="Settings" description="Make Inkreel feel like yours." />
      <div className="settings-layout">
        <nav className="settings-nav">
          <button onClick={() => document.getElementById('edit-profile')?.scrollIntoView({ behavior: 'smooth' })}><Icon name="user" size={17} />Edit profile</button>
          <button onClick={() => document.getElementById('password')?.scrollIntoView({ behavior: 'smooth' })}><Icon name="lock" size={17} />Password</button>
          <button onClick={() => document.getElementById('appearance')?.scrollIntoView({ behavior: 'smooth' })}><Icon name="sun" size={17} />Appearance</button>
        </nav>
        <div className="settings-content">
          <section className="settings-card" id="edit-profile">
            <div className="settings-title"><h2>Edit profile</h2><p>Update how you appear across Inkreel.</p></div>
            <div className="settings-avatar-row"><Avatar initials="MC" tone="amber" size="lg" /><div><Button variant="secondary">Change photo</Button><small>JPG or PNG, up to 5 MB</small></div></div>
            <div className="form-grid">
              <FormField label="Display name"><input defaultValue="Maya Chen" /></FormField>
              <FormField label="Username"><input defaultValue="@mayawanders" /></FormField>
            </div>
            <FormField label="Bio" hint="132 / 160"><textarea rows={4} defaultValue="Travel filmmaker and field-note collector. I take the slow way, film the quiet parts, and write down what the camera misses." /></FormField>
            <div className="settings-actions"><Button onClick={() => save('Profile saved')}>Save changes</Button></div>
          </section>
          <section className="settings-card" id="password">
            <div className="settings-title"><h2>Change password</h2><p>Choose a strong password you don’t use elsewhere.</p></div>
            <FormField label="Current password"><input type="password" placeholder="Current password" /></FormField>
            <div className="form-grid">
              <FormField label="New password"><input type="password" placeholder="At least 8 characters" /></FormField>
              <FormField label="Confirm new password"><input type="password" placeholder="Repeat new password" /></FormField>
            </div>
            <div className="settings-actions"><Button onClick={() => save('Password updated')}>Update password</Button></div>
          </section>
          <section className="settings-card" id="appearance">
            <div className="settings-title"><h2>Appearance</h2><p>Choose the reading experience that suits you.</p></div>
            <div className="theme-options">
              <button className={!dark ? 'active' : ''} onClick={() => setDark(false)}><span className="theme-preview light"><i /><i /><i /></span><span><Icon name="sun" size={16} />Light</span></button>
              <button className={dark ? 'active' : ''} onClick={() => setDark(true)}><span className="theme-preview dark"><i /><i /><i /></span><span><Icon name="moon" size={16} />Dark</span></button>
            </div>
          </section>
          <section className="settings-card logout-card">
            <div className="settings-title"><h2>Log out</h2><p>You can always come back to your stories.</p></div>
            <Button variant="secondary" onClick={() => navigate('login')}><Icon name="logout" size={16} />Log out</Button>
          </section>
        </div>
      </div>
      <span className={status ? 'settings-toast visible' : 'settings-toast'}><Icon name="check" size={16} />{status}</span>
    </main>
  )
}

function NotFoundPage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <main className="not-found-page">
      <span className="not-found-number">404</span>
      <p className="eyebrow">A blank page</p>
      <h1>This story wandered off.</h1>
      <p>The page you’re looking for may have moved, or perhaps it’s still being written.</p>
      <Button onClick={() => navigate('home')}><Icon name="arrow" size={17} />Back to the feed</Button>
    </main>
  )
}

export default function App() {
  const getPage = (): Page => {
    const hash = window.location.hash.replace('#/', '')
    const routes: Page[] = ['article', 'video', 'dashboard', 'new-article', 'upload-video', 'login', 'signup', 'profile', 'settings', 'friends', 'messages']
    if (!hash) return 'home'
    return routes.includes(hash as Page) ? hash as Page : 'not-found'
  }
  const [page, setPage] = useState<Page>(getPage)
  const [dark, setDark] = useState(() => localStorage.getItem('inkreel-theme') === 'dark')
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('inkreel-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const onHashChange = () => setPage(getPage())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (nextPage: Page) => {
    window.location.hash = nextPage === 'home' ? '/' : `/${nextPage}`
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (page === 'login' || page === 'signup') {
    return <AuthPage mode={page} navigate={navigate} />
  }

  return (
    <div className="app-shell">
      <Header page={page} navigate={navigate} dark={dark} setDark={setDark} query={query} setQuery={setQuery} />
      {page === 'home' && <HomePage navigate={navigate} query={query} />}
      {page === 'article' && <ArticlePage />}
      {page === 'video' && <VideoPage navigate={navigate} />}
      {page === 'dashboard' && <DashboardPage navigate={navigate} />}
      {page === 'new-article' && <NewArticlePage />}
      {page === 'upload-video' && <UploadVideoPage />}
      {page === 'profile' && <ProfilePage navigate={navigate} />}
      {page === 'settings' && <SettingsPage dark={dark} setDark={setDark} navigate={navigate} />}
      {page === 'friends' && <FriendsPage navigate={navigate} />}
      {page === 'messages' && <MessagesPage />}
      {page === 'not-found' && <NotFoundPage navigate={navigate} />}
      <footer>
        <button className="brand footer-brand" onClick={() => navigate('home')}><span className="brand-mark">i</span><span>Inkreel</span></button>
        <p>Stories in motion. Thoughts in ink.</p>
        <span>© 2025 Inkreel</span>
      </footer>
    </div>
  )
}
