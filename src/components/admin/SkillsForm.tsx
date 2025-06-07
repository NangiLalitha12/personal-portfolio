
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, X } from 'lucide-react';

const SkillsForm: React.FC = () => {
  const { portfolioData, updatePortfolioData } = usePortfolio();
  const { toast } = useToast();
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    setLoading(true);
    try {
      const updatedSkills = [...portfolioData.skills, newSkill.trim()];
      await updatePortfolioData({ skills: updatedSkills });
      toast({
        title: 'Skill added',
        description: 'New skill has been added successfully.',
      });
      setNewSkill('');
    } catch (error) {
      toast({
        title: 'Add failed',
        description: 'Failed to add skill.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    try {
      const updatedSkills = portfolioData.skills.filter(skill => skill !== skillToRemove);
      await updatePortfolioData({ skills: updatedSkills });
      toast({
        title: 'Skill removed',
        description: 'Skill has been removed successfully.',
      });
    } catch (error) {
      toast({
        title: 'Remove failed',
        description: 'Failed to remove skill.',
        variant: 'destructive',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleAddSkill} className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="skill" className="text-white sr-only">Add Skill</Label>
              <Input
                id="skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter a skill (e.g., React, TypeScript, Node.js)"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={loading || !newSkill.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </form>

          <div className="space-y-4">
            <h3 className="text-white font-semibold">Current Skills</h3>
            <div className="flex flex-wrap gap-2">
              {portfolioData.skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white px-3 py-2 rounded-full border border-white/20"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </div>
            {portfolioData.skills.length === 0 && (
              <p className="text-white/50 italic">No skills added yet. Add your first skill above!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SkillsForm;
