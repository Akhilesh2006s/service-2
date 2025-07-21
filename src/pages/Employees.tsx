import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  LogOut,
  Star,
  User,
  Settings,
  MessageCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import SkillsManager from "@/components/SkillsManager";
import ChatInterface from "@/components/ChatInterface";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { seedMockProjects, mockOrganizations } from "@/data/mockData";
import { DataModeContext } from "@/App";

const Employees = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [fullName, setFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState("");
  const [chatProjectTitle, setChatProjectTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState<any[]>([]);
  const { mode: dataMode } = useContext(DataModeContext);

  useEffect(() => {
    const fetchProjects = async () => {
      if (dataMode === "fake") {
        // Seed and load from localStorage
        seedMockProjects();
        const localProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        setProjects(localProjects);
      } else {
        // Live mode: fetch from Firestore
        let projectsFromFirestore = [];
        try {
          const querySnapshot = await getDocs(collection(db, "projects"));
          projectsFromFirestore = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // If Firestore is empty, seed with mock projects
          if (projectsFromFirestore.length === 0) {
            seedMockProjects();
            const orgs = mockOrganizations;
            const localProjects = JSON.parse(localStorage.getItem("projects") || "[]");
            for (const p of localProjects) {
              await addDoc(collection(db, "projects"), p);
            }
            const seededSnapshot = await getDocs(collection(db, "projects"));
            projectsFromFirestore = seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          }
        } catch (err) {
          projectsFromFirestore = JSON.parse(localStorage.getItem("projects") || "[]");
        }
        setProjects(projectsFromFirestore);
      }
    };
    const storedFullName = localStorage.getItem("fullName");
    const storedUserEmail = localStorage.getItem("userEmail");
    
    if (!storedFullName || !storedUserEmail) {
      navigate("/auth");
      return;
    }
    
    setFullName(storedFullName);
    setUserEmail(storedUserEmail);
    fetchProjects();
    // Load applications for this user from Firestore
    const fetchApplications = async () => {
      if (storedUserEmail) {
        try {
          const q = query(collection(db, "applications"), where("userEmail", "==", storedUserEmail));
          const querySnapshot = await getDocs(q);
          const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setApplications(apps);
        } catch (err) {
          // Fallback to localStorage
          const userApps = JSON.parse(localStorage.getItem(`applications:${storedUserEmail}`) || "[]");
          setApplications(userApps);
        }
      }
    };
    fetchApplications();
  }, [navigate, dataMode]);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("fullName");
    localStorage.removeItem("userSkills");
    localStorage.removeItem("userExperience");
    localStorage.removeItem("userHourlyRate");
    localStorage.removeItem("userBio");
    localStorage.removeItem("userPortfolio");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleApplyToProject = async (project: any) => {
    // Prevent duplicate applications
    if (applications.some(app => app.projectId === project.id)) {
      toast.error("You have already applied to this project.");
      return;
    }
    const newApp = {
      id: Date.now(),
      projectId: project.id,
      project: project.title,
      company: project.companyName,
      appliedDate: new Date().toISOString().split('T')[0],
      status: "Under Review",
      budget: project.budget,
      skills: project.skills,
      userEmail: userEmail
    };
    // Add to Firestore
    try {
      await addDoc(collection(db, "applications"), newApp);
      // Fetch updated applications from Firestore
      const q = query(collection(db, "applications"), where("userEmail", "==", userEmail));
      const querySnapshot = await getDocs(q);
      const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(apps);
    } catch (err) {
      // Fallback to localStorage
      const updatedApps = [...applications, newApp];
      setApplications(updatedApps);
      localStorage.setItem(`applications:${userEmail}`, JSON.stringify(updatedApps));
      toast.error("Failed to save application to Firestore. Using local fallback.");
    }
    toast.success(`Applied to "${project.title}" successfully!`);
    
    // Open chat with the organization
    setChatRecipient(project.postedBy);
    setChatProjectTitle(project.title);
    setChatOpen(true);
  };

  const myApplications = [
    {
      id: 1,
      project: "E-commerce Platform Development",
      company: "TechFlow Solutions",
      appliedDate: "2024-01-15",
      status: "Under Review",
      budget: "$15,000 - $25,000",
      skills: ["React", "Node.js", "MongoDB"]
    },
    {
      id: 2,
      project: "Mobile App UI/UX Design",
      company: "InnovateTech",
      appliedDate: "2024-01-10",
      status: "Shortlisted",
      budget: "$8,000 - $12,000",
      skills: ["Figma", "UI/UX", "Mobile Design"]
    },
    {
      id: 3,
      project: "DevOps Infrastructure Setup",
      company: "CloudFirst",
      appliedDate: "2024-01-05",
      status: "Hired",
      budget: "$10,000 - $15,000",
      skills: ["Docker", "AWS", "Kubernetes"]
    }
  ];

  const userSkills = JSON.parse(localStorage.getItem("userSkills") || "[]");
  const userExperience = localStorage.getItem("userExperience") || "Not specified";
  const userHourlyRate = localStorage.getItem("userHourlyRate") || "0";

  // Filter projects based on search query
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
    project.budget.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-600">
      {/* Header */}
      <header className="border-b border-yellow-500/20 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-black font-bold" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{fullName}</h1>
                <p className="text-sm text-gray-400">Professional Dashboard</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-800 border-yellow-500/30 mb-8">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              <TrendingUp className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              <Search className="w-4 h-4 mr-2" />
              Find Projects
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              <Briefcase className="w-4 h-4 mr-2" />
              My Applications
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              <Settings className="w-4 h-4 mr-2" />
              Profile & Skills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Active Applications</p>
                      <p className="text-2xl font-bold text-yellow-400">{myApplications.filter(a => a.status !== "Hired").length}</p>
                    </div>
                    <Briefcase className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Projects Hired</p>
                      <p className="text-2xl font-bold text-yellow-400">{myApplications.filter(a => a.status === "Hired").length}</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Hourly Rate</p>
                      <p className="text-2xl font-bold text-yellow-400">${userHourlyRate}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Skills Listed</p>
                      <p className="text-2xl font-bold text-yellow-400">{userSkills.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Summary */}
            <Card className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-yellow-400">Profile Summary</CardTitle>
                <CardDescription className="text-gray-400">
                  Your professional overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600">
                    <AvatarFallback className="text-black font-bold text-xl">
                      {fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{fullName}</h3>
                    <p className="text-gray-400">{userExperience}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-yellow-400 font-semibold">4.9</span>
                      <span className="text-gray-400 ml-2">${userHourlyRate}/hr</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userSkills.slice(0, 8).map((skill: string) => (
                    <Badge key={skill} variant="outline" className="border-yellow-500/50 text-yellow-400">
                      {skill}
                    </Badge>
                  ))}
                  {userSkills.length > 8 && (
                    <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                      +{userSkills.length - 8} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Available Projects</h2>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects by title, company, skills, or budget..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black/60 border-yellow-500/30 text-white placeholder-gray-400 focus:border-yellow-500"
                />
              </div>
            </div>
            
            <div className="grid gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">{project.title}</CardTitle>
                        <p className="text-yellow-400 text-sm mt-1">{project.companyName}</p>
                        <CardDescription className="text-gray-400 mt-2">
                          {project.description}
                        </CardDescription>
                      </div>
                      <Badge className="bg-yellow-500 text-black">
                        {project.status || "Active"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skills.map((skill: string) => (
                        <Badge key={skill} variant="outline" className="border-yellow-500/50 text-yellow-400">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {project.budget}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {project.duration}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setChatRecipient(project.postedBy);
                            setChatProjectTitle(project.title);
                            setChatOpen(true);
                          }}
                          variant="outline"
                          className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                        <Button 
                          onClick={() => handleApplyToProject(project)}
                          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <h2 className="text-2xl font-bold text-white mb-6">My Applications</h2>
            <div className="grid gap-6">
              {applications.length === 0 ? (
                <div className="text-gray-400">You have not applied to any projects yet.</div>
              ) : (
                applications.map((application) => (
                  <Card key={application.id} className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-white text-lg">{application.project}</h3>
                          <p className="text-yellow-400 text-sm">{application.company}</p>
                          <p className="text-gray-400 text-sm">Applied on {application.appliedDate}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge 
                            variant={application.status === "Hired" ? "default" : "outline"}
                            className={application.status === "Hired" ? "bg-yellow-500 text-black" : "border-yellow-500/50 text-yellow-400"}
                          >
                            {application.status}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => {
                              setChatRecipient(`hiring@${application.company.toLowerCase().replace(/\s+/g, '')}.com`);
                              setChatProjectTitle(application.project);
                              setChatOpen(true);
                            }}
                            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {application.skills.map((skill: string) => (
                          <Badge key={skill} variant="outline" className="border-yellow-500/50 text-yellow-400">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {application.budget}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <SkillsManager />
          </TabsContent>
        </Tabs>

        <ChatInterface
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          recipientEmail={chatRecipient}
          projectTitle={chatProjectTitle}
        />
      </div>
    </div>
  );
};

export default Employees;
