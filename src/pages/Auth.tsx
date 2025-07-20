
import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Briefcase, User, ArrowLeft } from "lucide-react";
import { mockEmployees, mockOrganizations } from "@/data/mockData";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { DataModeContext } from "@/App";

const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signin");
  const [userType, setUserType] = useState("employee");
  const [isSignUp, setIsSignUp] = useState(false);

  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  });

  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    companyName: "",
    industry: "",
    companySize: "",
    description: "",
    role: "",
    experience: "",
    hourlyRate: "",
    bio: "",
    portfolio: ""
  });

  const { mode: dataMode } = useContext(DataModeContext);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userType === "organization") {
      // Try Firestore first
      let org = null;
      try {
        const q = query(collection(db, "organizations"), where("email", "==", signInData.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          if (docData.password === signInData.password) {
            org = docData;
          }
        }
      } catch (err) {
        // Ignore Firestore error, fallback to mock
      }
      // Fallback to mock data if not found in Firestore
      if (!org) {
        org = mockOrganizations.find(org => 
          org.email === signInData.email && org.password === signInData.password
        );
      }
      if (org) {
        localStorage.setItem("userType", "organization");
        localStorage.setItem("userEmail", org.email);
        localStorage.setItem("companyName", org.companyName);
        toast.success(`Welcome back, ${org.companyName}!`);
        navigate("/organizations");
      } else {
        toast.error("Invalid organization credentials!");
      }
    } else {
      // Try Firestore first
      let employee = null;
      try {
        const q = query(collection(db, "users"), where("email", "==", signInData.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          if (docData.password === signInData.password) {
            employee = docData;
          }
        }
      } catch (err) {
        // Ignore Firestore error, fallback to mock
      }
      // Fallback to mock data if not found in Firestore
      if (!employee) {
        employee = mockEmployees.find(emp => 
          emp.email === signInData.email && emp.password === signInData.password
        );
      }
      if (employee) {
        localStorage.setItem("userType", "employee");
        localStorage.setItem("userEmail", employee.email);
        localStorage.setItem("fullName", employee.fullName || employee.name);
        localStorage.setItem("userSkills", JSON.stringify(employee.skills));
        localStorage.setItem("userExperience", employee.experience);
        localStorage.setItem("userHourlyRate", employee.hourlyRate?.toString() || "0");
        localStorage.setItem("userBio", employee.bio);
        localStorage.setItem("userPortfolio", employee.portfolio);
        toast.success(`Welcome back, ${employee.fullName || employee.name}!`);
        navigate("/employees");
      } else {
        toast.error("Invalid employee credentials!");
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    if (userType === "organization") {
      if (!signUpData.companyName || !signUpData.industry) {
        toast.error("Please fill in all required fields!");
        return;
      }
      if (dataMode === "fake") {
        // Fake mode: just use localStorage
        localStorage.setItem("userType", "organization");
        localStorage.setItem("userEmail", signUpData.email);
        localStorage.setItem("companyName", signUpData.companyName);
        toast.success(`Welcome to TalentFlow, ${signUpData.companyName}! (Fake Data)`);
        navigate("/organizations");
        return;
      }
      // Live mode: Firestore
      try {
        await addDoc(collection(db, "organizations"), {
          email: signUpData.email,
          password: signUpData.password, // For demo only; use Firebase Auth for real apps
          companyName: signUpData.companyName,
          industry: signUpData.industry,
          size: signUpData.companySize,
          description: signUpData.description,
          createdAt: new Date()
        });
        localStorage.setItem("userType", "organization");
        localStorage.setItem("userEmail", signUpData.email);
        localStorage.setItem("companyName", signUpData.companyName);
        toast.success(`Welcome to TalentFlow, ${signUpData.companyName}!`);
        navigate("/organizations");
      } catch (err) {
        toast.error("Failed to save organization to Firestore. Try again or use Fake Data mode.");
      }
    } else {
      if (!signUpData.fullName || !signUpData.role) {
        toast.error("Please fill in all required fields!");
        return;
      }
      if (dataMode === "fake") {
        // Fake mode: just use localStorage
        localStorage.setItem("userType", "employee");
        localStorage.setItem("userEmail", signUpData.email);
        localStorage.setItem("fullName", signUpData.fullName);
        localStorage.setItem("userSkills", JSON.stringify([]));
        localStorage.setItem("userExperience", signUpData.experience || "");
        localStorage.setItem("userHourlyRate", signUpData.hourlyRate || "0");
        localStorage.setItem("userBio", signUpData.bio || "");
        localStorage.setItem("userPortfolio", signUpData.portfolio || "");
        localStorage.setItem(`applications:${signUpData.email}`, JSON.stringify([]));
        toast.success(`Welcome to TalentFlow, ${signUpData.fullName}! (Fake Data)`);
        navigate("/employees");
        return;
      }
      // Live mode: Firestore
      try {
        await addDoc(collection(db, "users"), {
          email: signUpData.email,
          password: signUpData.password, // For demo only; use Firebase Auth for real apps
          fullName: signUpData.fullName,
          role: signUpData.role,
          experience: signUpData.experience,
          hourlyRate: signUpData.hourlyRate,
          bio: signUpData.bio,
          portfolio: signUpData.portfolio,
          skills: [],
          createdAt: new Date()
        });
        localStorage.setItem("userType", "employee");
        localStorage.setItem("userEmail", signUpData.email);
        localStorage.setItem("fullName", signUpData.fullName);
        localStorage.setItem("userSkills", JSON.stringify([]));
        localStorage.setItem("userExperience", signUpData.experience || "");
        localStorage.setItem("userHourlyRate", signUpData.hourlyRate || "0");
        localStorage.setItem("userBio", signUpData.bio || "");
        localStorage.setItem("userPortfolio", signUpData.portfolio || "");
        localStorage.setItem(`applications:${signUpData.email}`, JSON.stringify([]));
        toast.success(`Welcome to TalentFlow, ${signUpData.fullName}!`);
        navigate("/employees");
      } catch (err) {
        toast.error("Failed to save user to Firestore. Try again or use Fake Data mode.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Button */}
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-6 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="bg-black/80 border-yellow-500/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-black" />
            </div>
            <CardTitle className="text-2xl text-yellow-400">TalentFlow</CardTitle>
            <CardDescription className="text-gray-400">
              {isSignUp ? "Create your account" : "Sign in to your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={userType} onValueChange={setUserType} className="mb-6">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="employee" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                  <User className="w-4 h-4 mr-2" />
                  Professional
                </TabsTrigger>
                <TabsTrigger value="organization" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Organization
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {!isSignUp ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={signInData.email}
                    onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                    className="bg-gray-800 border-yellow-500/30 text-white focus:border-yellow-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={signInData.password}
                    onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                    className="bg-gray-800 border-yellow-500/30 text-white focus:border-yellow-500"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
                  Sign In
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                    className="bg-gray-800 border-yellow-500/30 text-white focus:border-yellow-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                      className="bg-gray-800 border-yellow-500/30 text-white focus:border-yellow-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password" className="text-gray-300">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                      className="bg-gray-800 border-yellow-500/30 text-white focus:border-yellow-500"
                      required
                    />
                  </div>
                </div>

                {userType === "organization" ? (
                  <>
                    <div>
                      <Label htmlFor="company-name" className="text-gray-300">Company Name</Label>
                      <Input
                        id="company-name"
                        value={signUpData.companyName}
                        onChange={(e) => setSignUpData({...signUpData, companyName: e.target.value})}
                        className="bg-gray-800 border-yellow-500/30 text-white focus:border-yellow-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="industry" className="text-gray-300">Industry</Label>
                        <Input
                          id="industry"
                          value={signUpData.industry}
                          onChange={(e) => setSignUpData({...signUpData, industry: e.target.value})}
                          className="bg-gray-800 border-yellow-500/30 text-white focus:border-yellow-500"
                          placeholder="e.g., Technology"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="company-size" className="text-gray-300">Company Size</Label>
                        <Select onValueChange={(value) => setSignUpData({...signUpData, companySize: value})}>
                          <SelectTrigger className="bg-gray-800 border-yellow-500/30 text-white focus:border-yellow-500">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-200">51-200 employees</SelectItem>
                            <SelectItem value="201+">201+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="company-description" className="text-gray-300">Company Description</Label>
                      <Textarea
                        id="company-description"
                        value={signUpData.description}
                        onChange={(e) => setSignUpData({...signUpData, description: e.target.value})}
                        className="bg-gray-800 border-yellow-500/30 text-white focus:border-yellow-500"
                        placeholder="Brief description of your company..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="full-name" className="text-gray-300">Full Name</Label>
                      <Input
                        id="full-name"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData({...signUpData, fullName: e.target.value})}
                        className="bg-gray-800 border-yellow-500/30 text-white focus:border-yellow-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="role" className="text-gray-300">Role</Label>
                        <Input
                          id="role"
                          value={signUpData.role}
                          onChange={(e) => setSignUpData({...signUpData, role: e.target.value})}
                          className="bg-gray-800 border-yellow-500/30 text-white focus:border-yellow-500"
                          placeholder="e.g., Full Stack Developer"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="experience" className="text-gray-300">Experience</Label>
                        <Input
                          id="experience"
                          value={signUpData.experience}
                          onChange={(e) => setSignUpData({...signUpData, experience: e.target.value})}
                          className="bg-gray-800 border-yellow-500/30 text-white focus:border-yellow-500"
                          placeholder="e.g., 5 years"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="hourly-rate" className="text-gray-300">Hourly Rate ($)</Label>
                      <Input
                        id="hourly-rate"
                        type="number"
                        value={signUpData.hourlyRate}
                        onChange={(e) => setSignUpData({...signUpData, hourlyRate: e.target.value})}
                        className="bg-gray-800 border-yellow-500/30 text-white focus:border-yellow-500"
                        placeholder="85"
                      />
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
                  Create Account
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-yellow-400 hover:text-yellow-300"
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </Button>
            </div>

            {/* Demo Accounts */}
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-yellow-500/20">
              <h4 className="text-yellow-400 font-semibold mb-2 text-sm">Demo Accounts:</h4>
              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-gray-300 font-medium">Organizations:</p>
                  <div className="text-gray-400 space-y-1">
                    <p>hiring@techflow.com / TechFlow2024!</p>
                    <p>careers@innovatetech.com / Innovate2024!</p>
                    <p>jobs@cloudfirst.com / CloudFirst2024!</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-300 font-medium">Professionals:</p>
                  <div className="text-gray-400 space-y-1">
                    <p>alex.rodriguez@email.com / Alex2024!</p>
                    <p>maria.santos@email.com / Maria2024!</p>
                    <p>david.kim@email.com / David2024!</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
