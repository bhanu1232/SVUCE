import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface DepartmentData {
    id: string;
    name: string;
    tagline: string;
    description: string;
    vision: string;
    mission: string[];
    hod: string;
    programs: string[];
    labs: string[];
    contact: {
        email: string;
        phone: string;
    };
}

const DepartmentManager = () => {
    const [selectedDept, setSelectedDept] = useState('civil');
    const [deptData, setDeptData] = useState<DepartmentData | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const departments = [
        { id: 'civil', name: 'Civil Engineering' },
        { id: 'eee', name: 'Electrical & Electronics' },
        { id: 'mechanical', name: 'Mechanical Engineering' },
        { id: 'ece', name: 'Electronics & Communication' },
        { id: 'cse', name: 'Computer Science' },
        { id: 'chemical', name: 'Chemical Engineering' },
    ];

    useEffect(() => {
        fetchDepartment();
    }, [selectedDept]);

    const fetchDepartment = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'departments', selectedDept);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setDeptData(docSnap.data() as DepartmentData);
            } else {
                // Initialize with empty data
                setDeptData({
                    id: selectedDept,
                    name: departments.find(d => d.id === selectedDept)?.name || '',
                    tagline: '',
                    description: '',
                    vision: '',
                    mission: [''],
                    hod: '',
                    programs: [''],
                    labs: [''],
                    contact: { email: '', phone: '' },
                });
            }
        } catch (error) {
            console.error('Error fetching department:', error);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!deptData) return;
        setSaving(true);
        try {
            await setDoc(doc(db, 'departments', selectedDept), deptData);
            alert('Department updated successfully!');
        } catch (error) {
            console.error('Error saving department:', error);
            alert('Failed to save department');
        }
        setSaving(false);
    };

    const addArrayItem = (field: 'mission' | 'programs' | 'labs') => {
        if (!deptData) return;
        setDeptData({
            ...deptData,
            [field]: [...deptData[field], ''],
        });
    };

    const updateArrayItem = (field: 'mission' | 'programs' | 'labs', index: number, value: string) => {
        if (!deptData) return;
        const newArray = [...deptData[field]];
        newArray[index] = value;
        setDeptData({ ...deptData, [field]: newArray });
    };

    const removeArrayItem = (field: 'mission' | 'programs' | 'labs', index: number) => {
        if (!deptData) return;
        setDeptData({
            ...deptData,
            [field]: deptData[field].filter((_, i) => i !== index),
        });
    };

    if (loading || !deptData) {
        return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iare-blue"></div></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
                <Button onClick={handleSave} disabled={saving} className="bg-iare-blue">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Select Department</label>
                    <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Department Name</label>
                    <Input
                        value={deptData.name}
                        onChange={(e) => setDeptData({ ...deptData, name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Tagline</label>
                    <Input
                        value={deptData.tagline}
                        onChange={(e) => setDeptData({ ...deptData, tagline: e.target.value })}
                        placeholder="e.g., Building the Foundation of Modern Society"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                        value={deptData.description}
                        onChange={(e) => setDeptData({ ...deptData, description: e.target.value })}
                        rows={4}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Vision</label>
                    <Textarea
                        value={deptData.vision}
                        onChange={(e) => setDeptData({ ...deptData, vision: e.target.value })}
                        rows={3}
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Mission Points</label>
                        <Button size="sm" variant="outline" onClick={() => addArrayItem('mission')}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    {deptData.mission.map((item, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <Input
                                value={item}
                                onChange={(e) => updateArrayItem('mission', index, e.target.value)}
                                placeholder={`Mission point ${index + 1}`}
                            />
                            <Button size="sm" variant="outline" onClick={() => removeArrayItem('mission', index)}>
                                <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Programs Offered</label>
                        <Button size="sm" variant="outline" onClick={() => addArrayItem('programs')}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    {deptData.programs.map((item, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <Input
                                value={item}
                                onChange={(e) => updateArrayItem('programs', index, e.target.value)}
                                placeholder={`Program ${index + 1}`}
                            />
                            <Button size="sm" variant="outline" onClick={() => removeArrayItem('programs', index)}>
                                <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Laboratories</label>
                        <Button size="sm" variant="outline" onClick={() => addArrayItem('labs')}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    {deptData.labs.map((item, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <Input
                                value={item}
                                onChange={(e) => updateArrayItem('labs', index, e.target.value)}
                                placeholder={`Lab ${index + 1}`}
                            />
                            <Button size="sm" variant="outline" onClick={() => removeArrayItem('labs', index)}>
                                <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Head of Department</label>
                    <Input
                        value={deptData.hod}
                        onChange={(e) => setDeptData({ ...deptData, hod: e.target.value })}
                        placeholder="Dr. Name"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Contact Email</label>
                        <Input
                            value={deptData.contact.email}
                            onChange={(e) => setDeptData({ ...deptData, contact: { ...deptData.contact, email: e.target.value } })}
                            placeholder="hod_dept@svuce.edu.in"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Contact Phone</label>
                        <Input
                            value={deptData.contact.phone}
                            onChange={(e) => setDeptData({ ...deptData, contact: { ...deptData.contact, phone: e.target.value } })}
                            placeholder="+91-xxx-xxxxxxx"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentManager;
