export const imageUrl = async (url, callback) => {
    const imageData = JSON.stringify({
      summary: {
        type: "Image",
        thumbnail: url,
        url: url,
        iframe: null,
        lastEdited: null,
        added: new Date(),
      },
    });
    callback(imageData);
    // setSetup(true);
    // setError(false);
  };