
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Mail, Clock, User, Check } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: any;
  read: boolean;
}

const MessagesForm: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData: Message[] = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(messagesData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching messages:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (messageId: string) => {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        read: true
      });
      toast({
        title: 'Message marked as read',
        description: 'The message has been marked as read successfully.',
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark message as read.',
        variant: 'destructive'
      });
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-6">
          <div className="text-center text-white">Loading messages...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Messages ({messages.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-white/70 py-8">
              No messages yet. When someone sends a message through the contact form, it will appear here.
            </div>
          ) : (
            messages.map((message) => (
              <Card key={message.id} className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-purple-400" />
                        <span className="text-white font-medium">{message.name}</span>
                      </div>
                      <Badge variant={message.read ? 'secondary' : 'default'}>
                        {message.read ? 'Read' : 'New'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <Clock className="h-4 w-4" />
                      {formatDate(message.timestamp)}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-purple-400 text-sm mb-2">
                      <Mail className="h-4 w-4" />
                      {message.email}
                    </div>
                    <div className="text-white/90 bg-white/5 p-3 rounded border">
                      {message.message}
                    </div>
                  </div>

                  {!message.read && (
                    <Button
                      onClick={() => markAsRead(message.id)}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Mark as Read
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MessagesForm;
