import React, {useState, useEffect} from "react";
import "./App.css";
import ApiCall from './ApiCall.tsx'
const AP = window.AP

function App() {

  const [issueKey, setIssueKey] = useState(null)
  const [issueId, setIssueId] = useState(null)
  console.log(AP)
 useEffect(() => {

    AP.context.getContext(async (res) => {
    await setIssueKey(res.jira.issue.key)
    await setIssueId(res.jira.issue.id)
   })
 }, [])

  return (
    <div className="App">
      <section id="content" className="ac-content">
        {issueKey && <ApiCall issueKey={issueKey} issueId={issueId} AP={AP}/>}
      </section>

    </div>
  );
}

export default App;
