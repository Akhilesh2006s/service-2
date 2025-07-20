
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

interface ProjectPostingFormProps {
  onProjectPosted: (project: any) => void;
  onCancel: () => void;
}

const ProjectPostingForm = ({ onProjectPosted, onCancel }: ProjectPostingFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !minBudget || !maxBudget || !duration) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const userEmail = localStorage.getItem("userEmail");
    const companyName = localStorage.getItem("companyName");
    
    const newProject = {
      id: Date.now(),
      title,
      description,
      budget: `$${minBudget} - $${maxBudget}`,
      duration,
      skills,
      applicants: 0,
      status: "Active",
      postedBy: userEmail,
      companyName: companyName || "Your Company"
    };

    // Add to Firestore
    try {
      await addDoc(collection(db, "projects"), newProject);
    } catch (err) {
      toast.error("Failed to save project to Firestore. Using local fallback.");
    }
    // Also update localStorage for fallback
    const existingProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const updatedProjects = [...existingProjects, newProject];
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    onProjectPosted(newProject);
    toast.success("Project posted successfully!");
  };

  return (
    <Card className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-yellow-400">Post New Project</CardTitle>
        <CardDescription className="text-gray-400">
          Create a new project posting to find the right talent
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-300">Project Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E-commerce Platform Development"
              className="bg-gray-800 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project requirements, goals, and expectations..."
              className="bg-gray-800 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minBudget" className="text-gray-300">Min Budget ($)</Label>
              <Input
                id="minBudget"
                type="number"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                placeholder="5000"
                className="bg-gray-800 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <Label htmlFor="maxBudget" className="text-gray-300">Max Budget ($)</Label>
              <Input
                id="maxBudget"
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                placeholder="15000"
                className="bg-gray-800 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="duration" className="text-gray-300">Duration</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="2-3 months"
              className="bg-gray-800 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500"
            />
          </div>

          <div>
            <Label htmlFor="skills" className="text-gray-300">Required Skills</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                id="skills"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="React, Node.js, etc."
                className="bg-gray-800 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} className="bg-yellow-500 text-black hover:bg-yellow-600">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="outline" className="border-yellow-500/50 text-yellow-400">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
              Post Project
            </Button>
            <Button type="button" onClick={onCancel} variant="outline" className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectPostingForm;
