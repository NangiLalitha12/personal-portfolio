
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import PersonalInfoForm from './PersonalInfoForm';
import ProjectsForm from './ProjectsForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import MessagesForm from './MessagesForm';
import { User, Settings, Book, Code, Mail } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Logout
            </Button>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-lg">
              <TabsTrigger value="personal" className="data-[state=active]:bg-white/20">
                <User className="h-4 w-4 mr-2" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-white/20">
                <Code className="h-4 w-4 mr-2" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="education" className="data-[state=active]:bg-white/20">
                <Book className="h-4 w-4 mr-2" />
                Education
              </TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-white/20">
                <Settings className="h-4 w-4 mr-2" />
                Skills
              </TabsTrigger>
              <TabsTrigger value="messages" className="data-[state=active]:bg-white/20">
                <Mail className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <PersonalInfoForm />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectsForm />
            </TabsContent>

            <TabsContent value="education">
              <EducationForm />
            </TabsContent>

            <TabsContent value="skills">
              <SkillsForm />
            </TabsContent>

            <TabsContent value="messages">
              <MessagesForm />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
