export const pickImage = async (setError) => {
    return new Promise((resolve) => {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.style.display = 'none';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    resolve(file);
                } else {
                    resolve(null);
                }
            };
            
            input.oncancel = () => {
                resolve(null);
            };
            
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
        } catch (err) {
            console.error('Error picking image:', err);
            setError('שגיאה בטעינת התמונה');
            resolve(null);
        }
    });
};

export const prepareImage = async (file) => {
    return new Promise((resolve, reject) => {
        try {
            if (!file || !file.type.startsWith('image/')) {
                reject(new Error('Invalid file type'));
                return;
            }

            // Check file size (max 5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                reject(new Error('File too large'));
                return;
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                try {
                    // Calculate new dimensions (max width 500px)
                    const maxWidth = 500;
                    let { width, height } = img;

                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // Draw and compress
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    resolve(reader.result);
                                };
                                reader.onerror = () => {
                                    reject(new Error('Failed to read image'));
                                };
                                reader.readAsDataURL(blob);
                            } else {
                                reject(new Error('Failed to compress image'));
                            }
                        },
                        'image/jpeg',
                        0.7 // compression quality
                    );
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            img.src = URL.createObjectURL(file);
        } catch (error) {
            console.error('Image preparation error:', error);
            reject(error);
        }
    });
};