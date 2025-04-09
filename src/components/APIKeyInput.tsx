
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initializeOpenAI, isOpenAIInitialized } from "@/utils/ai";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, KeyRound } from "lucide-react";

interface APIKeyInputProps {
  onInitialized?: () => void;
}

const APIKeyInput = ({ onInitialized }: APIKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if API key is already set
    const isInitialized = isOpenAIInitialized();
    setInitialized(isInitialized);
    setIsVisible(!isInitialized);
  }, []);

  const handleInitialize = () => {
    if (!apiKey.trim()) {
      setError("Please enter a valid API key");
      return;
    }

    try {
      const success = initializeOpenAI(apiKey);
      if (success) {
        setInitialized(true);
        setError("");
        setIsVisible(false);
        if (onInitialized) onInitialized();
      } else {
        setError("Failed to initialize. Check your API key.");
      }
    } catch (err) {
      setError("An error occurred while initializing OpenAI");
      console.error(err);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  if (!isVisible && initialized) {
    return (
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleVisibility} 
          className="text-xs px-2 py-1 h-8 bg-green-950/20 border-green-900/30 text-green-400"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          API Key Set
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-lg mb-4">
      <div className="flex items-center mb-3">
        <KeyRound className="h-5 w-5 mr-2 text-yellow-400" />
        <h3 className="text-lg font-medium">OpenAI API Key Required</h3>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-3 py-2 bg-red-950/30 border-red-900/50 text-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <p className="text-sm text-slate-300 mb-2">
          Enter your OpenAI API key to enable AI-powered features. Your key is stored locally in your browser.
        </p>
        <div className="flex space-x-2">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="flex-1 bg-slate-900/50 border-slate-700 focus:border-primary/50"
          />
          <Button onClick={handleInitialize}>
            Set Key
          </Button>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          For development purposes only. In production, API keys should be handled securely on the server.
        </p>
      </div>
    </div>
  );
};

export default APIKeyInput;
