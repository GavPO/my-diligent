export default function reduceImageFileSize(blob) {
  return new Promise((resolve, reject) => {
    // Create an image element to load the blob data
    const img = document.createElement("img")
    img.onload = () => {
      // Create a canvas element to draw the image onto
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      // Calculate the new dimensions of the image based on the max file size
      const maxDimension = Math.sqrt(1024 * 1024)
      const scale = Math.min(
        maxDimension / img.width,
        maxDimension / img.height
      )
      const newWidth = Math.round(img.width * scale)
      const newHeight = Math.round(img.height * scale)

      // Draw the image onto the canvas at the reduced size
      canvas.width = newWidth
      canvas.height = newHeight
      ctx.drawImage(img, 0, 0, newWidth, newHeight)

      // Convert the canvas back to a Blob object with the specified MIME type
      canvas.toBlob(
        blob => {
          resolve(blob)
        },
        "image/png",
        0.5
      ) // You can adjust the image quality by changing the third parameter
    }
    img.onerror = reject

    // Load the blob data into the image element
    const reader = new FileReader()
    reader.onload = event => {
      img.src = event.target.result
    }
    reader.readAsDataURL(blob)
  })
}
