export const noSupport = (url, service, callback) => {
    const xdData = JSON.stringify({
      summary: {
        type: service,
        thumbnail: null,
        url,
        iframe: null,
      },
    });
    callback(xdData);
  };