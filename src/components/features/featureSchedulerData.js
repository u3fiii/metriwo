export const SCHEDULER_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const SCHEDULER_CAL_START = 4

export const SCHEDULER_TIMES = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM']

export const SCHEDULER_POSTS_DATA = [
  { emoji: '🎯', label: 'Campaign', status: 'pub' },
  { emoji: '📊', label: 'Analytics', status: 'sched' },
  { emoji: '🌿', label: 'Green week', status: 'sched' },
  { emoji: '🔥', label: 'Flash sale', status: 'pub' },
  { emoji: '✨', label: 'New drop', status: 'sched' },
  { emoji: '🚀', label: 'Launch', status: 'sched' },
]

export const SCHEDULER_SCHEDULED_DAYS = [3, 7, 11, 16, 20, 25]

export const SCHEDULER_VISIT_SEQUENCE = [5, 9, 14, 18, 24, 28, 6, 13, 22, 29]

export const SCHEDULER_POST_OPTIONS = [
  { emoji: '🎯', label: 'Campaign', status: 'sched' },
  { emoji: '📸', label: 'New post', status: 'sched' },
  { emoji: '🚀', label: 'Launch', status: 'sched' },
  { emoji: '✨', label: 'Feature', status: 'sched' },
  { emoji: '🌿', label: 'Content', status: 'sched' },
]

export function createInitialCalPosts() {
  const posts = {}
  SCHEDULER_SCHEDULED_DAYS.forEach((day, i) => {
    posts[day] = SCHEDULER_POSTS_DATA[i]
  })
  return posts
}
