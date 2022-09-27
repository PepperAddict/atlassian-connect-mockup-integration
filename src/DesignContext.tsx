import React, { useState, useEffect, createContext } from "react";
import { figmaIt, noSupport, imageUrl, iFrameIt } from "./api";
export const DesignContext = createContext({} as any);

export const ParentProvider = ({ children }) => {
  const [issueKey, setIssueKey] = useState("");
  const [issueId, setIssueId] = useState("");
  const [error, setError] = useState(false);
  const [setup, setSetup] = useState(false as boolean);
  const [theUrl, setTheUrl] = useState(null as any);
  const [description, addDescription] = useState(null as any);
  let [currentMock, setCurrentMock] = useState([{ summary: "" }] as any);
  const [content, setContent] = useState(null);
  let AP = (window as any).AP;
  const [designIntegrateSummary] = useState("design-integrate_summary");
  const [selectedId, setSelectedId] = useState(1);

  const getIssueInfo = () => {
    try {
      AP.context.getContext(async (res) => {
        await setIssueKey(res.jira.issue.key);
        await setIssueId(res.jira.issue.id);
      });
    } catch (err) {
      console.log("youre not in Jira");
      setIssueKey("DI-8");
      setIssueId("10007");
    }
  };

  useEffect(() => {
    getIssueInfo();
  }, []);

  const apiEntityWrite = async (dataObject) => {
    try {
      await AP.request({
        url:
          "/rest/api/3/issue/" +
          issueKey +
          "/properties/" +
          designIntegrateSummary,
        type: "PUT",
        contentType: "application/json",
        data: dataObject,
        experimental: true,
      })
        .then((res) => {
          const jsonify = JSON.parse(dataObject);
          setCurrentMock((currentMock) => [...currentMock, jsonify]);
          addDescription(null);
        })
        .then(async () => {
          //phone everyone about the new addition
          const info = JSON.stringify({
            htmlBody: `A ticket you are watching has a new mockup attached.`,
            subject: "A Mockup Attached to ticket",
            textBody: `A ticket you are watching has a new mockup attached. `,
            to: {
              reporter: true,
              assignee: true,
            },
          });

          await AP.request({
            url: `/rest/api/3/issue/${issueKey}/notify`,
            type: "POST",
            contentType: "application/json",
            data: info,
            experimental: true,
          })
            .then((response) => console.log(response))
            .catch((err) => console.log(err));
        });
    } catch (err) {
      setCurrentMock((currentMock) => [...currentMock, dataObject]);
      addDescription(null);
    }
  };

  const removeEntity = async (e) => {
    e.preventDefault();
    try {
      await AP.request({
        url:
          "/rest/api/3/issue/" +
          issueKey +
          "/properties/" +
          designIntegrateSummary,
        type: "PUT",
        contentType: "application/json",
        data: `{"summary": null}`,
        experimental: true,
      }).then((res) => {
        console.log("deleted");
        setCurrentMock([]);
        addDescription(null);
      });
    } catch (err) {
      setCurrentMock([]);
      addDescription(null);
    }
  };

  const submitDescription = async (e) => {
    e.preventDefault();
    const newJson = currentMock;
    newJson[selectedId].description = description;
    await apiEntityWrite([...newJson]);
    setSetup(false);
  };

  if (currentMock) {
    console.log(currentMock);
  }
  return (
    <DesignContext.Provider
      value={{
        issueKey,
        issueId,
        AP,
        designIntegrateSummary,
        currentMock,
        description,
        content,
        setContent,
        setup,
        selectedId,
        setSelectedId,
        setSetup: (e) => setSetup(e),
        addDescription: (e) => addDescription(e),
        theUrl,
        setTheUrl: (e) => setTheUrl(e),
        setCurrentMock: (e) => setCurrentMock(e),
        submitDescription: (e) => submitDescription(e),
        error,
        setError: (e: any) => setError(e),
        apiEntityWrite: (e) => apiEntityWrite(e),
        removeEntity: (e) => removeEntity(e),
        figmaIt: (a, b, c) => figmaIt(a, b, c),
        noSupport: (url, service, callback) =>
          noSupport(url, service, callback),
        imageUrl: (url, callback) => imageUrl(url, callback),
        iFrameIt: (url, service, callback) => iFrameIt(url, service, callback),
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};
