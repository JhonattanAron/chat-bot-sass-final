export type Lead = {
  _id: string
  batch_id: string
  place_id: string
  name: string
  phone?: string
  website?: string
  address: string
  rating?: number
  location: { lat: number; lng: number }
  source: 'google_places'
  createdAt: string
  updatedAt: string
}

export type LeadsFiltersType = {
  search: string
  source: 'all' | 'google_places'
  rating: 'all' | 'gte_4' | 'gte_4_5'
  batch_id: string
}
