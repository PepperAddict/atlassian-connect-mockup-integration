import React, { Fragment, useContext, useEffect, useState } from "react";

import AttachMock from "./AttachMock";

import { DesignContext } from "./DesignContext";
import MockSummary from "./MockSummary";

export default function ApiCall() {
  const {
    issueKey,
    AP,
    addDescription,
    setError,
    error,
    designIntegrateSummary,
    setCurrentMock,
    currentMock,
    setup,
    setSetup,
    setContent,
  } = useContext(DesignContext);

  const OnStartCheck = async (key = designIntegrateSummary) => {
    try {
      return await AP.request(`/rest/api/3/issue/${issueKey}/properties/${key}`)
        .then((data) => {
          if (data.xhr.status === 200) {
            return data.body;
          } else {
            setError(true);
          }
        })
        .then(async (res) => {
          const responseJson = JSON.parse(res);
          await setContent(responseJson);
          await setCurrentMock((currentMock) => [
            ...currentMock,
            responseJson.value,
          ]);

          (await responseJson.description) &&
            addDescription(responseJson.description);
          setSetup(true);
        });
    } catch (err) {}
  };

  useEffect(() => {
    if (issueKey) {
      OnStartCheck(designIntegrateSummary);
    }
  }, [issueKey]);

  return (
    <Fragment>
      {setup && currentMock[0] !== undefined && !error ? (
        <MockSummary which="full" />
      ) : (
        <AttachMock />
      )}
    </Fragment>
  );
}
