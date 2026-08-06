export const patchFileReaderForImageCompression = () => {
    const originalReadAsDataURL = FileReader.prototype.readAsDataURL;
    FileReader.prototype.readAsDataURL = function (blob) {
        if (blob instanceof Blob && blob.type.startsWith('image/')) {
            const internalReader = new FileReader();
            internalReader.onload = (e) => {
                const result = e.target?.result as string;
                if (!result) {
                    originalReadAsDataURL.call(this, blob);
                    return;
                }
                
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const maxDim = 800; // 800px max dimension

                    if (width > maxDim || height > maxDim) {
                        if (width > height) {
                            height = Math.round(height * (maxDim / width));
                            width = maxDim;
                        } else {
                            width = Math.round(width * (maxDim / height));
                            height = maxDim;
                        }
                    } else {
                        // If no resize needed, but we still want to compress to jpeg
                        width = img.width;
                        height = img.height;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                        
                        fetch(dataUrl)
                            .then(res => res.blob())
                            .then(compressedBlob => {
                                originalReadAsDataURL.call(this, compressedBlob);
                            })
                            .catch(() => {
                                originalReadAsDataURL.call(this, blob);
                            });
                    } else {
                        originalReadAsDataURL.call(this, blob);
                    }
                };
                img.onerror = () => {
                    originalReadAsDataURL.call(this, blob);
                };
                img.src = result;
            };
            originalReadAsDataURL.call(internalReader, blob);
        } else {
            originalReadAsDataURL.call(this, blob);
        }
    };
};
