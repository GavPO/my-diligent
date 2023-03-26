const blobToBase64 = blob => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(blob)
  })
}

export const convertBlobToBase64 = async blob => {
  return await blobToBase64(blob)
}
