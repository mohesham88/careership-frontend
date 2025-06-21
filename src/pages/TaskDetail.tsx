import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Task } from '../types/project';
import api from '../services/api';

export default function TaskDetail() {
    const { projectId, taskId } = useParams<{ projectId: string; taskId: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            if (!projectId || !taskId) return;
            try {
                const response = await api.get(`/projects/${projectId}/tasks/${taskId}/`);
                setTask(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load task');
                setLoading(false);
            }
        };

        fetchTask();
    }, [projectId, taskId]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error || !task) {
        return <div className="text-red-500 text-center">{error || 'Task not found'}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link to={`/projects/${projectId}`} className="text-blue-600 hover:text-blue-800">
                        ← Back to Project
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-3xl font-bold">{task.name}</h1>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                            {task.difficulty_level}
                        </span>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-3">Description</h2>
                            <p className="text-gray-600">{task.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-3">Task Details</h2>
                                <div className="space-y-3">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Duration:</span> {task.duration_in_days} day{task.duration_in_days !== 1 ? 's' : ''}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Created:</span> {task.created_at}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Slug:</span> {task.slug}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold mb-3">Tests</h2>
                                <div className="space-y-2">
                                    {task.tests.length > 0 ? (
                                        task.tests.map((test, index) => (
                                            <div
                                                key={index}
                                                className="p-3 bg-gray-50 rounded-lg"
                                            >
                                                <p className="text-gray-700">{test}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No tests available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 