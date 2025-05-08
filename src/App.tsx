import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000"; // your Express server

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const connectServer = async () => {
    try {
      await axios.post(`${API_BASE}/connect`, {
        scriptPath: "E:/MCP-client/weather/build/index.js", // update accordingly
      });
      alert("Connected to MCP Server");
    } catch (error) {
      alert("Connection failed");
    }
  };

  const sendQuery = async () => {
    setLoading(true);
    console.log("Sending query:", query);
    
    try {
      const res = await axios.post(`${API_BASE}/query`, { prompt: query });
      setResponse(res.data.response);
    } catch (error: any) {
      setResponse(error.response?.data?.error || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>MCP Client with Claude</h1>
      <button onClick={connectServer}>Connect to MCP Server</button>

      <div style={{ marginTop: "20px" }}>
        <textarea
          rows={4}
          cols={60}
          placeholder="Enter your query..."
          value={query}
          onChange={(e) => {
            console.log("Input updated:", e.target.value);
            setQuery(e.target.value)}}
        />
        <br />
        <button onClick={sendQuery} disabled={loading}>
          {loading ? "Processing..." : "Send"}
        </button>
      </div>

      <div style={{ marginTop: "30px", whiteSpace: "pre-wrap" }}>
        <strong>Response:</strong>
        <div>{response}</div>
      </div>
    </div>
  );
}

export default App;
