
import * as React from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Users, MessageCircle, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  created_at: string;
}

interface OnlineUser {
  user_id: string;
  user_name: string;
  online_at: string;
}

interface PresenceState {
  [key: string]: Array<{
    user_name?: string;
    online_at?: string;
    presence_ref: string;
  }>;
}

export default function Messages() {
  const { user, fullName } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [onlineUsers, setOnlineUsers] = React.useState<OnlineUser[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const channelRef = React.useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load existing messages from database
  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (!user || !fullName) return;

    loadMessages();

    // Create a channel for real-time messaging and presence
    const channel = supabase.channel('public-chat', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channelRef.current = channel;

    // Listen for new messages from database
    channel.on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages'
    }, (payload) => {
      const newMessage = payload.new as Message;
      setMessages(prev => [...prev, newMessage]);
    });

    // Track online users
    channel.on('presence', { event: 'sync' }, () => {
      const presenceState = channel.presenceState() as PresenceState;
      const users: OnlineUser[] = [];
      
      Object.keys(presenceState).forEach(key => {
        const presences = presenceState[key];
        if (presences && presences.length > 0) {
          const presence = presences[0];
          users.push({
            user_id: key,
            user_name: presence.user_name || 'Unknown User',
            online_at: presence.online_at || new Date().toISOString()
          });
        }
      });
      
      setOnlineUsers(users);
    });

    channel.on('presence', { event: 'join' }, ({ newPresences }) => {
      console.log('User joined:', newPresences);
    });

    channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
      console.log('User left:', leftPresences);
    });

    // Subscribe and track presence
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        setIsConnected(true);
        await channel.track({
          user_name: fullName,
          online_at: new Date().toISOString(),
        });
      }
    });

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [user, fullName, toast]);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !fullName) return;

    try {
      // Insert message into database
      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          user_name: fullName,
          message: newMessage.trim(),
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
        return;
      }

      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl p-8">
          <CardContent className="text-center">
            <MessageCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Please Sign In</h2>
            <p className="text-gray-300">You need to be logged in to access the chat.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-6">
        {/* Online Users Sidebar */}
        <Card className="lg:col-span-1 bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-blue-400" />
              Online Users
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 ml-auto">
                {onlineUsers.length}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
              <span className="text-sm text-gray-300">
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {onlineUsers.map((user) => (
                <div key={user.user_id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                      {getInitials(user.user_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.user_name}
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-green-300">Online</span>
                    </div>
                  </div>
                </div>
              ))}
              {onlineUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No users online</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3 bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-purple-400" />
              Global Chat
            </CardTitle>
            <p className="text-gray-300 text-sm">
              Connect with other users in real-time messaging
            </p>
          </CardHeader>
          <CardContent className="flex flex-col h-[600px]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-black/20 rounded-xl">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-gray-300">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Welcome to Global Chat</h3>
                  <p className="text-gray-300">Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.user_id === user?.id ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                        {getInitials(message.user_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.user_id === user?.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'bg-white/15 text-white border border-white/20 backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium opacity-90">
                          {message.user_name}
                        </span>
                        <span className="text-xs opacity-70">
                          {formatTime(message.created_at)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed break-words">{message.message}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="flex gap-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 rounded-xl backdrop-blur-sm focus:bg-white/15"
                disabled={!isConnected}
              />
              <Button 
                type="submit" 
                disabled={!newMessage.trim() || !isConnected}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 h-12 px-6 rounded-xl shadow-lg disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>

            {!isConnected && (
              <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-xl backdrop-blur-sm">
                <p className="text-yellow-200 text-sm text-center flex items-center justify-center gap-2">
                  <WifiOff className="w-4 h-4" />
                  Connecting to chat server...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
