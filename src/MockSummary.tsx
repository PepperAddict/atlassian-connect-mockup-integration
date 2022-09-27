import React, { Fragment, useState, useContext } from "react";
import moment from "moment";
import OwnerSelect from "./OwnerSelect";
import { DesignContext } from "./DesignContext";

export const iFrameElement = ({ currentMock }: any) => {
  return (
    <div className="iframe-container">
      <iframe
        title="design-thumbnail"
        id="protoframe"
        src={currentMock.summary.iframe}
      ></iframe>
    </div>
  );
};

export default function MockSummary(props) {
  const [touchOwner, setTouchOwner] = useState(false);
  const [newOwner, setNewOwner] = useState(null);

  const {
    setSetup,
    setError,
    addDescription,
    submitDescription,
    removeEntity,
    currentMock,
    selectedId,
    setSelectedId,
  } = useContext(DesignContext);

  return (
    <div className="showProject">
      {/* {mock.summary.iframe !== "undefined" && (
        <iFrameElement mock={currentMock} />
      )} */}
      {currentMock.map((theMock, key) => (
        <p key={key} onClick={() => setSelectedId(key)}>
          {theMock.id}
        </p>
      ))}

      {currentMock.map((mock, key) => {
        if (key !== selectedId) return;
        console.log(mock);
        return (
          <span key={key}>
            {mock.summary.thumbnail && (
              <div className="img-container">
                <img src={mock.summary.thumbnail} alt="image thumbnail" />
              </div>
            )}
            <OwnerSelect
              touchOwner={touchOwner}
              setTouchOwner={setTouchOwner}
              newOwner={newOwner}
              setNewOwner={setNewOwner}
            />
            {!props.touchOwner && (
              <div className="summary-content">
                <p>
                  <strong>Service:</strong> {mock.summary.type}
                </p>
                {mock.summary.lastEdited ? (
                  <p>
                    <strong>Last modified:</strong>{" "}
                    {moment(mock.summary.lastEdited).format("MMMM Do h:mm A")},{" "}
                    {moment(mock.summary.lastEdited).fromNow()}
                  </p>
                ) : (
                  <p>
                    <strong>Added:</strong>{" "}
                    {moment(mock.summary.added).format("MMMM Do h:mm A")},{" "}
                    {moment(mock.summary.added).fromNow()}
                  </p>
                )}
                {mock.summary.url && (
                  <p>
                    <strong>Link:</strong>{" "}
                    <a href={mock.summary.url} target="_blank" rel="nofollow">
                      {mock.summary.type} URL
                    </a>
                  </p>
                )}

                {props.which === "quick" ? (
                  <Fragment>
                    <div className="quick-description">
                      <strong>Description</strong>
                      <div className="description-span">{mock.description}</div>

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
                            mock.description ? mock.description : ""
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
          </span>
        );
      })}
    </div>
  );
}
