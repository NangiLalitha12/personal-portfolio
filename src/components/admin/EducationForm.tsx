
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { usePortfolio, Education } from '@/contexts/PortfolioContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit } from 'lucide-react';

const EducationForm: React.FC = () => {
  const { portfolioData, updatePortfolioData } = usePortfolio();
  const { toast } = useToast();
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    year: '',
    description: ''
  });

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: '',
      year: '',
      description: ''
    });
    setEditingEducation(null);
    setShowForm(false);
  };

  const handleEdit = (education: Education) => {
    setFormData({
      institution: education.institution,
      degree: education.degree,
      year: education.year,
      description: education.description
    });
    setEditingEducation(education);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newEducation: Education = {
        id: editingEducation?.id || Date.now().toString(),
        institution: formData.institution,
        degree: formData.degree,
        year: formData.year,
        description: formData.description
      };

      let updatedEducation;
      if (editingEducation) {
        updatedEducation = portfolioData.education.map(e => 
          e.id === editingEducation.id ? newEducation : e
        );
      } else {
        updatedEducation = [...portfolioData.education, newEducation];
      }

      await updatePortfolioData({ education: updatedEducation });
      toast({
        title: 'Education saved',
        description: `Education ${editingEducation ? 'updated' : 'added'} successfully.`,
      });
      resetForm();
    } catch (error) {
      toast({
        title: 'Save failed',
        description: 'Failed to save education.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (educationId: string) => {
    try {
      const updatedEducation = portfolioData.education.filter(e => e.id !== educationId);
      await updatePortfolioData({ education: updatedEducation });
      toast({
        title: 'Education deleted',
        description: 'Education removed successfully.',
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete education.',
        variant: 'destructive',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Education</CardTitle>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4 mb-6 p-4 bg-white/5 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="institution" className="text-white">Institution</Label>
                    <Input
                      id="institution"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-white">Year</Label>
                    <Input
                      id="year"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="2020-2024"
                      className="bg-white/10 border-white/20 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="degree" className="text-white">Degree</Label>
                  <Input
                    id="degree"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder="Bachelor of Computer Science"
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (editingEducation ? 'Update' : 'Add') + ' Education'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {portfolioData.education.map((education) => (
              <motion.div
                key={education.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{education.degree}</h3>
                    <p className="text-purple-300">{education.institution}</p>
                    <p className="text-white/70 text-sm">{education.year}</p>
                    {education.description && (
                      <p className="text-white/80 text-sm mt-2">{education.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEdit(education)}
                      className="bg-blue-600/20 text-blue-300 hover:bg-blue-600/30"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDelete(education.id)}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EducationForm;
