import invLogo from "../img/invisionlogo.png";

export const iFrameIt = async (url, service, callback) => {
    let thumbnail = null as any;
    const arr_url = url.split(".");
    const last = arr_url[arr_url.length - 1];
    const logo = service === "Invision" && invLogo;

    const img = last === "jpg" ? (thumbnail = url) : (thumbnail = logo);

    const iFrameData = JSON.stringify({
      summary: {
        type: service,
        thumbnail: img,
        url: url,
        iframe: url,
      },
    });

    callback(iFrameData);
  };