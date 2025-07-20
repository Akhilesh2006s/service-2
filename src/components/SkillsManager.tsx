
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Star } from "lucide-react";
import { toast } from "sonner";

const SkillsManager = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [experience, setExperience] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [bio, setBio] = useState("");
  const [portfolio, setPortfolio] = useState("");

  useEffect(() => {
    // Load saved profile data
    const savedSkills = JSON.parse(localStorage.getItem("userSkills") || "[]");
    const savedExperience = localStorage.getItem("userExperience") || "";
    const savedHourlyRate = localStorage.getItem("userHourlyRate") || "";
    const savedBio = localStorage.getItem("userBio") || "";
    const savedPortfolio = localStorage.getItem("userPortfolio") || "";
    
    setSkills(savedSkills);
    setExperience(savedExperience);
    setHourlyRate(savedHourlyRate);
    setBio(savedBio);
    setPortfolio(savedPortfolio);
  }, []);

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      const updatedSkills = [...skills, currentSkill.trim()];
      setSkills(updatedSkills);
      localStorage.setItem("userSkills", JSON.stringify(updatedSkills));
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(updatedSkills);
    localStorage.setItem("userSkills", JSON.stringify(updatedSkills));
  };

  const saveProfile = () => {
    localStorage.setItem("userExperience", experience);
    localStorage.setItem("userHourlyRate", hourlyRate);
    localStorage.setItem("userBio", bio);
    localStorage.setItem("userPortfolio", portfolio);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-yellow-400">Professional Profile</CardTitle>
          <CardDescription className="text-gray-400">
            Update your skills and experience to attract the right opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience" className="text-gray-300">Years of Experience</Label>
              <Input
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="5 years"
                className="bg-gray-800 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <Label htmlFor="hourlyRate" className="text-gray-300">Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="85"
                className="bg-gray-800 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio" className="text-gray-300">Professional Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your experience, expertise, and what makes you unique..."
              className="bg-gray-800 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500 min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="portfolio" className="text-gray-300">Portfolio URL</Label>
            <Input
              id="portfolio"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder="https://yourportfolio.com"
              className="bg-gray-800 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500"
            />
          </div>

          <div>
            <Label htmlFor="skills" className="text-gray-300">Skills</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                id="skills"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="React, Node.js, Python, etc."
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

          <Button onClick={saveProfile} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
            Save Profile
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-yellow-400">Profile Preview</CardTitle>
          <CardDescription className="text-gray-400">
            How organizations will see your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{localStorage.getItem("fullName") || "Your Name"}</h3>
                <p className="text-gray-400">{experience || "Experience not specified"}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-yellow-400 font-semibold">4.9</span>
                </div>
                <p className="text-sm text-gray-400">${hourlyRate || "0"}/hr</p>
              </div>
            </div>
            
            {bio && (
              <p className="text-gray-300 text-sm">{bio}</p>
            )}
            
            {portfolio && (
              <p className="text-sm">
                <span className="text-gray-400">Portfolio: </span>
                <a href={portfolio} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                  {portfolio}
                </a>
              </p>
            )}
            
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="outline" className="border-yellow-500/50 text-yellow-400">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsManager;
