type ContentType = {
  header: {
    name: string
    role: string
    summary: string
    socialLinks: { icon: string; url: string }[]
  }
  sections: (
    | {
        title: string
        content: { heading: string; subheading: string; description: string }[]
      }
    | {
        title: string
        content: { icon: string; text: string; url?: string }[]
      }
    | {
        title: string
        content: { heading: string; date: string; details: string[] }[]
      }
    | {
        title: string
        content: { image: string; text: string; grade: number }[]
      }
  )[]
  footer?: {
    copyright?: string
    text: string
    cv?: {
      text: string
      text2: string
      url: string
    }
    links?: { label: string; url: string }[]
  }
}
