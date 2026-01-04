import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { AnalysisInsight } from '../types';

export const Results = () => {
    const { matchId } = useParams<{ matchId: string }>();
    const { currentAnalysis, loading, error, fetchAnalysis } = useMatches();

    useEffect(() => {
        if (matchId) {
            fetchAnalysis(matchId);
        }
    }, [matchId, fetchAnalysis]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-16">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mb-4" />
                    <p className="text-gray-400">Loading analysis...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-16">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Failed to Load Analysis</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <Link to="/upload" className="btn-primary">
                        Upload Another Replay
                    </Link>
                </div>
            </div>
        );
    }

    if (!currentAnalysis) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-16">
                <div className="text-center">
                    <p className="text-gray-400">No analysis data available</p>
                    <Link to="/upload" className="btn-primary mt-4 inline-block">
                        Upload a Replay
                    </Link>
                </div>
            </div>
        );
    }

    const analysis = currentAnalysis;
    const isWin = analysis.result === 'win';

    return (
        <div className="min-h-screen bg-gray-900 pt-24 pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Match Analysis</h1>
                        <p className="text-gray-400">Hero: {analysis.hero}</p>
                    </div>
                    <div className={`px-6 py-3 rounded-lg font-bold text-lg ${isWin ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {isWin ? 'VICTORY' : 'DEFEAT'}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                    <StatCard label="Duration" value={formatDuration(analysis.duration)} />
                    <StatCard label="Kills" value={analysis.kills} highlight />
                    <StatCard label="Deaths" value={analysis.deaths} />
                    <StatCard label="Assists" value={analysis.assists} highlight />
                    <StatCard label="GPM" value={analysis.gpm} />
                    <StatCard label="XPM" value={analysis.xpm} />
                    <StatCard label="Last Hits" value={analysis.last_hits} />
                    <StatCard label="Denies" value={analysis.denies} />
                </div>

                {/* Insights */}
                {analysis.insights && analysis.insights.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Insights & Recommendations</h2>
                        <div className="space-y-4">
                            {analysis.insights.map((insight, index) => (
                                <InsightCard key={index} insight={insight} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/upload" className="btn-primary text-center flex-1">
                        Analyze Another Match
                    </Link>
                    <Link to="/coaches" className="btn-secondary text-center flex-1">
                        Find a Coach
                    </Link>
                </div>
            </div>
        </div>
    );
};

interface StatCardProps {
    label: string;
    value: string | number;
    highlight?: boolean;
}

const StatCard = ({ label, value, highlight }: StatCardProps) => (
    <div className="card text-center">
        <p className="text-gray-400 text-sm mb-1">{label}</p>
        <p className={`text-2xl font-bold ${highlight ? 'text-teal-400' : 'text-white'}`}>
            {value}
        </p>
    </div>
);

interface InsightCardProps {
    insight: AnalysisInsight;
}

const InsightCard = ({ insight }: InsightCardProps) => {
    const typeConfig = {
        tip: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Tip' },
        improvement: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Improvement' },
        strength: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Strength' },
        weakness: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Weakness' },
    };

    const config = typeConfig[insight.type];

    return (
        <div className="card">
            <div className="flex items-start gap-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
                    {config.label}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{insight.title}</h3>
                    <p className="text-gray-400">{insight.description}</p>
                    <p className="text-sm text-gray-500 mt-2">Category: {insight.category}</p>
                </div>
            </div>
        </div>
    );
};

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default Results;
