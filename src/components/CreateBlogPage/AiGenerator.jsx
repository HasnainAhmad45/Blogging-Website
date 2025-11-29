import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { CardContent } from "@/components/ui/CardContent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const AiGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to generate text.");
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-xl rounded-2xl">
      <CardContent className="p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2">💡 Get Blog ideas</h2>
        <Textarea
          placeholder="Type your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full flex justify-center items-center gap-2"
        >
          {loading ? "Generating..." : "Generate"}
        </Button>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {response && (
          <Card className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
            <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default AiGenerator;
