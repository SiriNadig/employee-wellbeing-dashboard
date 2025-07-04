import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database helper functions
export const db = {
  // Mood functions
  async addMood(mood, note = '') {
    const { data, error } = await supabase
      .from('moods')
      .insert([{ mood, note }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getMoods(limit = 30) {
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  // Productivity functions
  async addProductivity(score, note = '') {
    const { data, error } = await supabase
      .from('productivity')
      .insert([{ score, note }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getProductivity(limit = 30) {
    const { data, error } = await supabase
      .from('productivity')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  // Meeting functions
  async addMeeting(meetingData) {
    const { data, error } = await supabase
      .from('meetings')
      .insert([meetingData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getMeetings(limit = 50) {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('start_time', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  }
}
