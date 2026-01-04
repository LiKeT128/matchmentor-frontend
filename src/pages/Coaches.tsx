import { useEffect, useState } from 'react';
import { useCoaches } from '../hooks/useCoaches';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { Coach } from '../types';

export const Coaches = () => {
    const { coaches, loading, error, fetchCoaches } = useCoaches();
    const [specializationFilter, setSpecializationFilter] = useState<string>('');
    const [availableOnly, setAvailableOnly] = useState(false);

    useEffect(() => {
        fetchCoaches({
            specialization: specializationFilter || undefined,
            available: availableOnly || undefined,
        });
    }, [fetchCoaches, specializationFilter, availableOnly]);

    return (
        <div className="min-h-screen bg-gray-900 pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Find a Coach</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Connect with experienced Dota 2 coaches to accelerate your improvement
                    </p>
                </div>

                {/* Filters */}
                <div className="card mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Specialization
                            </label>
                            <select
                                value={specializationFilter}
                                onChange={(e) => setSpecializationFilter(e.target.value)}
                                className="input-field"
                            >
                                <option value="">All specializations</option>
                                <option value="carry">Carry</option>
                                <option value="mid">Mid</option>
                                <option value="offlane">Offlane</option>
                                <option value="support">Support</option>
                                <option value="general">General</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={availableOnly}
                                    onChange={(e) => setAvailableOnly(e.target.checked)}
                                    className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-teal-500 focus:ring-teal-500"
                                />
                                <span className="text-gray-300">Available now</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                )}

                {/* Empty State */}
                {!loading && coaches.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No coaches found</h3>
                        <p className="text-gray-400">Try adjusting your filters</p>
                    </div>
                )}

                {/* Coach Grid */}
                {!loading && coaches.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coaches.map((coach) => (
                            <CoachCard key={coach.id} coach={coach} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

interface CoachCardProps {
    coach: Coach;
}

const CoachCard = ({ coach }: CoachCardProps) => {
    return (
        <div className="card hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-start gap-4 mb-4">
                <img
                    src={coach.avatar_url || 'https://via.placeholder.com/64'}
                    alt={coach.name}
                    className="w-16 h-16 rounded-full object-cover bg-gray-700"
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">{coach.name}</h3>
                        {coach.available && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                Available
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 mt-1">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span className="text-sm">{coach.rating.toFixed(1)}</span>
                        <span className="text-gray-500 text-sm">({coach.reviews_count} reviews)</span>
                    </div>
                </div>
            </div>

            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{coach.bio}</p>

            <div className="flex flex-wrap gap-2 mb-4">
                {coach.specialization.map((spec) => (
                    <span
                        key={spec}
                        className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-xs font-medium"
                    >
                        {spec}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div>
                    <span className="text-xl font-bold text-white">${coach.hourly_rate}</span>
                    <span className="text-gray-500 text-sm">/hour</span>
                </div>
                <button className="btn-primary">
                    Book Session
                </button>
            </div>
        </div>
    );
};

export default Coaches;
