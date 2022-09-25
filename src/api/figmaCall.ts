export const figmaIt = async (service, id, callback) => {
    if (service === "Figma") {
      const apiId = `figma-${id}`;
      if (id) {
        const token = process.env.REACT_APP_FIGMA as string;
        const figma = await fetch(`https://api.figma.com/v1/files/${id}`, {
          headers: {
            "X-Figma-Token": token,
          },
        });
        await figma.json().then(async (res) => {
          const figmaFile = "https://figma.com/file/" + id;

          const figmaObject = JSON.stringify({
            summary: {
              type: service,
              id: apiId,
              name: res.name,
              iframe: null,
              url: figmaFile,
              thumbnail: res.thumbnailUrl,
              lastEdited: res.lastModified,
            },
          });
          await callback(figmaObject);
        });
      } else {
        console.log("Sorry, could not find an ID");
      }
    }
  };