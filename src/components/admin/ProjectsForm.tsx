
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { usePortfolio, Project } from '@/contexts/PortfolioContext';
import { useToast } from '@/hooks/use-toast';
import CloudinaryUpload from '../CloudinaryUpload';
import { Plus, Edit, Link as LinkIcon } from 'lucide-react';

const ProjectsForm: React.FC = () => {
  const { portfolioData, updatePortfolioData } = usePortfolio();
  const { toast } = useToast();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    technologies: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      link: '',
      technologies: ''
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      link: project.link,
      technologies: project.technologies.join(', ')
    });
    setEditingProject(project);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newProject: Project = {
        id: editingProject?.id || Date.now().toString(),
        title: formData.title,
        description: formData.description,
        image: formData.image,
        link: formData.link,
        technologies: formData.technologies.split(',').map(tech => tech.trim())
      };

      let updatedProjects;
      if (editingProject) {
        updatedProjects = portfolioData.projects.map(p => 
          p.id === editingProject.id ? newProject : p
        );
      } else {
        updatedProjects = [...portfolioData.projects, newProject];
      }

      await updatePortfolioData({ projects: updatedProjects });
      toast({
        title: 'Project saved',
        description: `Project ${editingProject ? 'updated' : 'added'} successfully.`,
      });
      resetForm();
    } catch (error) {
      toast({
        title: 'Save failed',
        description: 'Failed to save project.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      const updatedProjects = portfolioData.projects.filter(p => p.id !== projectId);
      await updatePortfolioData({ projects: updatedProjects });
      toast({
        title: 'Project deleted',
        description: 'Project removed successfully.',
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete project.',
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
          <CardTitle className="text-white">Projects</CardTitle>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
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
                    <Label htmlFor="title" className="text-white">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link" className="text-white">Project Link</Label>
                    <Input
                      id="link"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technologies" className="text-white">Technologies (comma-separated)</Label>
                  <Input
                    id="technologies"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React, TypeScript, Node.js"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Project Image</Label>
                  <div className="flex items-center gap-4">
                    <CloudinaryUpload onImageUpload={(url) => setFormData({ ...formData, image: url })}>
                      Upload Project Image
                    </CloudinaryUpload>
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Project preview"
                        className="w-16 h-16 rounded object-cover"
                      />
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (editingProject ? 'Update' : 'Add') + ' Project'}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolioData.projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 rounded-lg p-4 space-y-3"
              >
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-32 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="text-white font-semibold">{project.title}</h3>
                  <p className="text-white/70 text-sm">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEdit(project)}
                    className="bg-blue-600/20 text-blue-300 hover:bg-blue-600/30"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  {project.link && (
                    <Button
                      size="sm"
                      onClick={() => window.open(project.link, '_blank')}
                      className="bg-green-600/20 text-green-300 hover:bg-green-600/30"
                    >
                      <LinkIcon className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    variant="destructive"
                    className="ml-auto"
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectsForm;
