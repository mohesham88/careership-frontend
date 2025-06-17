import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../types/project';
import api from '../services/api';

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get("/projects/");
                setProjects(response.data.results);
                setLoading(false);
            } catch (err) {
                setError('Failed to load projects');
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Projects</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-semibold">{project.name}</h2>
                            {project.is_premium && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                    Premium
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <p className="text-gray-600">{project.description || 'No description available'}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>Difficulty: {project.difficulty_level}</span>
                                <span>Team Size: {project.max_team_size}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    {project.category}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
} 