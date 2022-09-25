import React, { useState, useContext, Fragment } from "react";
import FileUpload from "./FileUpload";
import AttachButtons from "./AttachButtons";
import MockSummary from "./MockSummary";
import { DesignContext } from "./DesignContext";

export default function AttachMock(props) {
  const [upload, setupload] = useState(false);
  const {
    issueKey,
    noSupport,
    imageUrl,
    theUrl,
    setTheUrl,
    apiEntityWrite,
    setError,
    setSetup,
    figmaIt,
    iFrameIt,
    AP,
    error,
    currentMock,
  } = useContext(DesignContext);
  const checkForm = async (e) => {
    e.preventDefault();
    const userInput = theUrl.split("/");
    const urlSplit = theUrl.split(".");
    const urlEnding = urlSplit[urlSplit.length - 1];
    const isimg = /jpeg|jpg|png/g;
    const isItAnImage = urlEnding.match(isimg);

    if (userInput.length > 1 && !isItAnImage) {
      const cloudUrl = userInput[2];

      const findService = (service) => {
        if (cloudUrl.includes(service)) {
          return cloudUrl;
        }
      };
      switch (cloudUrl) {
        case findService("figma"):
          const id = userInput[4];
          setError(false);
          setSetup(true);
          figmaIt("Figma", id, apiEntityWrite);
          setSetup(true);
          break;
        case findService("animaapp"):
          iFrameIt(theUrl, "Anima", apiEntityWrite);
          setSetup(true);
          setError(false);
          break;
        case findService("adobe"):
          noSupport(theUrl, "Adobe XD", apiEntityWrite);
          setError(false);
          setSetup(true);
          break;
        case findService("docs.google"):
          iFrameIt(theUrl, "Google Drive", apiEntityWrite);
          setError(false);
          setSetup(true);
          break;
        case findService("invis"):
          setError(false);
          iFrameIt(theUrl, "Invision", apiEntityWrite);
          setSetup(true);
          break;
        default:
          setError(true);
      }
    } else if (isItAnImage) {
      imageUrl(theUrl, apiEntityWrite);
    } else {
      setError(true);
    }
  };

  return (
    <div className="input-container">
      {upload ? (
        <FileUpload AP={AP} issueKey={issueKey} setupload={setupload} />
      ) : (
        <form onSubmit={checkForm}>
          <span className="input-button">
            <AttachButtons setupload={setupload} which="url" />
            <input
              id="url"
              name="url"
              placeholder="Paste URL"
              onChange={(e) => setTheUrl(e.target.value)}
            />

            <button type="submit">Attach Mockup</button>
          </span>
        </form>
      )}

      {error && (
        <p className="error-message">
          Sorry, the URL is not supported. Please try again.
        </p>
      )}

      {currentMock.summary ? (
        <Fragment>
          <MockSummary
            which="quick"
            touchOwner={props.touchOwner}
            setTouchOwner={props.setTouchOwner}
            newOwner={props.newOwner}
            setNewOwner={props.setNewOwner}
          />
        </Fragment>
      ) : (
        <div className="quick-summary empty">
          <p>No Mockup Attached.</p>
        </div>
      )}
    </div>
  );
}
