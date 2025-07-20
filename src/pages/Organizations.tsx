import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Users, 
  Briefcase, 
  TrendingUp, 
  DollarSign,
  Clock,
  LogOut,
  Star,
  Trash2,
  CheckCircle,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProjectPostingForm from "@/components/ProjectPostingForm";
import SkillSuggestions from "@/components/SkillSuggestions";
import ChatInterface from "@/components/ChatInterface";
import MatchingProfessionals from "@/components/MatchingProfessionals";
import { mockEmployees, getEmployeesByOrganization, mockOrganizations } from "@/data/mockData";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const Organizations = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showPostingForm, setShowPostingForm] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState("");
  const [chatProjectTitle, setChatProjectTitle] = useState("");
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [orgMembers, setOrgMembers] = useState<any[]>([]);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrgData = async () => {
      const storedCompanyName = localStorage.getItem("companyName");
      const storedUserEmail = localStorage.getItem("userEmail");
      if (!storedCompanyName || !storedUserEmail) {
        navigate("/auth");
        return;
      }
      setCompanyName(storedCompanyName);
      setUserEmail(storedUserEmail);
      // Fetch projects from Firestore
      let userProjects = [];
      try {
        const q = query(collection(db, "projects"), where("postedBy", "==", storedUserEmail));
        const querySnapshot = await getDocs(q);
        userProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Fallback to localStorage if Firestore empty
        if (userProjects.length === 0) {
          const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
          userProjects = allProjects.filter((project: any) => project.postedBy === storedUserEmail);
        }
      } catch (err) {
        const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        userProjects = allProjects.filter((project: any) => project.postedBy === storedUserEmail);
      }
      setProjects(userProjects);
      // Fetch org members from Firestore
      let orgMembersArr = [];
      try {
        const org = mockOrganizations.find(o => o.email === storedUserEmail);
        if (org) {
          const q = query(collection(db, "users"), where("organizationId", "==", org.id));
          const querySnapshot = await getDocs(q);
          orgMembersArr = querySnapshot.docs.map(doc => doc.data());
          if (orgMembersArr.length === 0) {
            orgMembersArr = getEmployeesByOrganization(org.id);
          }
        }
      } catch (err) {
        const org = mockOrganizations.find(o => o.email === storedUserEmail);
        if (org) {
          orgMembersArr = getEmployeesByOrganization(org.id);
        }
      }
      setOrgMembers(orgMembersArr);
      // Fetch applications for org's projects from Firestore
      let orgApplications = [];
      try {
        if (userProjects.length > 0) {
          const projectIds = userProjects.map(p => p.id);
          const q = query(collection(db, "applications"));
          const querySnapshot = await getDocs(q);
          orgApplications = querySnapshot.docs.map(doc => doc.data()).filter(app => projectIds.includes(app.projectId));
        }
      } catch (err) {
        // fallback: use generateApplications (mock)
        orgApplications = generateApplications();
      }
      setApplications(orgApplications);
    };
    fetchOrgData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("companyName");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleProjectPosted = (newProject: any) => {
    setProjects([...projects, newProject]);
    setShowPostingForm(false);
    setActiveTab("projects");
  };

  const handleDeleteProject = (projectId: number) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    
    // Update localStorage
    const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const filteredProjects = allProjects.filter((p: any) => p.id !== projectId);
    localStorage.setItem("projects", JSON.stringify(filteredProjects));
    
    toast.success("Project deleted successfully");
  };

  const handleCloseProject = (projectId: number) => {
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, status: "Completed" } : p
    );
    setProjects(updatedProjects);
    
    // Update localStorage
    const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const updatedAllProjects = allProjects.map((p: any) => 
      p.id === projectId ? { ...p, status: "Completed" } : p
    );
    localStorage.setItem("projects", JSON.stringify(updatedAllProjects));
    
    toast.success("Project marked as completed");
  };

  const handleContactCandidate = (email: string, name: string) => {
    setChatRecipient(email);
    setChatProjectTitle("");
    setChatOpen(true);
  };

  const handleContactProfessional = (email: string, name: string, projectTitle: string) => {
    setChatRecipient(email);
    setChatProjectTitle(projectTitle);
    setChatOpen(true);
  };

  const toggleProjectExpansion = (projectId: number) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const generateApplications = () => {
    const statuses = ["Under Review", "Shortlisted", "Hired", "Rejected"];
    
    // Use real employees from mockData
    return mockEmployees.slice(0, Math.min(mockEmployees.length, projects.length * 2)).map((employee, index) => ({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      experience: employee.experience,
      rating: employee.rating,
      hourlyRate: `$${employee.hourlyRate}/hr`,
      bio: employee.bio,
      skills: employee.skills,
      project: projects[index % projects.length]?.title || "General Application",
      status: statuses[index % statuses.length],
      appliedDate: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }));
  };

  // Filter applications based on search query
  const filteredApplications = applications.filter(application =>
    application.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    application.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    application.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
    application.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    application.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
    application.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter all employees by search query
  const filteredAllEmployees = mockEmployees.filter(emp =>
    emp.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
    emp.skills.some(skill => skill.toLowerCase().includes(employeeSearchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-600">
      {/* Header */}
      <header className="border-b border-yellow-500/20 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-black font-bold" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{companyName}</h1>
                <p className="text-sm text-gray-400">Organization Dashboard</p>
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
        {showPostingForm ? (
          <div className="space-y-6">
            <ProjectPostingForm 
              onProjectPosted={handleProjectPosted}
              onCancel={() => setShowPostingForm(false)}
            />
            {projects.length > 0 && (
              <SkillSuggestions 
                projectSkills={projects[projects.length - 1]?.skills || []}
                onContactCandidate={handleContactCandidate}
              />
            )}
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-800 border-yellow-500/30 mb-8">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                <TrendingUp className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                <Briefcase className="w-4 h-4 mr-2" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="applications" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                <Users className="w-4 h-4 mr-2" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="members" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                <Users className="w-4 h-4 mr-2" />
                Members
              </TabsTrigger>
              <TabsTrigger value="search-employees" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                <Search className="w-4 h-4 mr-2" />
                Search Employees
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Active Projects</p>
                        <p className="text-2xl font-bold text-yellow-400">{projects.filter(p => p.status === "Active").length}</p>
                      </div>
                      <Briefcase className="w-8 h-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total Applications</p>
                        <p className="text-2xl font-bold text-yellow-400">{applications.length * 3}</p>
                      </div>
                      <Users className="w-8 h-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Hired Talent</p>
                        <p className="text-2xl font-bold text-yellow-400">{applications.filter(a => a.status === "Hired").length}</p>
                      </div>
                      <Star className="w-8 h-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Success Rate</p>
                        <p className="text-2xl font-bold text-yellow-400">94%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Projects */}
              <Card className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Recent Projects</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your latest project postings and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects.slice(0, 3).map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-yellow-500/20">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">{project.title}</h3>
                            <p className="text-sm text-gray-400 mb-2">{project.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <DollarSign className="w-3 h-3 mr-1" />
                                {project.budget}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {project.duration}
                              </span>
                              <span className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {project.applicants} applicants
                              </span>
                            </div>
                          </div>
                          <Badge 
                            variant={project.status === "Active" ? "default" : project.status === "Completed" ? "secondary" : "outline"}
                            className={project.status === "Active" ? "bg-yellow-500 text-black" : ""}
                          >
                            {project.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No projects posted yet</p>
                      <Button 
                        onClick={() => setShowPostingForm(true)}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Post Your First Project
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Project Management</h2>
                <Button 
                  onClick={() => setShowPostingForm(true)}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Project
                </Button>
              </div>

              <div className="grid gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="space-y-4">
                    <Card className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white">{project.title}</CardTitle>
                            <CardDescription className="text-gray-400 mt-2">
                              {project.description}
                            </CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={project.status === "Active" ? "default" : project.status === "Completed" ? "secondary" : "outline"}
                              className={project.status === "Active" ? "bg-yellow-500 text-black" : ""}
                            >
                              {project.status}
                            </Badge>
                            {project.status === "Active" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleCloseProject(project.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Complete
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteProject(project.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleProjectExpansion(project.id)}
                              className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                            >
                              {expandedProjects.has(project.id) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
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
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {project.budget}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {project.duration}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {project.applicants} applicants
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {expandedProjects.has(project.id) && (
                      <MatchingProfessionals
                        projectSkills={project.skills}
                        projectTitle={project.title}
                        onContactProfessional={handleContactProfessional}
                      />
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="applications">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Application Management</h2>
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search employees by name, role, project, or status..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-black/60 border-yellow-500/30 text-white placeholder-gray-400 focus:border-yellow-500"
                  />
                </div>
              </div>
              
              <div className="grid gap-6">
                {filteredApplications.map((application) => (
                  <Card key={application.id} className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600">
                            <AvatarFallback className="text-black font-bold">
                              {application.name.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-white">{application.name}</h3>
                            <p className="text-sm text-gray-400">{application.role}</p>
                            <p className="text-xs text-gray-500">{application.experience} experience</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center space-x-4">
                          <div>
                            <div className="flex items-center mb-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-yellow-400 font-semibold">{application.rating}</span>
                            </div>
                            <p className="text-sm text-gray-400">{application.hourlyRate}</p>
                            <Badge 
                              variant={application.status === "Hired" ? "default" : "outline"}
                              className={application.status === "Hired" ? "bg-yellow-500 text-black" : "border-yellow-500/50 text-yellow-400"}
                            >
                              {application.status}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              setChatRecipient(`${application.name.toLowerCase().replace(' ', '.')}@email.com`);
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
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <p className="text-sm text-gray-400">Applied for: <span className="text-yellow-400">{application.project}</span></p>
                        <p className="text-xs text-gray-500 mt-1">Applied on: {application.appliedDate}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="members">
              <h2 className="text-2xl font-bold text-white mb-6">Organization Members</h2>
              <div className="grid gap-6">
                {orgMembers.length === 0 ? (
                  <div className="text-gray-400">No members found for this organization.</div>
                ) : (
                  orgMembers.map(member => (
                    <Card key={member.id} className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-white text-lg">{member.name}</h3>
                            <p className="text-yellow-400 text-sm">{member.role}</p>
                            <p className="text-gray-400 text-sm">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {member.skills.map((skill: string) => (
                            <Badge key={skill} variant="outline" className="border-yellow-500/50 text-yellow-400">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="search-employees">
              <h2 className="text-2xl font-bold text-white mb-6">Search All Employees</h2>
              <div className="flex justify-end mb-4">
                <input
                  type="text"
                  placeholder="Search by name, email, role, or skill..."
                  value={employeeSearchQuery}
                  onChange={e => setEmployeeSearchQuery(e.target.value)}
                  className="pl-3 pr-3 py-2 rounded bg-black/60 border border-yellow-500/30 text-white placeholder-gray-400 focus:border-yellow-500 w-full max-w-md"
                />
              </div>
              <div className="grid gap-6">
                {filteredAllEmployees.length === 0 ? (
                  <div className="text-gray-400">No employees found.</div>
                ) : (
                  filteredAllEmployees.map(emp => (
                    <Card key={emp.id} className="bg-black/60 border-yellow-500/30 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-white text-lg">{emp.name}</h3>
                            <p className="text-yellow-400 text-sm">{emp.role}</p>
                            <p className="text-gray-400 text-sm">{emp.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {emp.skills.map((skill: string) => (
                            <Badge key={skill} variant="outline" className="border-yellow-500/50 text-yellow-400">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

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

export default Organizations;
