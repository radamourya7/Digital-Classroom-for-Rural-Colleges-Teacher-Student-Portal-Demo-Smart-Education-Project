import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { teacherAPI } from '@/api/teacherAPI';
import { BookOpen, Loader2, Copy, Check } from 'lucide-react';

export default function CreateClass() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    schedule: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const generatedCode = `CLS${Date.now().toString().slice(-6)}`;

      await teacherAPI.createClass({
        ...formData,
        code: generatedCode
      });

      setClassCode(generatedCode);
      toast({
        title: 'Class Created!',
        description: 'Your class has been created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create class. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(classCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} showMenuButton />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 animate-fade-in">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Create New Class
              </h1>
              <p className="text-muted-foreground mt-1">
                Set up a new class for your students
              </p>
            </div>

            {classCode ? (
              <Card className="animate-slide-up">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success mx-auto mb-4">
                      <Check className="h-8 w-8" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-foreground mb-2">
                      Class Created Successfully!
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Share this code with your students so they can join
                    </p>
                    <div className="flex items-center justify-center gap-3 p-4 bg-muted rounded-xl mb-6">
                      <span className="text-2xl font-mono font-bold text-foreground tracking-wider">
                        {classCode}
                      </span>
                      <Button variant="outline" size="icon" onClick={copyCode}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Button variant="outline" onClick={() => setClassCode('')}>
                        Create Another
                      </Button>
                      <Button onClick={() => navigate('/teacher/dashboard')}>
                        Go to Dashboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="animate-slide-up">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>Class Details</CardTitle>
                      <CardDescription>Fill in the information for your new class</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Class Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Data Structures and Algorithms"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => setFormData({ ...formData, subject: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="computer-science">Computer Science</SelectItem>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="physics">Physics</SelectItem>
                          <SelectItem value="chemistry">Chemistry</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                          <SelectItem value="civil">Civil Engineering</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="schedule">Schedule</Label>
                      <Input
                        id="schedule"
                        placeholder="e.g., Mon, Wed, Fri - 10:00 AM"
                        value={formData.schedule}
                        onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of the class..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Class...
                        </>
                      ) : (
                        'Create Class'
                      )}
                    </Button>
                  </CardContent>
                </form>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
