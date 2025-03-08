export function convertToBase64(file: File) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.result) {
        const base64String = reader.result as string
        resolve(base64String.replace(/^data:.+;base64,/, ''))
      }
    }
    return reader.readAsDataURL(file)
  })
}

export function getFileExtension(filename: string): string {
  const index = filename.lastIndexOf('.')
  return index !== -1 ? filename.substring(index + 1) : ''
}
