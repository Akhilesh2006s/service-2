
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MessageCircle, UserPlus } from "lucide-react";
import { mockEmployees } from "@/data/mockData";

interface MatchingProfessionalsProps {
  projectSkills: string[];
  projectTitle: string;
  onContactProfessional: (email: string, name: string, projectTitle: string) => void;
}

const MatchingProfessionals = ({ projectSkills, projectTitle, onContactProfessional }: MatchingProfessionalsProps) => {
  // Find professionals that match at least 2 skills or have overlapping skills
  const matchingProfessionals = mockEmployees.filter(employee => {
    const matchingSkills = employee.skills.filter(skill => 
      projectSkills.some(projectSkill => 
        projectSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(projectSkill.toLowerCase())
      )
    );
    return matchingSkills.length >= 1;
  }).map(employee => ({
    ...employee,
    matchingSkills: employee.skills.filter(skill => 
      projectSkills.some(projectSkill => 
        projectSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(projectSkill.toLowerCase())
      )
    ),
    matchScore: employee.skills.filter(skill => 
      projectSkills.some(projectSkill => 
        projectSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(projectSkill.toLowerCase())
      )
    ).length
  })).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);

  if (matchingProfessionals.length === 0) {
    return null;
  }

  return (
    <Card className="bg-black/60 border-yellow-500/30 backdrop-blur-sm mt-4">
      <CardHeader>
        <CardTitle className="text-yellow-400 flex items-center">
          <UserPlus className="w-5 h-5 mr-2" />
          Matching Professionals
        </CardTitle>
        <CardDescription className="text-gray-400">
          Professionals who match the required skills for "{projectTitle}"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matchingProfessionals.map((professional) => (
            <div key={professional.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600">
                  <AvatarFallback className="text-black font-bold">
                    {professional.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-white">{professional.name}</h3>
                  <p className="text-sm text-gray-400">{professional.role}</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-yellow-400 font-semibold text-sm">{professional.rating}</span>
                    <span className="text-gray-400 ml-2 text-sm">${professional.hourlyRate}/hr</span>
                    <span className="text-green-400 ml-2 text-sm">
                      {professional.matchScore} skill{professional.matchScore !== 1 ? 's' : ''} match
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex flex-wrap gap-1 mb-2 justify-end">
                  {professional.matchingSkills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="border-green-500/50 text-green-400 text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {professional.matchingSkills.length > 3 && (
                    <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs">
                      +{professional.matchingSkills.length - 3}
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => onContactProfessional(professional.email, professional.name, projectTitle)}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Contact
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchingProfessionals;
