import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Plus, Edit, Trash2, Save, X, TrendingUp, Building2, Users, Quote } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PlacementsManager = () => {
    const [activeTab, setActiveTab] = useState('stats');
    const [loading, setLoading] = useState(false);

    // Stats State
    const [stats, setStats] = useState<any>(null);
    const [statsForm, setStatsForm] = useState({
        year: '',
        placementRate: 0,
        highestPackage: '',
        averagePackage: '',
        companiesVisited: 0
    });
    const [editingStats, setEditingStats] = useState(false);

    // Recruiters State
    const [recruiters, setRecruiters] = useState<any[]>([]);
    const [recruiterForm, setRecruiterForm] = useState({
        companyName: '',
        logoUrl: '',
        order: 1
    });
    const [editingRecruiterId, setEditingRecruiterId] = useState<string | null>(null);
    const [showRecruiterForm, setShowRecruiterForm] = useState(false);

    // Placements State
    const [placements, setPlacements] = useState<any[]>([]);
    const [placementForm, setPlacementForm] = useState({
        studentName: '',
        company: '',
        package: '',
        department: '',
        year: '',
        imageUrl: ''
    });
    const [editingPlacementId, setEditingPlacementId] = useState<string | null>(null);
    const [showPlacementForm, setShowPlacementForm] = useState(false);

    // Testimonials State
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [testimonialForm, setTestimonialForm] = useState({
        studentName: '',
        company: '',
        quote: '',
        imageUrl: '',
        year: ''
    });
    const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
    const [showTestimonialForm, setShowTestimonialForm] = useState(false);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        await Promise.all([
            fetchStats(),
            fetchRecruiters(),
            fetchPlacements(),
            fetchTestimonials()
        ]);
    };

    // Stats Functions
    const fetchStats = async () => {
        const q = query(collection(db, 'placementStats'), orderBy('year', 'desc'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            setStats({ id: doc.id, ...doc.data() });
            setStatsForm(doc.data() as any);
        }
    };

    const handleSaveStats = async () => {
        setLoading(true);
        try {
            if (stats?.id) {
                await updateDoc(doc(db, 'placementStats', stats.id), statsForm);
            } else {
                await addDoc(collection(db, 'placementStats'), statsForm);
            }
            await fetchStats();
            setEditingStats(false);
            alert('Statistics updated successfully!');
        } catch (error) {
            console.error('Error saving stats:', error);
            alert('Failed to save statistics');
        }
        setLoading(false);
    };

    // Recruiters Functions
    const fetchRecruiters = async () => {
        const q = query(collection(db, 'recruiters'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        const data: any[] = [];
        snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        setRecruiters(data);
    };

    const handleSaveRecruiter = async () => {
        setLoading(true);
        try {
            if (editingRecruiterId) {
                await updateDoc(doc(db, 'recruiters', editingRecruiterId), recruiterForm);
            } else {
                await addDoc(collection(db, 'recruiters'), recruiterForm);
            }
            await fetchRecruiters();
            resetRecruiterForm();
        } catch (error) {
            console.error('Error saving recruiter:', error);
            alert('Failed to save recruiter');
        }
        setLoading(false);
    };

    const handleEditRecruiter = (item: any) => {
        setRecruiterForm(item);
        setEditingRecruiterId(item.id);
        setShowRecruiterForm(true);
    };

    const handleDeleteRecruiter = async (id: string) => {
        if (confirm('Are you sure you want to delete this recruiter?')) {
            await deleteDoc(doc(db, 'recruiters', id));
            await fetchRecruiters();
        }
    };

    const resetRecruiterForm = () => {
        setRecruiterForm({ companyName: '', logoUrl: '', order: recruiters.length + 1 });
        setEditingRecruiterId(null);
        setShowRecruiterForm(false);
    };

    // Placements Functions
    const fetchPlacements = async () => {
        const q = query(collection(db, 'placements'), orderBy('year', 'desc'));
        const snapshot = await getDocs(q);
        const data: any[] = [];
        snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        setPlacements(data);
    };

    const handleSavePlacement = async () => {
        setLoading(true);
        try {
            if (editingPlacementId) {
                await updateDoc(doc(db, 'placements', editingPlacementId), placementForm);
            } else {
                await addDoc(collection(db, 'placements'), placementForm);
            }
            await fetchPlacements();
            resetPlacementForm();
        } catch (error) {
            console.error('Error saving placement:', error);
            alert('Failed to save placement');
        }
        setLoading(false);
    };

    const handleEditPlacement = (item: any) => {
        setPlacementForm(item);
        setEditingPlacementId(item.id);
        setShowPlacementForm(true);
    };

    const handleDeletePlacement = async (id: string) => {
        if (confirm('Are you sure you want to delete this placement record?')) {
            await deleteDoc(doc(db, 'placements', id));
            await fetchPlacements();
        }
    };

    const resetPlacementForm = () => {
        setPlacementForm({ studentName: '', company: '', package: '', department: '', year: '', imageUrl: '' });
        setEditingPlacementId(null);
        setShowPlacementForm(false);
    };

    // Testimonials Functions
    const fetchTestimonials = async () => {
        const q = query(collection(db, 'testimonials'), orderBy('year', 'desc'));
        const snapshot = await getDocs(q);
        const data: any[] = [];
        snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        setTestimonials(data);
    };

    const handleSaveTestimonial = async () => {
        setLoading(true);
        try {
            if (editingTestimonialId) {
                await updateDoc(doc(db, 'testimonials', editingTestimonialId), testimonialForm);
            } else {
                await addDoc(collection(db, 'testimonials'), testimonialForm);
            }
            await fetchTestimonials();
            resetTestimonialForm();
        } catch (error) {
            console.error('Error saving testimonial:', error);
            alert('Failed to save testimonial');
        }
        setLoading(false);
    };

    const handleEditTestimonial = (item: any) => {
        setTestimonialForm(item);
        setEditingTestimonialId(item.id);
        setShowTestimonialForm(true);
    };

    const handleDeleteTestimonial = async (id: string) => {
        if (confirm('Are you sure you want to delete this testimonial?')) {
            await deleteDoc(doc(db, 'testimonials', id));
            await fetchTestimonials();
        }
    };

    const resetTestimonialForm = () => {
        setTestimonialForm({ studentName: '', company: '', quote: '', imageUrl: '', year: '' });
        setEditingTestimonialId(null);
        setShowTestimonialForm(false);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Placements Management</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                    <TabsTrigger value="recruiters">Recruiters</TabsTrigger>
                    <TabsTrigger value="placements">Placements</TabsTrigger>
                    <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                </TabsList>

                {/* Statistics Tab */}
                <TabsContent value="stats" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Placement Statistics</h2>
                        {!editingStats && (
                            <Button onClick={() => setEditingStats(true)} className="bg-iare-blue">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Statistics
                            </Button>
                        )}
                    </div>

                    {editingStats ? (
                        <div className="bg-white rounded-lg shadow p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Academic Year</label>
                                    <Input
                                        value={statsForm.year}
                                        onChange={(e) => setStatsForm({ ...statsForm, year: e.target.value })}
                                        placeholder="e.g., 2023-24"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Placement Rate (%)</label>
                                    <Input
                                        type="number"
                                        value={statsForm.placementRate}
                                        onChange={(e) => setStatsForm({ ...statsForm, placementRate: Number(e.target.value) })}
                                        placeholder="e.g., 95"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Highest Package</label>
                                    <Input
                                        value={statsForm.highestPackage}
                                        onChange={(e) => setStatsForm({ ...statsForm, highestPackage: e.target.value })}
                                        placeholder="e.g., 45 LPA"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Average Package</label>
                                    <Input
                                        value={statsForm.averagePackage}
                                        onChange={(e) => setStatsForm({ ...statsForm, averagePackage: e.target.value })}
                                        placeholder="e.g., 8.5 LPA"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Companies Visited</label>
                                    <Input
                                        type="number"
                                        value={statsForm.companiesVisited}
                                        onChange={(e) => setStatsForm({ ...statsForm, companiesVisited: Number(e.target.value) })}
                                        placeholder="e.g., 150"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button onClick={handleSaveStats} disabled={loading} className="bg-iare-blue">
                                    <Save className="w-4 h-4 mr-2" />
                                    {loading ? 'Saving...' : 'Save'}
                                </Button>
                                <Button variant="outline" onClick={() => setEditingStats(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : stats ? (
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Year</p>
                                    <p className="text-xl font-bold">{stats.year}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Placement Rate</p>
                                    <p className="text-xl font-bold text-blue-600">{stats.placementRate}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Highest Package</p>
                                    <p className="text-xl font-bold text-green-600">{stats.highestPackage}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Average Package</p>
                                    <p className="text-xl font-bold text-purple-600">{stats.averagePackage}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Companies</p>
                                    <p className="text-xl font-bold text-orange-600">{stats.companiesVisited}+</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">No statistics available. Click "Edit Statistics" to add data.</p>
                    )}
                </TabsContent>

                {/* Recruiters Tab */}
                <TabsContent value="recruiters" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Top Recruiters ({recruiters.length})</h2>
                        {!showRecruiterForm && (
                            <Button onClick={() => setShowRecruiterForm(true)} className="bg-iare-blue">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Recruiter
                            </Button>
                        )}
                    </div>

                    {showRecruiterForm && (
                        <div className="bg-white rounded-lg shadow p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">
                                    {editingRecruiterId ? 'Edit Recruiter' : 'Add New Recruiter'}
                                </h3>
                                <Button variant="ghost" onClick={resetRecruiterForm}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Company Name</label>
                                    <Input
                                        value={recruiterForm.companyName}
                                        onChange={(e) => setRecruiterForm({ ...recruiterForm, companyName: e.target.value })}
                                        placeholder="e.g., Google"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Logo URL</label>
                                    <Input
                                        value={recruiterForm.logoUrl}
                                        onChange={(e) => setRecruiterForm({ ...recruiterForm, logoUrl: e.target.value })}
                                        placeholder="https://example.com/logo.png"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Display Order</label>
                                    <Input
                                        type="number"
                                        value={recruiterForm.order}
                                        onChange={(e) => setRecruiterForm({ ...recruiterForm, order: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button onClick={handleSaveRecruiter} disabled={loading} className="bg-iare-blue">
                                    <Save className="w-4 h-4 mr-2" />
                                    {loading ? 'Saving...' : 'Save'}
                                </Button>
                                <Button variant="outline" onClick={resetRecruiterForm}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        {recruiters.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <Building2 className="w-8 h-8 text-iare-blue" />
                                    <div>
                                        <h3 className="font-semibold">{item.companyName}</h3>
                                        <p className="text-sm text-gray-500">Order: {item.order}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEditRecruiter(item)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDeleteRecruiter(item.id)}>
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* Placements Tab */}
                <TabsContent value="placements" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Placement Records ({placements.length})</h2>
                        {!showPlacementForm && (
                            <Button onClick={() => setShowPlacementForm(true)} className="bg-iare-blue">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Placement
                            </Button>
                        )}
                    </div>

                    {showPlacementForm && (
                        <div className="bg-white rounded-lg shadow p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">
                                    {editingPlacementId ? 'Edit Placement' : 'Add New Placement'}
                                </h3>
                                <Button variant="ghost" onClick={resetPlacementForm}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Student Name</label>
                                    <Input
                                        value={placementForm.studentName}
                                        onChange={(e) => setPlacementForm({ ...placementForm, studentName: e.target.value })}
                                        placeholder="e.g., Rajesh Kumar"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Company</label>
                                    <Input
                                        value={placementForm.company}
                                        onChange={(e) => setPlacementForm({ ...placementForm, company: e.target.value })}
                                        placeholder="e.g., Google"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Package</label>
                                    <Input
                                        value={placementForm.package}
                                        onChange={(e) => setPlacementForm({ ...placementForm, package: e.target.value })}
                                        placeholder="e.g., 42 LPA"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Department</label>
                                    <Input
                                        value={placementForm.department}
                                        onChange={(e) => setPlacementForm({ ...placementForm, department: e.target.value })}
                                        placeholder="e.g., CSE"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Year</label>
                                    <Input
                                        value={placementForm.year}
                                        onChange={(e) => setPlacementForm({ ...placementForm, year: e.target.value })}
                                        placeholder="e.g., 2024"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Image URL (Optional)</label>
                                    <Input
                                        value={placementForm.imageUrl}
                                        onChange={(e) => setPlacementForm({ ...placementForm, imageUrl: e.target.value })}
                                        placeholder="https://example.com/photo.jpg"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button onClick={handleSavePlacement} disabled={loading} className="bg-iare-blue">
                                    <Save className="w-4 h-4 mr-2" />
                                    {loading ? 'Saving...' : 'Save'}
                                </Button>
                                <Button variant="outline" onClick={resetPlacementForm}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        {placements.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <Users className="w-8 h-8 text-iare-blue" />
                                    <div>
                                        <h3 className="font-semibold">{item.studentName}</h3>
                                        <p className="text-sm text-iare-blue">{item.company} • {item.package}</p>
                                        <p className="text-xs text-gray-500">{item.department} • {item.year}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEditPlacement(item)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDeletePlacement(item.id)}>
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* Testimonials Tab */}
                <TabsContent value="testimonials" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Student Testimonials ({testimonials.length})</h2>
                        {!showTestimonialForm && (
                            <Button onClick={() => setShowTestimonialForm(true)} className="bg-iare-blue">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Testimonial
                            </Button>
                        )}
                    </div>

                    {showTestimonialForm && (
                        <div className="bg-white rounded-lg shadow p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">
                                    {editingTestimonialId ? 'Edit Testimonial' : 'Add New Testimonial'}
                                </h3>
                                <Button variant="ghost" onClick={resetTestimonialForm}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Student Name</label>
                                    <Input
                                        value={testimonialForm.studentName}
                                        onChange={(e) => setTestimonialForm({ ...testimonialForm, studentName: e.target.value })}
                                        placeholder="e.g., Priya Sharma"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Company</label>
                                    <Input
                                        value={testimonialForm.company}
                                        onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                                        placeholder="e.g., Microsoft"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-2">Quote/Testimonial</label>
                                    <Textarea
                                        value={testimonialForm.quote}
                                        onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                                        placeholder="Student's testimonial about their experience..."
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Year</label>
                                    <Input
                                        value={testimonialForm.year}
                                        onChange={(e) => setTestimonialForm({ ...testimonialForm, year: e.target.value })}
                                        placeholder="e.g., 2023"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Image URL (Optional)</label>
                                    <Input
                                        value={testimonialForm.imageUrl}
                                        onChange={(e) => setTestimonialForm({ ...testimonialForm, imageUrl: e.target.value })}
                                        placeholder="https://example.com/photo.jpg"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button onClick={handleSaveTestimonial} disabled={loading} className="bg-iare-blue">
                                    <Save className="w-4 h-4 mr-2" />
                                    {loading ? 'Saving...' : 'Save'}
                                </Button>
                                <Button variant="outline" onClick={resetTestimonialForm}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        {testimonials.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <Quote className="w-6 h-6 text-iare-blue" />
                                        <div>
                                            <h3 className="font-semibold">{item.studentName}</h3>
                                            <p className="text-sm text-iare-blue">{item.company} • {item.year}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEditTestimonial(item)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleDeleteTestimonial(item.id)}>
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-gray-700 italic">"{item.quote}"</p>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PlacementsManager;
