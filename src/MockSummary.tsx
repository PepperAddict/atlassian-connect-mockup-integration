import React, { Fragment, useContext } from "react";
import moment from "moment";
import OwnerSelect from "./OwnerSelect";
import { DesignContext } from "./DesignContext";

export default function MockSummary(props) {
  const {
    setSetup,
    designIntegrateSummary,
    setError,
    addDescription,
    submitDescription,
    removeEntity,
    currentMock,
  } = useContext(DesignContext);

  return (
    <div className="showProject">
      {currentMock.summary.iframe ? (
        <div className="iframe-container">
          <iframe
            title="design-thumbnail"
            id="protoframe"
            src={currentMock.summary.iframe}
          ></iframe>
        </div>
      ) : currentMock.summary.thumbnail ? (
        <div className="img-container">
          <img src={currentMock.summary.thumbnail} alt="image thumbnail" />
        </div>
      ) : (
        <div className="no-thumbnail-container">
          Sorry, No Thumbnail Available
        </div>
      )}
      <OwnerSelect
        touchOwner={props.touchOwner}
        setTouchOwner={props.setTouchOwner}
        newOwner={props.newOwner}
        setNewOwner={props.setNewOwner}
      />

      {!props.touchOwner && (
        <div className="summary-content">
          <p>
            <strong>Service:</strong> {currentMock.summary.type}
          </p>
          {currentMock.summary.lastEdited ? (
            <p>
              <strong>Last modified:</strong>{" "}
              {moment(currentMock.summary.lastEdited).format("MMMM Do h:mm A")},{" "}
              {moment(currentMock.summary.lastEdited).fromNow()}
            </p>
          ) : (
            <p>
              <strong>Added:</strong>{" "}
              {moment(currentMock.summary.added).format("MMMM Do h:mm A")},{" "}
              {moment(currentMock.summary.added).fromNow()}
            </p>
          )}
          {currentMock.summary.url && (
            <p>
              <strong>Link:</strong>{" "}
              <a href={currentMock.summary.url} target="_blank" rel="nofollow">
                {currentMock.summary.type} URL
              </a>
            </p>
          )}

          {props.which === "quick" ? (
            <Fragment>
              <div className="quick-description">
                <strong>Description</strong>
                <div className="description-span">
                  {currentMock.description}
                </div>

                <span className="simple-buttons">
                  <button onClick={(e) => removeEntity(e)}>
                    Remove Attachment
                  </button>
                  <button
                    onClick={() => {
                      setSetup(true);
                      setError(false);
                    }}
                  >
                    Edit Description
                  </button>
                </span>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <form
                className="description-container"
                onSubmit={submitDescription}
              >
                <label>
                  <strong>Description</strong>

                  <textarea
                    name="description"
                    onFocus={(e) => addDescription(e.target.value)}
                    onChange={(e) => addDescription(e.target.value)}
                    defaultValue={
                      currentMock.description ? currentMock.description : null
                    }
                  />
                  <span className="descript-button">
                    <span
                      className="cancel-descript"
                      onClick={(e) => setSetup(false)}
                    >
                      Cancel
                    </span>
                    <button className="description-button" type="submit">
                      Save
                    </button>
                  </span>
                </label>
              </form>
            </Fragment>
          )}
        </div>
      )}
    </div>
  );
}
