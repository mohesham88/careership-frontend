import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Project } from '../types/project';
import api from '../services/api';

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;
            try {
                const response = await api.get(`/projects/${id}/`);
                setProject(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load project');
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error || !project) {
        return <div className="text-red-500 text-center">{error || 'Project not found'}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link to="/projects" className="text-blue-600 hover:text-blue-800">
                        ← Back to Projects
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-3xl font-bold">{project.name}</h1>
                        {project.is_premium && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                Premium
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
                            <div className="space-y-3">
                                <p className="text-gray-600">
                                    {project.description || 'No description available'}
                                </p>
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                                        {project.category}
                                    </span>
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                                        {project.difficulty_level}
                                    </span>
                                </div>
                                <p className="text-gray-600">
                                    Team Size: {project.max_team_size} members
                                </p>
                                <p className="text-gray-600">
                                    Created: {project.created_at}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
                        <div className="space-y-4">
                            {project.tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium">{task.name}</h3>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                            {task.difficulty_level}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mt-2">
                                        Created: {task.created_at}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 