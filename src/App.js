import React, { useState, useEffect } from "react";
import "./App.css";
import ApiCall from './ApiCall.tsx'
const AP = window.AP

function App() {

  const [issueKey, setIssueKey] = useState("DI-8")
  const [issueId, setIssueId] = useState("10007")

  useEffect(() => {
    try {
      AP.context.getContext(async (res) => {
        await setIssueKey(res.jira.issue.key)
        await setIssueId(res.jira.issue.id)
      })
    } catch (err) {
      console.log('youre not in Jira')
    }


  }, [])

  return (
    <div className="App">
      <section id="content" className="ac-content">
        {issueKey && <ApiCall issueKey={issueKey} issueId={issueId} AP={AP} />}
      </section>

    </div>
  );
}

export default App;
