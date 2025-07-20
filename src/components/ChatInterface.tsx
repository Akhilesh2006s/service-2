
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle, X } from "lucide-react";
import { mockEmployees, mockOrganizations } from "@/data/mockData";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  recipientEmail?: string;
  projectTitle?: string;
}

const ChatInterface = ({ isOpen, onClose, recipientEmail, projectTitle }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipient, setRecipient] = useState<any>(null);
  const currentUserEmail = localStorage.getItem("userEmail");
  const currentUserType = localStorage.getItem("userType");

  useEffect(() => {
    if (recipientEmail) {
      // Find recipient from mock data
      const employee = mockEmployees.find(emp => emp.email === recipientEmail);
      const organization = mockOrganizations.find(org => org.email === recipientEmail);
      setRecipient(employee || organization);

      // Start with empty conversation - no predefined messages
      setMessages([]);
    }
  }, [recipientEmail, projectTitle, currentUserEmail]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: currentUserEmail || "",
      content: newMessage,
      timestamp: new Date(),
      isCurrentUser: true
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate recipient response after 2 seconds
    setTimeout(() => {
      const responses = [
        "Thank you for reaching out! I'd love to learn more about this opportunity.",
        "This looks interesting. Could you tell me more about the project requirements?",
        "I'm available to discuss this further. When would be a good time for a call?",
        "I have experience with similar projects. Would you like to see my portfolio?",
        "What's the timeline and budget for this project?",
        "I'm very interested. What are the next steps?",
        "Could you provide more details about the scope of work?",
        "I'd be happy to help with this project. Let's discuss the details."
      ];
      
      const autoResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: recipientEmail || "",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        isCurrentUser: false
      };

      setMessages(prev => [...prev, autoResponse]);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-black/90 border-yellow-500/30 backdrop-blur-sm w-full max-w-md h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600">
              <AvatarFallback className="text-black font-bold">
                {recipient?.name?.split(' ').map((n: string) => n[0]).join('') || 
                 recipient?.companyName?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-yellow-400 text-sm">
                {recipient?.name || recipient?.companyName || 'User'}
              </CardTitle>
              {(recipient?.role || recipient?.title) && (
                <p className="text-gray-400 text-xs">{recipient.role || recipient.title}</p>
              )}
              {projectTitle && (
                <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-xs mt-1">
                  {projectTitle}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4 p-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">
                    {projectTitle 
                      ? `Start a conversation about "${projectTitle}"`
                      : "Start a conversation"
                    }
                  </p>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isCurrentUser
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black'
                        : 'bg-gray-800 text-white border border-yellow-500/30'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.isCurrentUser ? 'text-black/70' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={projectTitle ? `Message about ${projectTitle}...` : "Type your message..."}
              className="bg-gray-800 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button
              onClick={sendMessage}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
