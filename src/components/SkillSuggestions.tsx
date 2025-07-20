
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MessageCircle } from "lucide-react";
import { getSkillSuggestions } from "@/data/mockData";

interface SkillSuggestionsProps {
  projectSkills: string[];
  onContactCandidate: (email: string, name: string) => void;
}

const SkillSuggestions = ({ projectSkills, onContactCandidate }: SkillSuggestionsProps) => {
  const suggestions = getSkillSuggestions(projectSkills);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-yellow-400">Recommended Candidates</CardTitle>
        <CardDescription className="text-gray-400">
          Based on your project skills, here are some candidates you might want to contact
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((candidate) => (
            <div key={candidate.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-yellow-500/20">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600">
                  <AvatarFallback className="text-black font-bold">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-white">{candidate.name}</h3>
                  <p className="text-sm text-gray-400">{candidate.role}</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-yellow-400 font-semibold text-sm">{candidate.rating}</span>
                    <span className="text-gray-400 ml-2 text-sm">${candidate.hourlyRate}/hr</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex flex-wrap gap-1 mb-2 justify-end">
                  {candidate.matchingSkills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="border-yellow-500/50 text-yellow-400 text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.matchingSkills.length > 3 && (
                    <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-xs">
                      +{candidate.matchingSkills.length - 3}
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => onContactCandidate(candidate.email, candidate.name)}
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

export default SkillSuggestions;
