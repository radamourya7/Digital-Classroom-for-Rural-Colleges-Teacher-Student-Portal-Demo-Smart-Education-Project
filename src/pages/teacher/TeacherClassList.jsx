import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { teacherAPI } from '@/api/teacherAPI';
import { Plus, Users, BookOpen, Clock, Copy, Check, Trash2, Pencil } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TeacherClassList() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', subject: '', schedule: '' });

    const fetchClasses = async () => {
        try {
            const { data } = await teacherAPI.getClasses();
            setClasses(data);
        } catch (error) {
            console.error("Failed to fetch classes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedId(code);
        toast({ title: "Class code copied!" });
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this class? This action cannot be undone.")) return;
        try {
            await teacherAPI.deleteClass(id);
            toast({ title: "Class deleted successfully" });
            fetchClasses();
        } catch (error) {
            toast({ title: "Failed to delete class", variant: "destructive" });
        }
    };

    const openEditDialog = (cls) => {
        setSelectedClass(cls);
        setEditFormData({ name: cls.name, subject: cls.subject, schedule: cls.schedule || '' });
        setEditDialogOpen(true);
    };

    const handleEditSubmit = async () => {
        if (!selectedClass) return;
        try {
            await teacherAPI.updateClass(selectedClass._id, editFormData);
            toast({ title: "Class updated successfully" });
            setEditDialogOpen(false);
            fetchClasses();
        } catch (error) {
            toast({ title: "Failed to update class", variant: "destructive" });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} showMenuButton />
            <div className="flex">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">My Classes</h1>
                        <Link to="/teacher/create-class">
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" /> Create Class
                            </Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-10">Loading classes...</div>
                    ) : classes.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground mb-4">You haven't created any classes yet.</p>
                            <Link to="/teacher/create-class">
                                <Button>Create your first class</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {classes.map((cls) => (
                                <Card key={cls._id} className="hover:shadow-card-hover transition-all">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-4">
                                                {cls.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Class Code</span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{cls.code}</code>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyCode(cls.code)}>
                                                        {copiedId === cls.code ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl">{cls.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{cls.subject}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                <span>{cls.students?.length || 0} Students</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{cls.schedule || 'No schedule'}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link to={`/live/teacher/${cls._id}`} className="flex-1">
                                                <Button className="w-full gap-2" variant="default">
                                                    <BookOpen className="h-4 w-4" /> Class
                                                </Button>
                                            </Link>
                                            <Button variant="outline" size="icon" onClick={() => openEditDialog(cls)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="icon" onClick={() => handleDelete(cls._id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </main>

                {/* Edit Class Dialog */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Class</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Class Name</Label>
                                <Input
                                    id="name"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    value={editFormData.subject}
                                    onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="schedule">Schedule</Label>
                                <Input
                                    id="schedule"
                                    value={editFormData.schedule}
                                    onChange={(e) => setEditFormData({ ...editFormData, schedule: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleEditSubmit}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
